import '../globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Providers } from '@/components/providers';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext", "vietnamese"] });

const meta = {
  title: 'Evelyn Smart Tutor',
  description:
    'Evelyn Smart Tutor, a tutor that is smart enough to use several interfaces to interact with your students.',
};
export const metadata: Metadata = {
  ...meta,
  title: {
    default: 'Evelyn Smart Tutor',
    template: `%s - Evelyn Smart Tutor`,
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
      </body>
      <GoogleAnalytics gaId="G-RXGK3N19GT" />
    </html>
  );
}

export const runtime = 'edge';
