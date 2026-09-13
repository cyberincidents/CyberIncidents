import Link from "next/link";
import { getFields } from "@/lib/data/db-fields";


export default async function Home() {
  const fields = await getFields();
  return (
    <div className="min-h-screen bg-white">
      {/* ============================================================
          HERO
      ============================================================ */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#00a8ff]/[0.035] blur-3xl" />

          <div className="absolute right-[-150px] top-[250px] h-[400px] w-[400px] rounded-full bg-[#00d9ff]/[0.025] blur-3xl" />

          <div className="absolute left-[-150px] top-[500px] h-[350px] w-[350px] rounded-full bg-[#008fd6]/[0.02] blur-3xl" />
        </div>

        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#008fd6 1px, transparent 1px), linear-gradient(90deg, #008fd6 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-24 sm:px-8 sm:pt-32 lg:px-10 lg:pb-32 lg:pt-36">
          <div className="mx-auto max-w-4xl text-center">
            {/* Eyebrow */}
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#00a8ff]/20 bg-[#00a8ff]/[0.035] px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d9ff] opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00a8ff]" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#008fd6] sm:text-xs">
                Cybersecurity Intelligence
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-[#080a0c] sm:text-5xl md:text-6xl lg:text-7xl">
              Understand the threat.
              <span className="mt-2 block text-[#008fd6]">
                Know what comes next.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base sm:leading-8 lg:text-lg">
              CyberIncidents brings together cybersecurity incidents, threats,
              vulnerabilities and analysis across the fields shaping the
              digital world.
            </p>
          </div>

          {/* ========================================================
              FIELD SELECTOR
          ======================================================== */}
          <div className="mx-auto mt-16 max-w-6xl lg:mt-20">
            <div className="mb-7 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-gray-200" />

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
                Select your field
              </p>

              <span className="h-px w-10 bg-gray-200" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map((field, index) => (
                <Link
                  key={field.slug}
                  href={`/field/${field.slug}`}
                  className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#00a8ff]/40 hover:shadow-[0_15px_40px_rgba(0,168,255,0.10)] ${
                    index === 0 ? "lg:col-span-1" : ""
                  }`}
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#00a8ff]/0 blur-2xl transition-all duration-500 group-hover:bg-[#00a8ff]/10" />

                  {/* Number */}
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs font-semibold tracking-widest text-[#00a8ff]/50 transition-colors group-hover:text-[#00a8ff]">
                      {field.number}
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all duration-300 group-hover:border-[#00a8ff] group-hover:bg-[#00a8ff] group-hover:text-white">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />

                        <path
                          d="M13 6L19 12L13 18"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative mt-8">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#008fd6]">
                      {field.name}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      {field.description}
                    </p>
                  </div>

                  {/* Bottom indicator */}
                  <div className="mt-7 h-px w-8 bg-gray-200 transition-all duration-300 group-hover:w-full group-hover:bg-[#00a8ff]/40" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          INTRODUCTION
      ============================================================ */}
      <section className="border-t border-gray-100 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
            {/* Text */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#008fd6]">
                Why CyberIncidents
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Knowledge is the first layer of defense.
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base sm:leading-8">
                Cybersecurity is constantly changing. New vulnerabilities,
                attack techniques and incidents emerge every day. CyberIncidents
                organizes that information by field so readers can focus on the
                areas that matter to them.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-12 bg-[#00a8ff]" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Threats Today. A Safer Tomorrow.
                </span>
              </div>
            </div>

            {/* Stats / flow */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <span className="font-mono text-2xl font-bold text-[#008fd6]">
                    01
                  </span>

                  <h3 className="mt-2 text-sm font-bold text-gray-900">
                    Choose a field
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Start with the area you're interested in.
                  </p>
                </div>

                <div>
                  <span className="font-mono text-2xl font-bold text-[#008fd6]">
                    02
                  </span>

                  <h3 className="mt-2 text-sm font-bold text-gray-900">
                    Discover
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Find relevant cybersecurity articles.
                  </p>
                </div>

                <div>
                  <span className="font-mono text-2xl font-bold text-[#008fd6]">
                    03
                  </span>

                  <h3 className="mt-2 text-sm font-bold text-gray-900">
                    Understand
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Read detailed long-form content.
                  </p>
                </div>

                <div>
                  <span className="font-mono text-2xl font-bold text-[#008fd6]">
                    04
                  </span>

                  <h3 className="mt-2 text-sm font-bold text-gray-900">
                    Share
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    Share knowledge with others.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA
      ============================================================ */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-[#050607] px-7 py-14 text-center sm:px-12 sm:py-16">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00a8ff]/10 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#00d9ff]">
                Stay informed
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                The digital world changes fast.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/45 sm:text-base">
                Choose a cybersecurity field and start exploring the incidents
                and threats shaping today's digital landscape.
              </p>

              <div className="mt-8">
                <Link
                  href="#fields"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#00a8ff]/50 px-6 py-3 text-sm font-semibold text-[#00d9ff] transition hover:border-[#00d9ff] hover:bg-[#00a8ff]/10"
                >
                  Explore Fields

                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}