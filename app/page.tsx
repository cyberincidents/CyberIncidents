import { HeroContent } from "@/components/home/hero-content";
import { RadarCard } from "@/components/home/radar-card";
import { FieldSelector } from "@/components/home/field-selector";
import { getFields } from "@/lib/data/db-fields";

export default async function Home() {
  const fields = await getFields();

  const heroStats = [
    { value: "1,500+", label: "DEEP-DIVE REPORTS" },
    { value: "24/7", label: "DISCLOSURE RADAR" },
    { value: "100%", label: "PEER-REVIEWED FORENSICS" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#05070a]">
      <section className="relative overflow-hidden bg-[#f4f7fb] px-5 py-20 transition-colors duration-200 dark:bg-[#060b13] sm:px-8 sm:py-28 lg:px-10 lg:py-32">
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

        <div className="pointer-events-none absolute -top-40 left-[10%] h-[500px] w-[500px] rounded-full bg-[#00a8ff]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[-150px] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#00d9ff]/[0.06] blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <HeroContent heroStats={heroStats} />
         <RadarCard />
        </div>
      </section>

      <FieldSelector fields={fields} />
        
      {/* INTRODUCTION and CTA sections stay as they were */}

    </div>
  );
}