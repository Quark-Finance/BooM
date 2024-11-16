import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";
import Navigation from '@/components/navigation'
import Header from "@/components/header";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeProvider from "@/components/context/themeProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BooM",
  description: "That'simply Boo Market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    }
  );
  return (
    <html lang="en">
      <NextAuthProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider>
            <ErudaProvider>
              <MiniKitProvider>
                <Header />
                <body className={`${inter.className} pb-20 mt-12`}>{children}</body>
                <ToastContainer />
                <Navigation />
              </MiniKitProvider>
            </ErudaProvider>
          </ThemeProvider>
        </NextThemesProvider>
      </NextAuthProvider>
    </html>
  );
}
