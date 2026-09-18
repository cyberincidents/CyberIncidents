import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SmoothScroll from "@/components/smooth-scroll";
import "./globals.css";

const SITE_URL = "https://cyberincidents.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "CyberIncidents | Cybersecurity News, Threats & Analysis",
    template: "%s | CyberIncidents",
  },

  description:
    "CyberIncidents publishes cybersecurity news, threat intelligence, incident investigations, security research, emerging threats, and practical cybersecurity guides.",

  applicationName: "CyberIncidents",

  authors: [
    {
      name: "CyberIncidents",
      url: SITE_URL,
    },
  ],

  creator: "CyberIncidents",
  publisher: "CyberIncidents",

  keywords: [
    "cybersecurity",
    "cyber security",
    "cybersecurity news",
    "cyber threats",
    "cyber attacks",
    "threat intelligence",
    "security incidents",
    "incident investigation",
    "network security",
    "cloud security",
    "application security",
    "information security",
    "cybersecurity research",
    "cybersecurity analysis",
    "cybersecurity awareness",
    "cybersecurity guides",
  ],

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "CyberIncidents",
    title: "CyberIncidents | Cybersecurity News, Threats & Analysis",
    description:
      "Cybersecurity news, threat intelligence, incident investigations, security research, emerging threats, and practical cybersecurity guides.",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "CyberIncidents | Cybersecurity News, Threats & Analysis",
    description:
      "Cybersecurity news, threat intelligence, incident investigations, security research, emerging threats, and practical cybersecurity guides.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <ThemeProvider>
            <AuthSessionProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </AuthSessionProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}