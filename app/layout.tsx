import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SmoothScroll from "@/components/smooth-scroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberIncidents - Threats today, a safer tomorrow",
  description:
    "Cybersecurity incidents, research, analysis and security awareness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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