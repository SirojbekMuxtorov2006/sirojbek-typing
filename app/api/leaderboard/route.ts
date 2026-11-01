import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'all_time';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const entries = await prisma.leaderboardEntry.findMany({
      where: {
        period,
        isFlagged: false,
      },
      orderBy: [{ wpm: 'desc' }, { accuracy: 'desc' }],
      take: Math.min(100, Math.max(1, limit)),
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
