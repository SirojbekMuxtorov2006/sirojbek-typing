import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { validateTypingScore } from '@/lib/anti-cheat';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      wpm,
      rawWpm,
      accuracy,
      duration,
      correctChars,
      incorrectChars,
      totalKeystrokes = correctChars + (incorrectChars || 0),
      consistency = 90,
      testMode = 'time',
      language = 'en',
      mistakeDetails = {},
      timelineData = [],
      guestName,
    } = body;

    // Run anti-cheat validation
    const antiCheat = validateTypingScore({
      wpm,
      rawWpm,
      accuracy,
      duration,
      correctChars,
      totalKeystrokes,
    });

    if (!antiCheat.isValid) {
      return NextResponse.json(
        { error: 'Invalid score', details: antiCheat.reason },
        { status: 400 }
      );
    }

    const userId = (session?.user as unknown as { id?: string })?.id;
    const isGuest = !userId;

    // Save typing result
    const result = await prisma.typingResult.create({
      data: {
        userId: userId || null,
        isGuest,
        guestName: isGuest ? guestName || 'Guest Typist' : undefined,
        testMode,
        duration: Math.round(duration),
        language,
        wpm: Math.round(wpm * 10) / 10,
        rawWpm: Math.round(rawWpm * 10) / 10,
        accuracy: Math.round(accuracy * 10) / 10,
        errorCount: incorrectChars || 0,
        correctChars,
        incorrectChars: incorrectChars || 0,
        consistency: Math.round(consistency * 10) / 10,
        mistakeDetails: JSON.stringify(mistakeDetails),
        timelineData: JSON.stringify(timelineData),
        isFlagged: antiCheat.isFlagged,
      },
    });

    // Save to leaderboard if eligible and not flagged
    if (!antiCheat.isFlagged && wpm >= 30) {
      const username = session?.user?.name || guestName || 'Guest Typist';
      await prisma.leaderboardEntry.create({
        data: {
          userId: userId || null,
          username,
          wpm: Math.round(wpm * 10) / 10,
          rawWpm: Math.round(rawWpm * 10) / 10,
          accuracy: Math.round(accuracy * 10) / 10,
          period: 'all_time',
          testMode: `${testMode}-${duration}`,
          country: 'UZ',
        },
      });
    }

    // Update user statistics & XP if logged in
    const unlockedAchievements: string[] = [];
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { userStatistics: true, userAchievements: { include: { achievement: true } } },
      });

      if (user) {
        const stats = user.userStatistics;
        const currentTotalTests = (stats?.totalTests || 0) + 1;
        const currentBestWpm = Math.max(stats?.bestWpm || 0, wpm);
        const newAvgWpm = stats
          ? Math.round(((stats.avgWpm * stats.totalTests + wpm) / currentTotalTests) * 10) / 10
          : wpm;
        const newAvgAcc = stats
          ? Math.round(((stats.avgAccuracy * stats.totalTests + accuracy) / currentTotalTests) * 10) / 10
          : accuracy;

        const todayStr = new Date().toISOString().split('T')[0];
        let streak = stats?.currentStreak || 1;
        if (stats?.lastActiveDate) {
          const lastDate = new Date(stats.lastActiveDate);
          const diffDays = Math.round((new Date(todayStr).getTime() - lastDate.getTime()) / 86400000);
          if (diffDays === 1) streak += 1;
          else if (diffDays > 1) streak = 1;
        }

        const bestStreak = Math.max(stats?.bestStreak || 0, streak);

        await prisma.userStatistics.upsert({
          where: { userId },
          update: {
            totalTests: currentTotalTests,
            totalTimeSeconds: (stats?.totalTimeSeconds || 0) + duration,
            bestWpm: currentBestWpm,
            avgWpm: newAvgWpm,
            avgAccuracy: newAvgAcc,
            totalCharacters: (stats?.totalCharacters || 0) + correctChars,
            totalErrors: (stats?.totalErrors || 0) + (incorrectChars || 0),
            currentStreak: streak,
            bestStreak,
            lastActiveDate: todayStr,
          },
          create: {
            userId,
            totalTests: 1,
            totalTimeSeconds: duration,
            bestWpm: wpm,
            avgWpm: wpm,
            avgAccuracy: accuracy,
            totalCharacters: correctChars,
            totalErrors: incorrectChars || 0,
            currentStreak: 1,
            bestStreak: 1,
            lastActiveDate: todayStr,
          },
        });

        // XP points calculation: base 25 XP + (WPM * 0.5) + (acc > 95 ? 20 : 0)
        const earnedXp = Math.round(25 + wpm * 0.5 + (accuracy >= 95 ? 20 : 0));
        const newXp = (user.xp || 0) + earnedXp;
        const newLevel = Math.floor(Math.sqrt(newXp / 50)) + 1;

        await prisma.user.update({
          where: { id: userId },
          data: { xp: newXp, level: newLevel },
        });

        // Check for new achievements to unlock
        const alreadyUnlockedCodes = new Set(user.userAchievements.map((ua) => ua.achievement.code));
        const allAchievements = await prisma.achievement.findMany();

        for (const ach of allAchievements) {
          if (alreadyUnlockedCodes.has(ach.code)) continue;

          let unlock = false;
          if (ach.conditionType === 'test_count' && currentTotalTests >= ach.threshold) unlock = true;
          if (ach.conditionType === 'wpm_threshold' && wpm >= ach.threshold) unlock = true;
          if (ach.conditionType === 'accuracy_threshold' && accuracy >= ach.threshold) unlock = true;
          if (ach.conditionType === 'streak_days' && streak >= ach.threshold) unlock = true;

          if (unlock) {
            await prisma.userAchievement.create({
              data: { userId, achievementId: ach.id },
            });
            unlockedAchievements.push(ach.title);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      result,
      unlockedAchievements,
    });
  } catch (error) {
    console.error('Error saving typing result:', error);
    return NextResponse.json({ error: 'Failed to record test result' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as unknown as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ results: [] });
    }

    const results = await prisma.typingResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching typing results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
