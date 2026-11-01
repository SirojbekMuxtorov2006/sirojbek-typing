import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthProvider from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'SirojbekTyping — Professional Typing Speed Test & Learning Platform',
  description:
    'Master your typing speed, accuracy, and productivity with SirojbekTyping. Touch typing curriculum, speed tests, weak-key training, and global leaderboard.',
  keywords: [
    'typing test',
    'typing speed test',
    'wpm test',
    'touch typing',
    'sirojbektyping',
    'keyboard speed',
    'typing lessons',
  ],
  authors: [{ name: 'Sirojbek' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-background text-text-primary antialiased font-sans flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
