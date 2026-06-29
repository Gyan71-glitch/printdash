import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700", "800", "900"],
});



export const metadata: Metadata = {
  metadataBase: new URL("https://www.theindianberg.com"),
  title: {
    default: "The Indian Berg | Breaking barriers, shaping narrative",
    template: "%s | The Indian Berg",
  },
  description: "Advanced investigative reporting on modern cyber crime, forensic analysis, and the global digital underground.",
  keywords: ["The Indian Berg", "news", "investigative journalism", "breaking news", "India news", "world news"],
  authors: [{ name: "The Indian Berg Team" }],
  openGraph: {
    title: "The Indian Berg | Breaking barriers, shaping narrative",
    description: "Advanced investigative reporting on modern cyber crime, forensic analysis, and the global digital underground.",
    url: "https://www.theindianberg.com",
    siteName: "The Indian Berg",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "The Indian Berg Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Indian Berg | Breaking barriers, shaping narrative",
    description: "Advanced investigative reporting on modern cyber crime, forensic analysis, and the global digital underground.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "7deVizf4rqAroBS-kvThd17ozyDmceWGj8OVeodfRpc",
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
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-black text-black dark:text-zinc-100">
        <NextTopLoader
          color="#dc2626"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #dc2626,0 0 5px #dc2626"
          zIndex={1600}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
