const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Users
  const passwordHashAdmin = await bcrypt.hash('admin123', 10);
  const passwordHashUser = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sirojbektyping.com' },
    update: {},
    create: {
      name: 'Sirojbek Admin',
      email: 'admin@sirojbektyping.com',
      password: passwordHashAdmin,
      role: 'ADMIN',
      bio: 'Creator and Lead Architect of SirojbekTyping platform.',
      typingGoalWpm: 120,
      preferredLanguage: 'uz',
      preferredTheme: 'dark',
      xp: 4500,
      level: 18,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@sirojbektyping.com' },
    update: {},
    create: {
      name: 'Dilshod Typist',
      email: 'user@sirojbektyping.com',
      password: passwordHashUser,
      role: 'USER',
      bio: 'Aspiring speed typist from Tashkent, practicing daily!',
      typingGoalWpm: 90,
      preferredLanguage: 'en',
      preferredTheme: 'dark',
      xp: 1250,
      level: 6,
    },
  });

  // 2. User Statistics
  await prisma.userStatistics.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      totalTests: 184,
      totalTimeSeconds: 11040,
      avgWpm: 112.4,
      bestWpm: 138.6,
      avgAccuracy: 98.7,
      totalCharacters: 61800,
      totalErrors: 820,
      currentStreak: 14,
      bestStreak: 28,
      lastActiveDate: new Date().toISOString().split('T')[0],
    },
  });

  await prisma.userStatistics.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      totalTests: 45,
      totalTimeSeconds: 2700,
      avgWpm: 74.2,
      bestWpm: 89.0,
      avgAccuracy: 96.5,
      totalCharacters: 16700,
      totalErrors: 580,
      currentStreak: 4,
      bestStreak: 7,
      lastActiveDate: new Date().toISOString().split('T')[0],
    },
  });

  // 3. Typing Lessons (12 structured lessons)
  const lessons = [
    {
      lessonNumber: 1,
      title: 'Introduction to Touch Typing',
      description: 'Master the fundamental home row position and finger placement.',
      level: 'beginner',
      targetKeys: 'f,j,space',
      instructions: 'Place your left index finger on F and right index finger on J. Feel the tactile ridges on these keys. Press Space with your thumbs.',
      practiceText: 'f j f j fj jf f f j j fj fj jf jf ffff jjjj f j f j space',
      minWpm: 15,
      minAccuracy: 90,
      order: 1,
    },
    {
      lessonNumber: 2,
      title: 'Home Row Keys (D, K)',
      description: 'Expand your reach to the middle fingers on the home row.',
      level: 'beginner',
      targetKeys: 'd,k,f,j',
      instructions: 'Use your left middle finger for D and right middle finger for K. Keep your palms slightly elevated.',
      practiceText: 'd k d k dk kd df jk kj fd dk kd dkfj jfdk dddd kkkk dkfj',
      minWpm: 20,
      minAccuracy: 92,
      order: 2,
    },
    {
      lessonNumber: 3,
      title: 'Left Hand Home Row (A, S)',
      description: 'Engage your ring and pinky fingers on the left hand.',
      level: 'beginner',
      targetKeys: 'a,s,d,f',
      instructions: 'Left pinky rests on A, left ring finger on S. Press smoothly without pressing hard.',
      practiceText: 'a s d f as df fd sa asdf asdf fad sad daf saff asda fads',
      minWpm: 22,
      minAccuracy: 92,
      order: 3,
    },
    {
      lessonNumber: 4,
      title: 'Right Hand Home Row (L, ;)',
      description: 'Engage your ring and pinky fingers on the right hand.',
      level: 'beginner',
      targetKeys: 'j,k,l,;',
      instructions: 'Right ring finger on L, right pinky on semicolon (;). Practice full home row flow.',
      practiceText: 'j k l ; jk l; ;l kj asdf jkl; a;sldkfj a;sldkfj fads fall flask',
      minWpm: 25,
      minAccuracy: 93,
      order: 4,
    },
    {
      lessonNumber: 5,
      title: 'Upper Row Keys (E, R, U, I)',
      description: 'Reach up from the home row to the high frequency vowels and consonants.',
      level: 'intermediate',
      targetKeys: 'e,r,u,i',
      instructions: 'Left middle reaches up to E, left index to R. Right index reaches up to U, right middle to I. Return your fingers back to the home row after each strike.',
      practiceText: 'e r u i re ur er ru fire ride safe sure user file real life side',
      minWpm: 30,
      minAccuracy: 94,
      order: 5,
    },
    {
      lessonNumber: 6,
      title: 'Upper Row Complete (Q, W, T, Y, O, P)',
      description: 'Master the remaining top row letters.',
      level: 'intermediate',
      targetKeys: 'q,w,t,y,o,p',
      instructions: 'Left pinky reaches to Q, ring to W, index to T. Right index reaches to Y, ring to O, pinky to P.',
      practiceText: 'quiet write power today yellow output quick worry people pretty route type',
      minWpm: 35,
      minAccuracy: 94,
      order: 6,
    },
    {
      lessonNumber: 7,
      title: 'Bottom Row Keys (Z, X, C, V, B, N, M)',
      description: 'Learn downward movement from the home row into the bottom row.',
      level: 'intermediate',
      targetKeys: 'z,x,c,v,b,n,m',
      instructions: 'Reach downward with left fingers for Z, X, C, V, B and right fingers for N, M, comma, and period.',
      practiceText: 'zoom next civic voice back name music brave complex vibration zinc calm',
      minWpm: 35,
      minAccuracy: 94,
      order: 7,
    },
    {
      lessonNumber: 8,
      title: 'Capital Letters & Shift Keys',
      description: 'Coordinate both hands using opposite Shift keys for capital letters.',
      level: 'intermediate',
      targetKeys: 'Shift,A-Z',
      instructions: 'Use your right pinky for Left Shift when typing right-hand letters, and left pinky for Right Shift when typing left-hand letters.',
      practiceText: 'Tashkent Samarkand Bukhara Uzbekistan London Tokyo Paris NewYork SirojbekTyping',
      minWpm: 38,
      minAccuracy: 95,
      order: 8,
    },
    {
      lessonNumber: 9,
      title: 'Numbers & Top Row Numbers (1-0)',
      description: 'Develop accuracy hitting the number row without looking down.',
      level: 'advanced',
      targetKeys: '1,2,3,4,5,6,7,8,9,0',
      instructions: 'Reach up two rows from the home row. Keep a mental map of finger-to-number pairing.',
      practiceText: '123 456 789 2026 1998 42 100 365 24 7 8080 3000 5432 999 1000',
      minWpm: 32,
      minAccuracy: 93,
      order: 9,
    },
    {
      lessonNumber: 10,
      title: 'Punctuation & Special Symbols',
      description: 'Type commas, periods, quotes, brackets, and code symbols smoothly.',
      level: 'advanced',
      targetKeys: '.,?!\'":;()-+=',
      instructions: 'Learn the locations of standard punctuation. Build muscle memory for periods and commas.',
      practiceText: 'Hello, world! How are you today? "Practice makes perfect," they said; indeed it does.',
      minWpm: 35,
      minAccuracy: 95,
      order: 10,
    },
    {
      lessonNumber: 11,
      title: 'Full Keyboard Flow & Rhythm',
      description: 'Combine all characters, capitalization, and punctuation into flowing rhythm.',
      level: 'advanced',
      targetKeys: 'all',
      instructions: 'Focus on rhythm and smooth cadence rather than sudden bursts of speed.',
      practiceText: 'Speed is merely the byproduct of consistent, unhurried accuracy. Never rush a keystroke.',
      minWpm: 45,
      minAccuracy: 96,
      order: 11,
    },
    {
      lessonNumber: 12,
      title: 'Professional Mastery & Speed Test',
      description: 'Final benchmark test simulating real-world engineering and writing tasks.',
      level: 'advanced',
      targetKeys: 'all',
      instructions: 'Maintain composure, minimize errors, and type at your peak sustainable pace.',
      practiceText: 'The quick brown fox jumps over the lazy dog. Continuous improvement requires deliberate practice, unwavering discipline, and analytical self-reflection.',
      minWpm: 55,
      minAccuracy: 97,
      order: 12,
    },
  ];

  for (const lesson of lessons) {
    await prisma.typingLesson.upsert({
      where: { lessonNumber: lesson.lessonNumber },
      update: lesson,
      create: lesson,
    });
  }

  // 4. Practice Texts
  const practiceTexts = [
    {
      title: 'Top 100 English Common Words',
      category: 'words',
      language: 'en',
      difficulty: 'easy',
      tags: 'common,english,basics',
      text: 'the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us',
    },
    {
      title: 'Inspiring Wisdom Quotes',
      category: 'quotes',
      language: 'en',
      difficulty: 'medium',
      tags: 'quotes,wisdom,inspiration',
      text: 'Simplicity is prerequisite for reliability. Any fool can write code that a computer can understand. Good programmers write code that humans can understand. Focus on the journey, not the destination. Joy is found not in finishing an activity but in doing it.',
    },
    {
      title: "O'zbekcha Mashhur So'zlar (Uzbek Words)",
      category: 'uzbek',
      language: 'uz',
      difficulty: 'medium',
      tags: 'uzbek,words,native',
      text: "kelajak taraqqiyot bilim samara mehnat intilish muvaffaqiyat ustoz dasturlash texnologiya o'zbekiston yutuq sabr harakat maqsad quvonch do'stlik oila tinchlik obodlik tafakkur qudrat",
    },
    {
      title: "O'zbekcha Maqollar va Hikmatlar (Uzbek Sentences)",
      category: 'uzbek',
      language: 'uz',
      difficulty: 'medium',
      tags: 'uzbek,sentences,wisdom',
      text: "Bilagi zo'r birni yiqar, bilimi zo'r mingni yiqar. Ilm olish igna bilan quduq qazish kabidir. Mehnatdan kelsa boylik, turmush bo'lar chiroyli. Tilga e'tibor - elga e'tibor. O'zbekiston kelajagi buyuk davlat.",
    },
    {
      title: 'Русские Пословицы и Предложения (Russian)',
      category: 'russian',
      language: 'ru',
      difficulty: 'medium',
      tags: 'russian,sentences',
      text: 'Терпение и труд всё перетрут. Век живи, век учись. Без труда не выловишь и рыбку из пруда. Семь раз отмерь, один раз отрежь. Повторение — мать учения.',
    },
    {
      title: 'JavaScript & TypeScript Syntax',
      category: 'programming',
      language: 'en',
      difficulty: 'hard',
      tags: 'code,javascript,typescript',
      text: 'const calculateWpm = (chars: number, seconds: number): number => Math.round((chars / 5) / (seconds / 60)); export async function fetchData<T>(url: string): Promise<T> { const res = await fetch(url); return res.json(); }',
    },
    {
      title: 'Python Core & Data Structures',
      category: 'programming',
      language: 'en',
      difficulty: 'hard',
      tags: 'code,python',
      text: 'def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    return [x for x in arr if x < pivot] + [x for x in arr if x == pivot] + [x for x in arr if x > pivot]',
    },
  ];

  for (const pt of practiceTexts) {
    const existing = await prisma.practiceText.findFirst({ where: { title: pt.title } });
    if (!existing) {
      await prisma.practiceText.create({ data: pt });
    }
  }

  // 5. Achievements
  const achievements = [
    {
      code: 'first_test',
      title: 'First Keystrokes',
      description: 'Completed your very first typing speed test.',
      icon: 'Zap',
      category: 'speed',
      xpReward: 50,
      conditionType: 'test_count',
      threshold: 1,
    },
    {
      code: 'speed_30',
      title: 'Cadence Starter',
      description: 'Achieved 30+ WPM on any verified test.',
      icon: 'Clock',
      category: 'speed',
      xpReward: 75,
      conditionType: 'wpm_threshold',
      threshold: 30,
    },
    {
      code: 'speed_50',
      title: 'Swift Fingers',
      description: 'Achieved 50+ WPM on any verified test.',
      icon: 'Flame',
      category: 'speed',
      xpReward: 100,
      conditionType: 'wpm_threshold',
      threshold: 50,
    },
    {
      code: 'speed_75',
      title: 'Rhythm Master',
      description: 'Achieved 75+ WPM on any verified test.',
      icon: 'Activity',
      category: 'speed',
      xpReward: 200,
      conditionType: 'wpm_threshold',
      threshold: 75,
    },
    {
      code: 'speed_100',
      title: 'Century Club (100 WPM)',
      description: 'Broke the 100 WPM sound barrier!',
      icon: 'Award',
      category: 'speed',
      xpReward: 500,
      conditionType: 'wpm_threshold',
      threshold: 100,
    },
    {
      code: 'perfect_accuracy',
      title: 'Flawless Execution',
      description: 'Achieved 100% accuracy on a completed test.',
      icon: 'Target',
      category: 'accuracy',
      xpReward: 250,
      conditionType: 'accuracy_threshold',
      threshold: 100,
    },
    {
      code: 'streak_7',
      title: 'Unbreakable Habit',
      description: 'Maintained a 7-day daily typing streak.',
      icon: 'Calendar',
      category: 'streak',
      xpReward: 300,
      conditionType: 'streak_days',
      threshold: 7,
    },
    {
      code: 'tests_100',
      title: 'Century Veteran',
      description: 'Completed 100 typing tests on SirojbekTyping.',
      icon: 'Trophy',
      category: 'endurance',
      xpReward: 600,
      conditionType: 'test_count',
      threshold: 100,
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: ach,
      create: ach,
    });
  }

  // 6. Daily Challenge
  const todayStr = new Date().toISOString().split('T')[0];
  await prisma.dailyChallenge.upsert({
    where: { date: todayStr },
    update: {},
    create: {
      date: todayStr,
      title: "Daily Sprint: 60s English Speed Challenge",
      description: "Hit at least 70 WPM with 95% accuracy in a standard 60-second typing test.",
      targetMode: "time",
      targetWpm: 70,
      targetAccuracy: 95,
      targetDuration: 60,
      xpReward: 150,
    },
  });

  // 7. Realistic Leaderboard Entries
  const leaderboardMockData = [
    { username: 'Sirojbek (Admin)', wpm: 138.6, rawWpm: 142.2, accuracy: 99.1, country: 'UZ', period: 'all_time' },
    { username: 'Alisher_Code', wpm: 126.4, rawWpm: 130.0, accuracy: 98.4, country: 'UZ', period: 'all_time' },
    { username: 'CyberNinja', wpm: 119.8, rawWpm: 122.5, accuracy: 97.8, country: 'US', period: 'all_time' },
    { username: 'Madina_T', wpm: 114.2, rawWpm: 117.0, accuracy: 99.0, country: 'UZ', period: 'all_time' },
    { username: 'KeyMaster99', wpm: 108.7, rawWpm: 111.4, accuracy: 98.2, country: 'DE', period: 'all_time' },
    { username: 'Dilshod Typist', wpm: 89.0, rawWpm: 93.5, accuracy: 96.5, country: 'UZ', period: 'all_time' },
    { username: 'Elena_Swift', wpm: 102.3, rawWpm: 105.1, accuracy: 98.9, country: 'KZ', period: 'all_time' },
    { username: 'SpeedyGonzales', wpm: 97.5, rawWpm: 101.2, accuracy: 95.8, country: 'UK', period: 'all_time' },
    { username: 'Jasur_Dev', wpm: 94.6, rawWpm: 98.0, accuracy: 97.1, country: 'UZ', period: 'all_time' },
    { username: 'TypingPro_AZ', wpm: 91.2, rawWpm: 94.0, accuracy: 97.5, country: 'AZ', period: 'all_time' },

    // Daily
    { username: 'Sirojbek (Admin)', wpm: 134.2, rawWpm: 137.0, accuracy: 98.8, country: 'UZ', period: 'daily' },
    { username: 'Madina_T', wpm: 112.5, rawWpm: 115.0, accuracy: 99.2, country: 'UZ', period: 'daily' },
    { username: 'CyberNinja', wpm: 115.0, rawWpm: 118.2, accuracy: 97.5, country: 'US', period: 'daily' },
    { username: 'Dilshod Typist', wpm: 87.4, rawWpm: 91.0, accuracy: 96.8, country: 'UZ', period: 'daily' },

    // Weekly
    { username: 'Sirojbek (Admin)', wpm: 136.5, rawWpm: 140.0, accuracy: 99.0, country: 'UZ', period: 'weekly' },
    { username: 'Alisher_Code', wpm: 125.1, rawWpm: 129.0, accuracy: 98.2, country: 'UZ', period: 'weekly' },
    { username: 'CyberNinja', wpm: 118.0, rawWpm: 121.0, accuracy: 97.9, country: 'US', period: 'weekly' },
  ];

  for (const entry of leaderboardMockData) {
    await prisma.leaderboardEntry.create({
      data: {
        username: entry.username,
        wpm: entry.wpm,
        rawWpm: entry.rawWpm,
        accuracy: entry.accuracy,
        country: entry.country,
        period: entry.period,
        testMode: 'time-60',
      },
    });
  }

  // 8. Sample Typing Results for history chart
  const baseDate = new Date();
  for (let i = 10; i >= 0; i--) {
    const testDate = new Date(baseDate.getTime() - i * 86400000 * 0.8);
    const mockWpm = 95 + Math.sin(i) * 15 + Math.random() * 8;
    await prisma.typingResult.create({
      data: {
        userId: admin.id,
        isGuest: false,
        testMode: 'time',
        duration: 60,
        language: 'en',
        wpm: Math.round(mockWpm * 10) / 10,
        rawWpm: Math.round((mockWpm + 4) * 10) / 10,
        accuracy: Math.round((97 + Math.random() * 2.8) * 10) / 10,
        errorCount: Math.floor(Math.random() * 4),
        correctChars: Math.round(mockWpm * 5),
        incorrectChars: Math.floor(Math.random() * 4),
        consistency: Math.round((92 + Math.random() * 6) * 10) / 10,
        createdAt: testDate,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
