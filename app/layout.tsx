import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import { AI } from './action';
import { Header } from '@/components/header';
import { Providers } from '@/components/providers';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"] });

const meta = {
  title: 'EverLearns AI Tutor Demo',
  description:
    'A demo of the EverLearns AI Tutor, a tutor that is smart enough to use several interfaces to interact with your students.',
};
export const metadata: Metadata = {
  ...meta,
  title: {
    default: 'EverLearns AI Tutor Demo',
    template: `%s - EverLearns AI Tutor Demo`,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  twitter: {
    ...meta,
    card: 'summary_large_image',
    site: '@everlearns',
  },
  openGraph: {
    ...meta,
    locale: 'en-US',
    type: 'website',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} font-sans antialiased`}
      >
        <Toaster />
        {/* @ts-ignore */}
        <AI>
          <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex flex-col flex-1 bg-muted/50 dark:bg-background">
                {children}
              </main>
            </div>
          </Providers>
        </AI>
        <Analytics />
      </body>
    </html>
  );
}

export const runtime = 'edge';
