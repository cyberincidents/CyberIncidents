import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const fields = [
  {
    name: "Hacking",
    slug: "hacking",
    description:
      "Hacking techniques, vulnerabilities, exploits and real-world incidents.",
    number: "01",
  },
  {
    name: "Cyber Security",
    slug: "cyber-security",
    description:
      "Cybersecurity concepts, threats, defenses and security practices.",
    number: "02",
  },
  {
    name: "Malware",
    slug: "malware",
    description:
      "Malware families, campaigns, analysis and emerging malicious threats.",
    number: "03",
  },
  {
    name: "Network Security",
    slug: "network-security",
    description:
      "Network attacks, vulnerabilities, defenses and security architecture.",
    number: "04",
  },
  {
    name: "Privacy",
    slug: "privacy",
    description:
      "Digital privacy, tracking, data protection and privacy technologies.",
    number: "05",
  },
];

async function main() {
  console.log("Seeding fields...");

  for (const field of fields) {
    await prisma.field.upsert({
      where: {
        slug: field.slug,
      },
      update: {
        name: field.name,
        description: field.description,
        number: field.number,
      },
      create: field,
    });
  }

  console.log("Fields seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });