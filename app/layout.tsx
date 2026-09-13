import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberIncidents",
  description:
    "Cybersecurity incidents, research, analysis and security awareness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <Navbar />

          <main>{children}</main>

          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}