import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as unknown as { role?: string })?.role;

    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const [totalUsers, totalTests, totalLessons, recentUsers, flaggedResults, topScores] =
      await Promise.all([
        prisma.user.count(),
        prisma.typingResult.count(),
        prisma.typingLesson.count(),
        prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: { id: true, name: true, email: true, role: true, xp: true, level: true, createdAt: true },
        }),
        prisma.typingResult.findMany({
          where: { isFlagged: true },
          orderBy: { createdAt: 'desc' },
          take: 15,
        }),
        prisma.leaderboardEntry.findMany({
          orderBy: { wpm: 'desc' },
          take: 10,
        }),
      ]);

    const aggregate = await prisma.typingResult.aggregate({
      _avg: { wpm: true, accuracy: true },
      _max: { wpm: true },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTests,
        totalLessons,
        avgPlatformWpm: Math.round((aggregate._avg.wpm || 0) * 10) / 10,
        avgPlatformAcc: Math.round((aggregate._avg.accuracy || 0) * 10) / 10,
        highestWpm: aggregate._max.wpm || 0,
      },
      recentUsers,
      flaggedResults,
      topScores,
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as unknown as { role?: string })?.role;

    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { action, userId, newRole, resultId } = body;

    if (action === 'update_role' && userId && newRole) {
      await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      });
      return NextResponse.json({ success: true, message: 'User role updated' });
    }

    if (action === 'unflag_result' && resultId) {
      await prisma.typingResult.update({
        where: { id: resultId },
        data: { isFlagged: false },
      });
      return NextResponse.json({ success: true, message: 'Result unflagged' });
    }

    if (action === 'delete_result' && resultId) {
      await prisma.typingResult.delete({
        where: { id: resultId },
      });
      return NextResponse.json({ success: true, message: 'Result deleted' });
    }

    return NextResponse.json({ error: 'Unknown admin action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing admin action:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
