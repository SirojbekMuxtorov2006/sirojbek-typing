import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Email and password (min 6 characters) are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: passwordHash,
        role: 'USER',
        xp: 100,
        level: 1,
      },
    });

    // Initialize UserStatistics
    await prisma.userStatistics.create({
      data: {
        userId: user.id,
        totalTests: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
  }
}
