import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AppProvider } from "@/components/AppProvider";
import { AppShell } from "@/components/AppShell";
import { getSession } from "@/lib/auth";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Dinasti Musik | Premium Musical Instruments',
  description: 'Creative store untuk instrumen musik berkualitas.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getSession();

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#F8F9FA] dark:bg-[#080F0F] text-[#0D1317] dark:text-[#F3F0E8] transition-colors duration-200`}>
        <AppProvider initialUser={initialUser}>
          <AppShell>
            {children}
          </AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
