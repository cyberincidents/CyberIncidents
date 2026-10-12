import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SmoothScroll from "@/components/smooth-scroll";
import "./globals.css";
import PageLoader from "@/components/layout/PageLoader";


const SITE_URL = "https://cyberincidents.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "CyberIncidents - Cyber Incidents, Cybersecurity News & Threat Intelligence",
    template: "%s | CyberIncidents",
  },

  description:
    "CyberIncidents (Cyber Incidents) is a cybersecurity platform covering cyber incidents, cyber attacks, security breaches, threat intelligence, incident investigations, security research, and cybersecurity news.",

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
    "CyberIncidents",
    "Cyber Incidents",
    "Cyber Incident",
    "cyberincidents.in",
    "cyber incidents news",
    "cybersecurity news",
    "cyber incident reports",
    "cyber attack news",
    "cybersecurity threat intelligence",
    "security breaches",
    "incident investigations",
    "cybersecurity research",
    "information security",
    "network security",
    "cloud security",
    "application security",
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
    title:
      "CyberIncidents - Cyber Incidents, Cybersecurity News & Threat Intelligence",
    description:
      "Follow CyberIncidents for cybersecurity news, cyber incident reports, threat intelligence, security breach investigations, and security research.",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "CyberIncidents - Cyber Incidents, Cybersecurity News & Threat Intelligence",
    description:
      "Cybersecurity news, cyber incident reports, threat intelligence, and security research from CyberIncidents.",
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
        <PageLoader />
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