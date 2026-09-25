import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Target,
  Search,
  ShieldAlert,
  Cpu,
  Bug,
  Globe,
  Microscope,
  Cloud,
  Bot,
  Terminal,
  Quote,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | CyberIncidents",
  description:
    "Meet Rohith Hari and Parvathi Sunitha Nair — the cybersecurity analysts behind CyberIncidents.in specializing in threat detection, digital forensics, incident response, and cybersecurity intelligence.",
};

const rohithAreas = [
  { icon: Search, label: "Cyber Incident Investigation" },
  { icon: Target, label: "Threat Detection" },
  { icon: ShieldAlert, label: "Threat Hunting" },
  { icon: Shield, label: "Incident Response" },
  { icon: Cpu, label: "Cybersecurity Automation" },
  { icon: Bug, label: "Malware Analysis" },
  { icon: Globe, label: "Threat Intelligence" },
  { icon: Microscope, label: "Digital Forensics" },
  { icon: Cloud, label: "Cloud & Identity Security" },
  { icon: Bot, label: "AI in Cybersecurity" },
];

const parvathiAreas = [
  { icon: Search, label: "Cyber Incident Investigation" },
  { icon: Shield, label: "Incident Response" },
  { icon: ShieldAlert, label: "Threat Hunting" },
  { icon: Microscope, label: "Digital Forensics" },
  { icon: Bug, label: "Malware Analysis" },
  { icon: Globe, label: "Threat Intelligence" },
  { icon: Layers, label: "Detection Engineering" },
  { icon: Bot, label: "Cybersecurity Automation & AI" },
];

const parvathiTools = ["Splunk", "SentinelOne", "Microsoft Defender"];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#05070a] dark:text-zinc-100">
      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[#f4f7fb] px-4 py-10 transition-colors duration-200 dark:border-white/10 dark:bg-[#060b13] sm:px-6 sm:py-14 lg:px-8">
        {/* Light / Day Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 block opacity-75 dark:hidden"
          style={{
            backgroundImage: `
              radial-gradient(circle at 0.5px 0.5px, rgba(2, 132, 199, 0.35) 1.2px, transparent 0),
              linear-gradient(to right, rgba(2, 132, 199, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(2, 132, 199, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Dark / Night Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 hidden opacity-60 dark:block"
          style={{
            backgroundImage: `
              radial-gradient(circle at 0.5px 0.5px, rgba(56, 189, 248, 0.45) 1.2px, transparent 0),
              linear-gradient(to right, rgba(56, 189, 248, 0.09) 1px, transparent 0),
              linear-gradient(to bottom, rgba(56, 189, 248, 0.09) 1px, transparent 0)
            `,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -left-32 -top-40 h-[350px] w-[350px] rounded-full bg-[#00a8ff]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[-100px] top-1/2 h-[250px] w-[250px] -translate-y-1/2 rounded-full bg-[#00d9ff]/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#00a8ff]/30 bg-[#00a8ff]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#00a8ff]">
            <Shield className="h-3.5 w-3.5" />
            <span>CyberIncidents Analysts & Team</span>
          </div>

          {/* Main Title */}
          <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Uncovering the Story Behind{" "}
            <span className="bg-gradient-to-r from-[#00a8ff] via-[#0C7FC9] to-[#38bdf8] bg-clip-text text-transparent">
              Every Threat
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-zinc-400 sm:text-base">
            CyberIncidents is built by cybersecurity professionals dedicated to
            investigating security incidents, analysing attack behaviour, threat
            hunting, and sharing actionable defense knowledge.
          </p>

          {/* Navigation breadcrumbs */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-500">
            <Link
              href="/"
              className="transition-colors hover:text-[#00a8ff]"
            >
              Home
            </Link>

            <ChevronRight className="h-3 w-3" />

            <span className="text-slate-800 dark:text-zinc-200">
              About Us
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          ANALYSTS SECTION
      ========================================================= */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="space-y-10 lg:space-y-12">
          {/* =========================================================
              ANALYST 1: ROHITH HARI
          ========================================================= */}
          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#00a8ff]/50 dark:border-white/10 dark:bg-[#080d15]/95 sm:p-6 lg:p-8">
            {/* Top Accent Gradient Bar */}
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#00a8ff] via-[#0C7FC9] to-cyan-400 opacity-90" />

            <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
              {/* Left Column: Portrait */}
              <div className="flex flex-col items-center lg:col-span-4 lg:items-start">
                <div className="relative aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-xl border-2 border-[#00a8ff]/40 bg-[#00a8ff]/10 shadow-[0_0_25px_rgba(0,168,255,0.15)] transition-all duration-300 group-hover:border-[#00a8ff] sm:max-w-[280px]">
                  <Image
                    src="/about/img2.jpeg"
                    alt="Rohith Hari - Cybersecurity Analyst"
                    fill
                    sizes="(max-width: 768px) 260px, 280px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    priority
                  />

                  {/* Gradient Overlay at Bottom of Image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />

                  {/* Image Badge / Status Label */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/70 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#00a8ff]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00a8ff]" />
                      Active Analyst
                    </span>

                    <span className="rounded bg-[#00a8ff] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-white shadow">
                      Threat Detection
                    </span>
                  </div>
                </div>

                {/* Sub-badges beneath photo */}
                <div className="mt-3 flex w-full max-w-[260px] flex-col gap-1.5 sm:max-w-[280px]">
                    <div className="flex items-center gap-2 rounded-lg border border-slate-300/80 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                    <Briefcase className="h-4 w-4 shrink-0 text-[#00a8ff]" />
                    <span>Cybersecurity Analyst, Threat Hunter, SOC, SIEM, EDR, Threat Detection & Incident Response</span>
                  </div>

                    <div className="flex items-center gap-2 rounded-lg border border-slate-300/80 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                    <GraduationCap className="h-4 w-4 shrink-0 text-[#00a8ff]" />
                    <span>MBA in Operations Management</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Bio, Experience, Skills & Cyber to Me */}
              <div className="space-y-5 lg:col-span-8">
                {/* Header Info */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                      Rohith Hari
                    </h2>

                    <span className="inline-flex items-center gap-1 rounded-full border border-[#00a8ff]/30 bg-[#00a8ff]/10 px-2.5 py-0.5 text-xs font-bold text-[#00a8ff]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Cyber Analyst
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-bold text-[#00a8ff] sm:text-sm">
                    Cybersecurity Analyst | Threat Detection & Threat Hunting |
                    Automation
                  </p>
                </div>

                {/* About Me & Experience Blocks */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* About Me */}
                  <div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4 dark:border-white/10 dark:bg-[#0d1420]">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                      <Terminal className="h-4 w-4 text-[#00a8ff]" />
                      About Me
                    </h3>

                    <div className="mt-2.5 space-y-2 text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                      <p>
                        I’m a cybersecurity professional with a strong interest
                        in understanding cyber threats, investigating security
                        incidents, and finding the patterns behind malicious
                        activity. My work focuses on analysing security events,
                        investigating attack behaviour, identifying potential
                        threats, and helping strengthen security detection and
                        response.
                      </p>

                      <p>
                        I have worked across fintech, banking, healthcare, and
                        MSSP environments, where I’ve been involved in security
                        investigations, incident response, threat hunting, and
                        detection activities. I’m particularly interested in
                        threat detection, proactive hunting, cybersecurity
                        automation, AI, and threat intelligence.
                      </p>

                      <p>
                        Alongside cybersecurity, I’m pursuing an MBA in
                        Operations Management, which adds another perspective
                        to how I approach processes, efficiency,
                        decision-making, and technology-driven operations.
                      </p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-100/80 p-4 dark:border-white/10 dark:bg-[#0d1420]">
                    <div>
                      <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                        <Briefcase className="h-4 w-4 text-[#00a8ff]" />
                        Experience
                      </h3>

                      <p className="mt-2.5 text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                        My experience includes cyber incident investigation,
                        incident response, threat detection, threat hunting,
                        digital forensics, cloud and identity security, and
                        cybersecurity automation.
                      </p>

                      <p className="mt-2.5 text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                        I have worked on investigating malware, phishing,
                        ransomware, and identity-based threats, as well as
                        analysing attack chains and supporting containment and
                        remediation.
                      </p>
                    </div>

                    <div className="mt-3 border-t border-slate-200/80 pt-2.5 dark:border-white/10">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                        Primary Focus: Incident Response & Defensive Automation
                      </span>
                    </div>
                  </div>
                </div>

                {/* My Areas Grid */}
                <div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4.5 dark:border-white/10 dark:bg-[#0d1420]">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                    <Target className="h-4 w-4 text-[#00a8ff]" />
                    My Areas
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {rohithAreas.map((area) => {
                      const IconComponent = area.icon;

                      return (
                        <div
                          key={area.label}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-sm transition-all duration-200 hover:border-[#00a8ff] hover:text-[#00a8ff] dark:border-white/15 dark:bg-[#121b2b] dark:text-zinc-100 dark:hover:border-[#00a8ff] dark:hover:text-[#00a8ff]"
                        >
                          <IconComponent className="h-4 w-4 shrink-0 text-[#00a8ff]" />
                          <span className="whitespace-normal">
                            {area.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cyber to Me Quote Card */}
                <div className="relative overflow-hidden rounded-xl border border-[#00a8ff]/40 bg-gradient-to-r from-slate-900 via-[#0a1220] to-slate-950 p-4.5 text-white shadow-xl dark:from-[#00a8ff]/15 dark:via-[#090f1a] dark:to-[#05080f]">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#00a8ff]">
                      <Quote className="h-4 w-4" />
                      Cyber to Me
                    </h3>

                    <Sparkles className="h-4 w-4 text-[#00a8ff]" />
                  </div>

                  <blockquote className="mt-2.5 space-y-2 font-serif text-xs italic leading-relaxed text-zinc-100 sm:text-sm">
                    <p>
                      &ldquo;Cybersecurity is not just about finding what went
                      wrong — it’s about understanding why it happened and
                      learning from it.&rdquo;
                    </p>

                    <p>
                      &ldquo;I enjoy looking beyond individual alerts and
                      connecting the small pieces of information that reveal
                      the bigger picture. An unusual event, a suspicious
                      connection, or a seemingly harmless action can sometimes
                      be the first sign of something much bigger.&rdquo;
                    </p>

                    <p>
                      &ldquo;For me, cybersecurity is about thinking
                      critically, investigating with curiosity, and
                      continuously improving the way we detect and respond to
                      threats.&rdquo;
                    </p>
                  </blockquote>

                  <div className="mt-3 border-t border-white/15 pt-2.5 font-sans text-xs font-extrabold uppercase tracking-wider text-[#00a8ff]">
                    &ldquo;Every incident has a story. My goal is to understand
                    it.&rdquo;
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* =========================================================
              ANALYST 2: PARVATHI SUNITHA NAIR
          ========================================================= */}
          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#00a8ff]/50 dark:border-white/10 dark:bg-[#080d15]/95 sm:p-6 lg:p-8">
            {/* Top Accent Gradient Bar */}
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#00a8ff] via-[#0C7FC9] to-cyan-400 opacity-90" />

            <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
              {/* Left Column: Portrait */}
              <div className="flex flex-col items-center lg:col-span-4 lg:items-start">
                <div className="relative aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-xl border-2 border-[#00a8ff]/40 bg-[#00a8ff]/10 shadow-[0_0_25px_rgba(0,168,255,0.15)] transition-all duration-300 group-hover:border-[#00a8ff] sm:max-w-[280px]">
                  <Image
                    src="/about/img1.jpeg"
                    alt="Parvathi Sunitha Nair - Cybersecurity Analyst"
                    fill
                    sizes="(max-width: 768px) 260px, 280px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    priority
                  />

                  {/* Gradient Overlay at Bottom of Image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />

                  {/* Image Badge / Status Label */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/70 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#00a8ff]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00a8ff]" />
                      Active Analyst
                    </span>

                    <span className="rounded bg-[#00a8ff] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-white shadow">
                      Digital Forensics
                    </span>
                  </div>
                </div>

                {/* Sub-badges beneath photo */}
                <div className="mt-3 flex w-full max-w-[260px] flex-col gap-1.5 sm:max-w-[280px]">
                <div className="flex items-center gap-2 rounded-lg border border-slate-300/80 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                  <Briefcase className="h-4 w-4 shrink-0 text-[#00a8ff]" />
                  <span>Cybersecurity Analyst, SOC, DFIR, Detection Engineer</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-slate-300/80 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                    <GraduationCap className="h-4 w-4 shrink-0 text-[#00a8ff]" />
                    <span>MSc Computer Forensics & Cybersecurity</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-slate-300/80 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                    <Globe className="h-4 w-4 shrink-0 text-[#00a8ff]" />
                    <span>University of Greenwich London</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Bio, Experience, Skills & Cyber to Me */}
              <div className="space-y-5 lg:col-span-8">
                {/* Header Info */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                      Parvathi Sunitha Nair
                    </h2>

                    <span className="inline-flex items-center gap-1 rounded-full border border-[#00a8ff]/30 bg-[#00a8ff]/10 px-2.5 py-0.5 text-xs font-bold text-[#00a8ff]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Cyber Analyst
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-bold text-[#00a8ff] sm:text-sm">
                    Cybersecurity Analyst | MSc Computer Forensics &
                    Cybersecurity - University of Greenwich London
                  </p>
                </div>

                {/* About Me & Experience Blocks */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* About Me */}
                  <div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4 dark:border-white/10 dark:bg-[#0d1420]">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                      <Terminal className="h-4 w-4 text-[#00a8ff]" />
                      About Me
                    </h3>

                    <div className="mt-2.5 space-y-2 text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                      <p>
                        I’m a cybersecurity professional passionate about
                        investigating cyber incidents, understanding attacker
                        behaviour, and uncovering the story behind security
                        events.
                      </p>

                      <p>
                        Through CyberIncidents.in, I share investigations,
                        real-world incidents, technical analysis, and practical
                        cybersecurity knowledge.
                      </p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-100/80 p-4 dark:border-white/10 dark:bg-[#0d1420]">
                    <div>
                      <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                        <Briefcase className="h-4 w-4 text-[#00a8ff]" />
                        Experience
                      </h3>

                      <p className="mt-2.5 text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                        Experience in Security Operations, Incident Response,
                        Threat Hunting, Digital Forensics, Malware
                        Investigation and Detection Engineering, with
                        investigations across enterprise security environments
                        using tools such as Splunk, SentinelOne and Microsoft
                        Defender.
                      </p>
                    </div>

                    <div className="mt-3 border-t border-slate-200/80 pt-2.5 dark:border-white/10">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-zinc-300">
                          <Wrench className="h-3.5 w-3.5 text-[#00a8ff]" />
                          Platforms:
                        </span>

                        {parvathiTools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded border border-[#00a8ff]/40 bg-[#00a8ff]/15 px-2 py-0.5 text-xs font-bold text-[#00a8ff]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* My Areas Grid */}
                <div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4.5 dark:border-white/10 dark:bg-[#0d1420]">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                    <Target className="h-4 w-4 text-[#00a8ff]" />
                    My Areas
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {parvathiAreas.map((area) => {
                      const IconComponent = area.icon;

                      return (
                        <div
                          key={area.label}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-sm transition-all duration-200 hover:border-[#00a8ff] hover:text-[#00a8ff] dark:border-white/15 dark:bg-[#121b2b] dark:text-zinc-100 dark:hover:border-[#00a8ff] dark:hover:text-[#00a8ff]"
                        >
                          <IconComponent className="h-4 w-4 shrink-0 text-[#00a8ff]" />
                          <span className="whitespace-normal">
                            {area.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cyber to Me Quote Card */}
                <div className="relative overflow-hidden rounded-xl border border-[#00a8ff]/40 bg-gradient-to-r from-slate-900 via-[#0a1220] to-slate-950 p-4.5 text-white shadow-xl dark:from-[#00a8ff]/15 dark:via-[#090f1a] dark:to-[#05080f]">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#00a8ff]">
                      <Quote className="h-4 w-4" />
                      Cyber to Me
                    </h3>

                    <Sparkles className="h-4 w-4 text-[#00a8ff]" />
                  </div>

                  <blockquote className="mt-2.5 space-y-2 font-serif text-xs italic leading-relaxed text-zinc-100 sm:text-sm">
                    <p>
                      &ldquo;Cybersecurity is about curiosity, investigation
                      and continuous learning.&rdquo;
                    </p>
                  </blockquote>

                  <div className="mt-3 border-t border-white/15 pt-2.5 font-sans text-xs font-extrabold uppercase tracking-wider text-[#00a8ff]">
                    &ldquo;Every alert tells a story. Every incident leaves
                    clues. Cyber to me is about connecting those clues,
                    understanding what happened and turning every incident into
                    knowledge.&rdquo;
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
