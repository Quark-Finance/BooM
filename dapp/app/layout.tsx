import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeProvider from "@/components/context/themeProvider";
import { WalletProviders } from "@/components/context/walletProvider";
import { Header } from "@/components/Header";
import Particles from '@/components/ui/particles';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Boo Market",
  description: "Swap anywhere & anytime, even if it doen't exist",
  openGraph: {
    title: "Boo Market",
    description: "Swap anywhere & anytime, even if it doen't exist",
    images: [{ url: "/og-image.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0f0f0f" />
        <meta name="msapplication-TileColor" content="#0f0f0f" />
        <meta name="theme-color" content="#0f0f0f" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen overflow-hidden`}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider>
            <WalletProviders>
              {/* <BackgroundWrapper> */}
              <main>
                <Particles
                  className="absolute inset-0"
                  quantity={75}
                  ease={95}
                  size={1.8}
                  refresh
                />
                <Header />
                {children}
              </main>
              <ToastContainer />
              {/* </BackgroundWrapper> */}
            </WalletProviders>
          </ThemeProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
