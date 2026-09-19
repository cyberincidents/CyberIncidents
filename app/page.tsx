import { HeroContent } from "@/components/home/hero-content";
import { RadarCard } from "@/components/home/radar-card";
import { FieldSelector } from "@/components/home/field-selector";

import LatestBlogs from "@/components/blog/LatestBlogs";

import { fields } from "@/lib/data/fields";
import { getLatestBlogs } from "@/lib/data/db-blogs";

/*
 * Homepage content is dynamic so newly published blogs
 * appear without requiring a deployment.
 */
export const dynamic = "force-dynamic";

/* =====================================================
   HOME
===================================================== */

export default async function Home() {
  const latestBlogs = await getLatestBlogs(3);

  

  return (
    <main className="min-h-screen bg-white dark:bg-[#05070a]">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-[#f4f7fb] px-5 py-20 transition-colors duration-200 dark:bg-[#060b13] sm:px-8 sm:py-28 lg:px-10 lg:py-32">
        {/* =================================================
            LIGHT GRID
        ================================================= */}

        <div
          className="pointer-events-none absolute inset-0 block opacity-75 dark:hidden"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 0.5px 0.5px,
                rgba(2, 132, 199, 0.35) 1.2px,
                transparent 0
              ),
              linear-gradient(
                to right,
                rgba(2, 132, 199, 0.12) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                rgba(2, 132, 199, 0.12) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "36px 36px",
          }}
        />

        {/* =================================================
            DARK GRID
        ================================================= */}

        <div
          className="pointer-events-none absolute inset-0 hidden opacity-60 dark:block"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 0.5px 0.5px,
                rgba(56, 189, 248, 0.45) 1.2px,
                transparent 0
              ),
              linear-gradient(
                to right,
                rgba(56, 189, 248, 0.09) 1px,
                transparent 0
              ),
              linear-gradient(
                to bottom,
                rgba(56, 189, 248, 0.09) 1px,
                transparent 0
              )
            `,
            backgroundSize: "36px 36px",
          }}
        />

        {/* =================================================
            AMBIENT GLOW
        ================================================= */}

        <div className="pointer-events-none absolute -left-32 -top-40 h-[500px] w-[500px] rounded-full bg-[#00a8ff]/10 blur-3xl" />

        <div className="pointer-events-none absolute right-[-150px] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#00d9ff]/[0.06] blur-3xl" />

        {/* =================================================
            HERO CONTENT
        ================================================= */}

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-16">
          <HeroContent />

          <RadarCard />
        </div>
      </section>

      {/* =================================================
          FIELD SELECTOR
          
          Uses the static cybersecurity hierarchy.
          The database is used for blog content, not for
          constructing the homepage category structure.
      ================================================= */}

      <FieldSelector fields={fields} />

      {/* =================================================
          LATEST CONTENT
      ================================================= */}

      <LatestBlogs blogs={latestBlogs} />
    </main>
  );
}