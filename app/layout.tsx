import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthProvider from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'onlytyping — free online typing speed test & practice',
  description:
    'Free online typing speed test and practice platform. Test your words per minute, improve accuracy, and master touch typing with instant feedback.',
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-[#F8F9FA] text-[#1E232E] antialiased flex flex-col min-h-screen font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
