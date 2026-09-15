import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
  connectionTimeoutMillis: 30_000,
  idleTimeoutMillis: 300_000,
});

const prisma = new PrismaClient({
  adapter,
});

const categories = [
  {
    number: "01",
    name: "Cyber News",
    slug: "cyber-news",
    subcategories: [
      ["Latest Cyber News", "latest-cyber-news"],
      ["New Threats & Attacks", "new-threats-attacks"],
      ["Data Breaches & Leaks", "data-breaches-leaks"],
      ["Vulnerabilities & CVEs", "vulnerabilities-cves"],
      ["Zero-Day Exploits", "zero-day-exploits"],
      ["Threat Intelligence", "threat-intelligence"],
      ["APT Groups", "apt-groups"],
      ["Cybercrime & Law", "cybercrime-law"],
      ["Security Industry", "security-industry"],
      ["AI & Cybersecurity", "ai-cybersecurity"],
    ],
  },
  {
    number: "02",
    name: "Threats & Attacks",
    slug: "threats-attacks",
    subcategories: [
      [
        "Phishing & Social Engineering",
        "phishing-social-engineering",
      ],
      ["Ransomware", "ransomware"],
      ["Malware & Trojans", "malware-trojans"],
      ["DDoS Attacks", "ddos-attacks"],
      ["Web Attacks", "web-attacks"],
      [
        "Identity & Credential Attacks",
        "identity-credential-attacks",
      ],
      [
        "Supply Chain Attacks",
        "supply-chain-attacks",
      ],
      ["Insider Threats", "insider-threats"],
      ["Cloud Attacks", "cloud-attacks"],
      ["Mobile & IoT Attacks", "mobile-iot-attacks"],
    ],
  },
  {
    number: "03",
    name: "Incident Investigation",
    slug: "incident-investigation",
    subcategories: [
      ["SOC Investigations", "soc-investigations"],
      ["Incident Response", "incident-response"],
      ["Digital Forensics", "digital-forensics"],
      ["Threat Hunting", "threat-hunting"],
      [
        "Malware Investigation",
        "malware-investigation",
      ],
      [
        "Phishing Investigation",
        "phishing-investigation",
      ],
      [
        "Network Investigation",
        "network-investigation",
      ],
      [
        "Cloud Investigation",
        "cloud-investigation",
      ],
      [
        "Identity Investigation",
        "identity-investigation",
      ],
      ["Log Analysis", "log-analysis"],
      ["Timeline Analysis", "timeline-analysis"],
      ["Case Studies", "case-studies"],
    ],
  },
  {
    number: "04",
    name: "Security & Defense",
    slug: "security-defense",
    subcategories: [
      [
        "SOC & Security Operations",
        "soc-security-operations",
      ],
      ["SIEM", "siem"],
      ["EDR & XDR", "edr-xdr"],
      ["Network Security", "network-security"],
      ["Cloud Security", "cloud-security"],
      [
        "Application Security",
        "application-security",
      ],
      [
        "Identity & Access Security",
        "identity-access-security",
      ],
      ["Email Security", "email-security"],
      [
        "Endpoint Security",
        "endpoint-security",
      ],
      [
        "Detection Engineering",
        "detection-engineering",
      ],
      [
        "Security Monitoring",
        "security-monitoring",
      ],
    ],
  },
  {
    number: "05",
    name: "Emerging Security",
    slug: "emerging-security",
    subcategories: [
      [
        "AI in Cybersecurity",
        "ai-in-cybersecurity",
      ],
      ["AI Security", "ai-security"],
      [
        "LLM & GenAI Security",
        "llm-genai-security",
      ],
      ["Emerging Threats", "emerging-threats"],
      [
        "New Attack Techniques",
        "new-attack-techniques",
      ],
      [
        "Security Automation",
        "security-automation",
      ],
      ["Zero Trust", "zero-trust"],
      [
        "Cloud & Emerging Technologies",
        "cloud-emerging-technologies",
      ],
      [
        "Future of Cybersecurity",
        "future-of-cybersecurity",
      ],
    ],
  },
  {
    number: "06",
    name: "Guides & Learning",
    slug: "guides-learning",
    subcategories: [
      [
        "Cybersecurity Fundamentals",
        "cybersecurity-fundamentals",
      ],
      [
        "Networking Fundamentals",
        "networking-fundamentals",
      ],
      [
        "Linux & Windows Security",
        "linux-windows-security",
      ],
      [
        "SOC Analyst Guide",
        "soc-analyst-guide",
      ],
      ["SIEM Guide", "siem-guide"],
      [
        "Threat Intelligence Guide",
        "threat-intelligence-guide",
      ],
      ["DFIR Guide", "dfir-guide"],
      [
        "Threat Hunting Guide",
        "threat-hunting-guide",
      ],
      [
        "Penetration Testing",
        "penetration-testing",
      ],
      [
        "Application Security Guide",
        "application-security-guide",
      ],
      [
        "Cloud Security Guide",
        "cloud-security-guide",
      ],
      [
        "Advanced Security",
        "advanced-security",
      ],
      [
        "Tools & Techniques",
        "tools-techniques",
      ],
      [
        "Cybersecurity Career",
        "cybersecurity-career",
      ],
      [
        "Interview Preparation",
        "interview-preparation",
      ],
    ],
  },
];

async function main() {
  console.log("Starting cybersecurity field seed...\n");

  for (const category of categories) {
    /*
     * -------------------------------------------------------
     * CREATE / UPDATE PARENT CATEGORY
     * -------------------------------------------------------
     */

    const parent = await prisma.field.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        number: category.number,
        parentId: null,
      },
      create: {
        name: category.name,
        slug: category.slug,
        number: category.number,
        parentId: null,
      },
    });

    console.log(`✓ Parent: ${category.name}`);

    /*
     * -------------------------------------------------------
     * CREATE / UPDATE SUBCATEGORIES
     * -------------------------------------------------------
     */

    for (const [name, slug] of category.subcategories) {
      await prisma.field.upsert({
        where: {
          slug,
        },
        update: {
          name,
          number: category.number,
          parentId: parent.id,
        },
        create: {
          name,
          slug,
          number: category.number,
          parentId: parent.id,
        },
      });

      console.log(`  └─ ${name}`);
    }

    console.log("");
  }

  console.log(
    "Cybersecurity field hierarchy seeded successfully."
  );
}

main()
  .catch((error) => {
    console.error("\nSeed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });