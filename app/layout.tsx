import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const SITE_URL = "https://dochouse.nbarkiya.xyz";
const SITE_NAME = "DocHouse";
const OG_IMAGE =
  "https://res.cloudinary.com/dvt5vkfwz/image/upload/dochouse_og_url.png";
const TAGLINE =
  "Share markdown as a public web page. No Gist viewer, no signup wall.";
const DESCRIPTION =
  "Paste markdown into DocHouse and get a public URL that renders it as a web page. Three reading themes, Shiki syntax highlighting, slug from your title. No signup until you click publish.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DocHouse: share markdown as a link",
    template: "%s · DocHouse",
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
    "DocHouse",
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
    title: "DocHouse: share markdown as a link",
    description: TAGLINE,
    locale: "en_US",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "DocHouse: share markdown as a link",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DocHouse: share markdown as a link",
    description: TAGLINE,
    images: [OG_IMAGE],
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
      suppressHydrationWarning
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_JSON_LD) }}
        />
      </body>
    </html>
  );
}
