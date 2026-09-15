import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});
const hierarchy = [
  {
    name: "Cyber News",
    slug: "cyber-news",
    number: "01",
    description:
      "Latest cybersecurity news, incidents, vulnerabilities, threats, and developments.",
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
    name: "Threats & Attacks",
    slug: "threats-attacks",
    number: "02",
    description:
      "Cybersecurity threats, attack techniques, malware, phishing, ransomware, and emerging attack methods.",
    subcategories: [
      ["Phishing & Social Engineering", "phishing-social-engineering"],
      ["Ransomware", "ransomware"],
      ["Malware & Trojans", "malware-trojans"],
      ["DDoS Attacks", "ddos-attacks"],
      ["Web Attacks", "web-attacks"],
      ["Identity & Credential Attacks", "identity-credential-attacks"],
      ["Supply Chain Attacks", "supply-chain-attacks"],
      ["Insider Threats", "insider-threats"],
      ["Cloud Attacks", "cloud-attacks"],
      ["Mobile & IoT Attacks", "mobile-iot-attacks"],
    ],
  },

  {
    name: "Incident Investigation",
    slug: "incident-investigation",
    number: "03",
    description:
      "Incident response, digital forensics, threat hunting, investigations, and cybersecurity case studies.",
    subcategories: [
      ["SOC Investigations", "soc-investigations"],
      ["Incident Response", "incident-response"],
      ["Digital Forensics", "digital-forensics"],
      ["Threat Hunting", "threat-hunting"],
      ["Malware Investigation", "malware-investigation"],
      ["Phishing Investigation", "phishing-investigation"],
      ["Network Investigation", "network-investigation"],
      ["Cloud Investigation", "cloud-investigation"],
      ["Identity Investigation", "identity-investigation"],
      ["Log Analysis", "log-analysis"],
      ["Timeline Analysis", "timeline-analysis"],
      ["Case Studies", "case-studies"],
    ],
  },

  {
    name: "Security & Defense",
    slug: "security-defense",
    number: "04",
    description:
      "Security operations, defensive technologies, monitoring, detection, and enterprise security.",
    subcategories: [
      ["SOC & Security Operations", "soc-security-operations"],
      ["SIEM", "siem"],
      ["EDR & XDR", "edr-xdr"],
      ["Network Security", "network-security"],
      ["Cloud Security", "cloud-security"],
      ["Application Security", "application-security"],
      ["Identity & Access Security", "identity-access-security"],
      ["Email Security", "email-security"],
      ["Endpoint Security", "endpoint-security"],
      ["Detection Engineering", "detection-engineering"],
      ["Security Monitoring", "security-monitoring"],
    ],
  },

  {
    name: "Emerging Security",
    slug: "emerging-security",
    number: "05",
    description:
      "Emerging cybersecurity technologies, AI security, new attack techniques, automation, and future security trends.",
    subcategories: [
      ["AI in Cybersecurity", "ai-in-cybersecurity"],
      ["AI Security", "ai-security"],
      ["LLM & GenAI Security", "llm-genai-security"],
      ["Emerging Threats", "emerging-threats"],
      ["New Attack Techniques", "new-attack-techniques"],
      ["Security Automation", "security-automation"],
      ["Zero Trust", "zero-trust"],
      ["Cloud & Emerging Technologies", "cloud-emerging-technologies"],
      ["Future of Cybersecurity", "future-of-cybersecurity"],
    ],
  },

  {
    name: "Guides & Learning",
    slug: "guides-learning",
    number: "06",
    description:
      "Cybersecurity learning resources, fundamentals, technical guides, tools, careers, and interview preparation.",
    subcategories: [
      ["Cybersecurity Fundamentals", "cybersecurity-fundamentals"],
      ["Networking Fundamentals", "networking-fundamentals"],
      ["Linux & Windows Security", "linux-windows-security"],
      ["SOC Analyst Guide", "soc-analyst-guide"],
      ["SIEM Guide", "siem-guide"],
      ["Threat Intelligence Guide", "threat-intelligence-guide"],
      ["DFIR Guide", "dfir-guide"],
      ["Threat Hunting Guide", "threat-hunting-guide"],
      ["Penetration Testing", "penetration-testing"],
      ["Application Security Guide", "application-security-guide"],
      ["Cloud Security Guide", "cloud-security-guide"],
      ["Advanced Security", "advanced-security"],
      ["Tools & Techniques", "tools-techniques"],
      ["Cybersecurity Career", "cybersecurity-career"],
      ["Interview Preparation", "interview-preparation"],
    ],
  },
];

async function findOrCreateField({
  name,
  slug,
  number = null,
  description = null,
  parentId = null,
}) {
  /*
   * Network Security already exists in the old database.
   * Search by slug first, then name, so we reuse it instead
   * of creating a duplicate.
   */
  let field = await prisma.field.findFirst({
    where: {
      OR: [{ slug }, { name }],
    },
  });

  if (field) {
    field = await prisma.field.update({
      where: {
        id: field.id,
      },
      data: {
        number,
        description,
        parentId,
      },
    });

    console.log(
      `UPDATED: ${field.name}${parentId ? " → subcategory" : " → category"}`
    );

    return field;
  }

  field = await prisma.field.create({
    data: {
      name,
      slug,
      number,
      description,
      parentId,
    },
  });

  console.log(
    `CREATED: ${field.name}${parentId ? " → subcategory" : " → category"}`
  );

  return field;
}

async function main() {
  console.log("");
  console.log("==========================================");
  console.log(" CyberIncidents Field Hierarchy Seeder");
  console.log("==========================================");
  console.log("");

  let totalParents = 0;
  let totalSubcategories = 0;

  for (const category of hierarchy) {
    console.log(`\nCATEGORY: ${category.name}`);

    const parent = await findOrCreateField({
      name: category.name,
      slug: category.slug,
      number: category.number,
      description: category.description,
      parentId: null,
    });

    totalParents++;

    for (const [name, slug] of category.subcategories) {
      await findOrCreateField({
        name,
        slug,
        parentId: parent.id,
      });

      totalSubcategories++;
    }
  }

  console.log("");
  console.log("==========================================");
  console.log(" SEED COMPLETE");
  console.log("==========================================");
  console.log(`Parent categories: ${totalParents}`);
  console.log(`Subcategories:     ${totalSubcategories}`);
  console.log(
    `Total new hierarchy records processed: ${
      totalParents + totalSubcategories
    }`
  );
  console.log("");
}

main()
  .catch((error) => {
    console.error("");
    console.error("==========================================");
    console.error(" SEED FAILED");
    console.error("==========================================");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });