import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f7fb] text-slate-900 transition-colors duration-200 dark:bg-[#050607] dark:text-zinc-100 px-6">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[#00a8ff]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-[#00d9ff]/10 blur-3xl" />

      {/* Light Mode Cyber Grid Lines with node dots */}
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
      {/* Dark Mode Cyber Grid Lines with node dots */}
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-60 dark:block"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0.5px 0.5px, rgba(56, 189, 248, 0.45) 1.2px, transparent 0),
            linear-gradient(to right, rgba(56, 189, 248, 0.09) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.09) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#0284c7] dark:text-[#00a8ff]">
          {"// Error 404"}
        </p>

        <h1 className="mt-6 text-[7rem] font-black leading-none tracking-tight text-slate-900 dark:text-white sm:text-[9rem]">
          404
        </h1>

        <div className="mt-2 h-px w-24 bg-[#0284c7]/40 dark:bg-[#00a8ff]/40" />

        <h2 className="mt-6 text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Domain Not Found
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-white/50">
          The operational sector you&apos;re looking for doesn&apos;t exist,
          has been decommissioned, or the coordinates were entered
          incorrectly.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0284c7] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[#0369a1] shadow-md dark:bg-[#00a8ff] dark:text-black dark:hover:bg-[#00d9ff]"
          >
            Return to Base
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Link
            href="/#fields"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:border-[#0284c7] hover:text-[#0284c7] dark:border-white/15 dark:bg-white/5 dark:text-white/70 dark:hover:border-[#00a8ff]/40 dark:hover:text-white"
          >
            Browse Fields
          </Link>
        </div>

        <p className="mt-12 font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/30">
          Status: Signal Lost — Code 0x194
        </p>
      </div>
    </main>
  );
}