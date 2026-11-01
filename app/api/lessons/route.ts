import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as unknown as { id?: string })?.id;

    const lessons = await prisma.typingLesson.findMany({
      orderBy: { order: 'asc' },
      include: userId
        ? {
            progress: {
              where: { userId },
            },
          }
        : undefined,
    });

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as unknown as { id?: string })?.id;
    const body = await req.json();
    const { lessonId, wpm, accuracy } = body;

    if (!lessonId || wpm === undefined || accuracy === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!userId) {
      // For guest, return success response so frontend can save locally
      return NextResponse.json({ success: true, guest: true });
    }

    const lesson = await prisma.typingLesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const completed = wpm >= lesson.minWpm && accuracy >= lesson.minAccuracy;

    const existingProgress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        completed: existingProgress?.completed || completed,
        bestWpm: Math.max(existingProgress?.bestWpm || 0, wpm),
        bestAccuracy: Math.max(existingProgress?.bestAccuracy || 0, accuracy),
        attempts: (existingProgress?.attempts || 0) + 1,
        completedAt: completed && !existingProgress?.completed ? new Date() : existingProgress?.completedAt,
      },
      create: {
        userId,
        lessonId,
        completed,
        bestWpm: wpm,
        bestAccuracy: accuracy,
        attempts: 1,
        completedAt: completed ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, progress, completed });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return NextResponse.json({ error: 'Failed to record lesson progress' }, { status: 500 });
  }
}
