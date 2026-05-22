import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://mdshare.app";
const SITE_NAME = "mdshare";
const TAGLINE =
  "Share markdown as a real web page — not a raw gist, not a signup wall.";
const DESCRIPTION =
  "Paste markdown, get a beautifully rendered shareable link. Three editorial themes, syntax-highlighted code, slug from the title. No signup until you publish.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "mdshare — share markdown as a beautiful link",
    template: "%s — mdshare",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "share markdown online",
    "publish markdown",
    "markdown to web page",
    "markdown pastebin",
    "share readme as link",
    "HackMD alternative",
    "telegra.ph alternative",
    "gist alternative",
    "markdown sharing",
    "publish .md file",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "productivity",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "mdshare — share markdown as a beautiful link",
    description: TAGLINE,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "mdshare — share markdown as a beautiful link",
    description: TAGLINE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

const APP_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: "Productivity",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Three editorial reading themes (Paper, Ink, Console)",
    "Shiki syntax highlighting",
    "Slug derived from the title",
    "No signup until publish",
    "Author dashboard with view counts",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_JSON_LD) }}
        />
      </body>
    </html>
  );
}
