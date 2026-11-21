import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rent With You | Rent, Buy & Move - Real Estate in Gurgaon & NCR',
  description:
    'Find your next home with the widest choice of rentals, homes and commercial spaces. Trusted owners, dealers, packers & movers, and furniture solutions in Gurgaon and NCR.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased scroll-smooth ${plusJakartaSans.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans selection:bg-[#E59A38] selection:text-white overflow-x-clip">
        <AuthProvider>
          <WishlistProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
