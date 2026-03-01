import "../globals.css";
export const dynamic = 'force-dynamic';
import { Poppins } from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import NavigationEvents from "@/components/NavigationEvents";
import TrackingWrapper from "@/components/TrackingWrapper";
import { Suspense } from "react";

import { getThemeData } from "@/utils/apis";
import { getDictionary } from "@/dictionaries/getDictionary";
import { TranslationProvider } from "@/context/TranslationContext";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["200", "500", "700"],
});

import { ThemeProvider } from "@/context/ThemeContext";

export async function generateMetadata() {
  const theme = await getThemeData();
  const siteName = theme?.site?.name || "CracksWall";
  const tagline = theme?.site?.tagline || "Full Version Software";
  const metaDescription = theme?.site?.metaDescription || "Download the latest software and tools";
  return {
    title: `${siteName} - ${tagline}`,
    description: metaDescription,
    icons: {
      icon: theme?.site?.favicon || "/images/zeezfaveicon.png",
    }
  }
}

export default async function RootLayout({ children, params }) {
  const theme = await getThemeData();
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  // RTL languages
  const isRtl = ['ar', 'he', 'fa', 'ur'].includes(locale);
  const dir = isRtl ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            --primary-color: ${theme?.site?.primaryColor || '#9333ea'};
            --secondary-color: ${theme?.site?.secondaryColor || '#7c3aed'};
          }
        `}} />
      </head>
      <body className={`${poppins.variable} font-sans bg-[#F5F5F5]`} suppressHydrationWarning>
        <ThemeProvider initialTheme={theme}>
          <TranslationProvider dictionary={dictionary}>
            <TrackingWrapper>
              <header>
                <Navigation />
              </header>
              <Loader />
              <Suspense fallback={null}>
                <NavigationEvents />
              </Suspense>
              <main suppressHydrationWarning>{children}</main>

              <Footer />
            </TrackingWrapper>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
