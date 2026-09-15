import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      [
        "Mobile & IoT Attacks",
        "mobile-iot-attacks",
      ],
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
      [
        "Timeline Analysis",
        "timeline-analysis",
      ],
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
        "Application Security",
        "application-security-guide",
      ],
      [
        "Cloud Security",
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
  for (const category of categories) {
    for (const [name, slug] of category.subcategories) {
      await prisma.field.upsert({
        where: {
          slug,
        },
        update: {
          name,
          number: category.number,
        },
        create: {
          name,
          slug,
          number: category.number,
        },
      });
    }
  }

  console.log(
    "Cybersecurity fields seeded successfully."
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });