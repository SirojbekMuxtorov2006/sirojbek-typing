import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as unknown as { id?: string })?.id;
    const body = await req.json();

    const {
      gameType,
      score,
      levelReached = 1,
      wordsCompleted = 0,
      accuracy = 100,
      maxCombo = 0,
      duration = 0,
      guestName,
    } = body;

    const gameSession = await prisma.gameSession.create({
      data: {
        userId: userId || null,
        isGuest: !userId,
        guestName: !userId ? guestName || 'Guest Gamer' : undefined,
        gameType,
        score: Math.round(score),
        levelReached,
        wordsCompleted,
        accuracy: Math.round(accuracy * 10) / 10,
        maxCombo,
        duration: Math.round(duration),
      },
    });

    if (userId) {
      // Award XP for gaming
      const xpBonus = Math.floor(score / 10);
      if (xpBonus > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: xpBonus } },
        });
      }
    }

    return NextResponse.json({ success: true, gameSession });
  } catch (error) {
    console.error('Error recording game session:', error);
    return NextResponse.json({ error: 'Failed to save game score' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameType = searchParams.get('gameType') || 'word_rush';

    const highScores = await prisma.gameSession.findMany({
      where: { gameType },
      orderBy: { score: 'desc' },
      take: 10,
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    return NextResponse.json({ highScores });
  } catch (error) {
    console.error('Error fetching game high scores:', error);
    return NextResponse.json({ error: 'Failed to fetch high scores' }, { status: 500 });
  }
}
