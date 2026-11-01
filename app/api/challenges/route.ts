import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as unknown as { id?: string })?.id;
    const todayStr = new Date().toISOString().split('T')[0];

    let challenge = await prisma.dailyChallenge.findUnique({
      where: { date: todayStr },
      include: userId
        ? {
            userChallenges: {
              where: { userId },
            },
          }
        : undefined,
    });

    if (!challenge) {
      challenge = await prisma.dailyChallenge.create({
        data: {
          date: todayStr,
          title: 'Daily Velocity: 60s Speed Sprint',
          description: 'Reach 65+ WPM with at least 95% accuracy in a 60-second test.',
          targetMode: 'time',
          targetWpm: 65,
          targetAccuracy: 95,
          targetDuration: 60,
          xpReward: 150,
        },
        include: userId
          ? {
              userChallenges: {
                where: { userId },
              },
            }
          : undefined,
      });
    }

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 });
  }
}
