import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://vendroi.app'),
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  title: 'VendROI - Vending Machine ROI Calculator',
  description:
    'Calculate ROI, compare locations, and get a clear investment verdict before buying your first vending machine. The all-in-one app for vending operators.',
  keywords:
    'vending machine ROI, vending calculator, vending machine investment, vending profit calculator, vending location comparison, vending business app',
  openGraph: {
    title: 'VendROI - Know Before You Invest',
    description:
      'Calculate ROI, compare locations, and get a clear investment verdict all before buying your first vending machine.',
    url: 'https://vendroi.app',
    siteName: 'VendROI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VendROI - Vending Machine ROI Calculator',
    description:
      'Calculate ROI, compare locations, and get a clear investment verdict before buying your first vending machine.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
