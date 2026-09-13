import Image from "next/image";
import Link from "next/link";

import { fields } from "@/lib/data/fields";

import NotificationSignup from "@/components/notifications/NotificationSignup";

export default function Footer() {
  return (
    <footer className="bg-[#050607] text-white">
      {/* Top cyan accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent opacity-60" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Main footer */}
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block"
              aria-label="CyberIncidents home"
            >
              <Image
                src="/brand/cyberincidents-logo.png"
                alt="CyberIncidents"
                width={420}
                height={100}
                className="h-auto w-[210px] object-contain"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/50">
              Explore cybersecurity incidents, threats, vulnerabilities,
              privacy and defensive technologies through focused and readable
              articles.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00d9ff]" />

              <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                Threats Today. A Safer Tomorrow.
              </span>
            </div>
            <NotificationSignup />
          </div>

          {/* Fields */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#00d9ff]">
              Explore Fields
            </h2>

            <ul className="mt-5 space-y-3">
              {fields.map((field) => (
                <li key={field.id}>
                  <Link
                    href={`/field/${field.slug}`}
                    className="group flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
                  >
                    <span className="h-px w-0 bg-[#00d9ff] transition-all duration-200 group-hover:w-3" />

                    {field.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Website */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#00d9ff]">
              CyberIncidents
            </h2>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/search"
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  Search
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col gap-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white/30">
            © {new Date().getFullYear()} CyberIncidents. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <span className="text-white/25">
              Cybersecurity Intelligence Platform
            </span>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="text-[#00a8ff]/60">ZERO TRACE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}