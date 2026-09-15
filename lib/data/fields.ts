export type Subcategory = {
  id: string;
  name: string;
  slug: string;
};

export type CybersecurityField = {
  id: string;
  number: string;
  name: string;
  slug: string;
  description: string;
  subcategories: Subcategory[];
};

// Backward-compatible name used by FieldGrid and FieldSelector
export type CyberField = CybersecurityField;

export const fields: CybersecurityField[] = [
  {
    id: "cyber-news",
    number: "01",
    name: "Cyber News",
    slug: "cyber-news",
    description:
      "Latest cybersecurity news, incidents, vulnerabilities, threat intelligence and developments.",
    subcategories: [
      {
        id: "latest-cyber-news",
        name: "Latest Cyber News",
        slug: "latest-cyber-news",
      },
      {
        id: "new-threats-attacks",
        name: "New Threats & Attacks",
        slug: "new-threats-attacks",
      },
      {
        id: "data-breaches-leaks",
        name: "Data Breaches & Leaks",
        slug: "data-breaches-leaks",
      },
      {
        id: "vulnerabilities-cves",
        name: "Vulnerabilities & CVEs",
        slug: "vulnerabilities-cves",
      },
      {
        id: "zero-day-exploits",
        name: "Zero-Day Exploits",
        slug: "zero-day-exploits",
      },
      {
        id: "threat-intelligence",
        name: "Threat Intelligence",
        slug: "threat-intelligence",
      },
      {
        id: "apt-groups",
        name: "APT Groups",
        slug: "apt-groups",
      },
      {
        id: "cybercrime-law",
        name: "Cybercrime & Law",
        slug: "cybercrime-law",
      },
      {
        id: "security-industry",
        name: "Security Industry",
        slug: "security-industry",
      },
      {
        id: "ai-cybersecurity",
        name: "AI & Cybersecurity",
        slug: "ai-cybersecurity",
      },
    ],
  },

  {
    id: "threats-attacks",
    number: "02",
    name: "Threats & Attacks",
    slug: "threats-attacks",
    description:
      "Common and advanced cyber threats, attack techniques and adversarial activity.",
    subcategories: [
      {
        id: "phishing-social-engineering",
        name: "Phishing & Social Engineering",
        slug: "phishing-social-engineering",
      },
      {
        id: "ransomware",
        name: "Ransomware",
        slug: "ransomware",
      },
      {
        id: "malware-trojans",
        name: "Malware & Trojans",
        slug: "malware-trojans",
      },
      {
        id: "ddos-attacks",
        name: "DDoS Attacks",
        slug: "ddos-attacks",
      },
      {
        id: "web-attacks",
        name: "Web Attacks",
        slug: "web-attacks",
      },
      {
        id: "identity-credential-attacks",
        name: "Identity & Credential Attacks",
        slug: "identity-credential-attacks",
      },
      {
        id: "supply-chain-attacks",
        name: "Supply Chain Attacks",
        slug: "supply-chain-attacks",
      },
      {
        id: "insider-threats",
        name: "Insider Threats",
        slug: "insider-threats",
      },
      {
        id: "cloud-attacks",
        name: "Cloud Attacks",
        slug: "cloud-attacks",
      },
      {
        id: "mobile-iot-attacks",
        name: "Mobile & IoT Attacks",
        slug: "mobile-iot-attacks",
      },
    ],
  },

  {
    id: "incident-investigation",
    number: "03",
    name: "Incident Investigation",
    slug: "incident-investigation",
    description:
      "Incident response, investigation, forensics, threat hunting and security case studies.",
    subcategories: [
      {
        id: "soc-investigations",
        name: "SOC Investigations",
        slug: "soc-investigations",
      },
      {
        id: "incident-response",
        name: "Incident Response",
        slug: "incident-response",
      },
      {
        id: "digital-forensics",
        name: "Digital Forensics",
        slug: "digital-forensics",
      },
      {
        id: "threat-hunting",
        name: "Threat Hunting",
        slug: "threat-hunting",
      },
      {
        id: "malware-investigation",
        name: "Malware Investigation",
        slug: "malware-investigation",
      },
      {
        id: "phishing-investigation",
        name: "Phishing Investigation",
        slug: "phishing-investigation",
      },
      {
        id: "network-investigation",
        name: "Network Investigation",
        slug: "network-investigation",
      },
      {
        id: "cloud-investigation",
        name: "Cloud Investigation",
        slug: "cloud-investigation",
      },
      {
        id: "identity-investigation",
        name: "Identity Investigation",
        slug: "identity-investigation",
      },
      {
        id: "log-analysis",
        name: "Log Analysis",
        slug: "log-analysis",
      },
      {
        id: "timeline-analysis",
        name: "Timeline Analysis",
        slug: "timeline-analysis",
      },
      {
        id: "case-studies",
        name: "Case Studies",
        slug: "case-studies",
      },
    ],
  },

  {
    id: "security-defense",
    number: "04",
    name: "Security & Defense",
    slug: "security-defense",
    description:
      "Security operations, defensive technologies, monitoring, detection and enterprise security.",
    subcategories: [
      {
        id: "soc-security-operations",
        name: "SOC & Security Operations",
        slug: "soc-security-operations",
      },
      {
        id: "siem",
        name: "SIEM",
        slug: "siem",
      },
      {
        id: "edr-xdr",
        name: "EDR & XDR",
        slug: "edr-xdr",
      },
      {
        id: "network-security",
        name: "Network Security",
        slug: "network-security",
      },
      {
        id: "cloud-security",
        name: "Cloud Security",
        slug: "cloud-security",
      },
      {
        id: "application-security",
        name: "Application Security",
        slug: "application-security",
      },
      {
        id: "identity-access-security",
        name: "Identity & Access Security",
        slug: "identity-access-security",
      },
      {
        id: "email-security",
        name: "Email Security",
        slug: "email-security",
      },
      {
        id: "endpoint-security",
        name: "Endpoint Security",
        slug: "endpoint-security",
      },
      {
        id: "detection-engineering",
        name: "Detection Engineering",
        slug: "detection-engineering",
      },
      {
        id: "security-monitoring",
        name: "Security Monitoring",
        slug: "security-monitoring",
      },
    ],
  },

  {
    id: "emerging-security",
    number: "05",
    name: "Emerging Security",
    slug: "emerging-security",
    description:
      "AI security, emerging technologies, new attack techniques and the future of cybersecurity.",
    subcategories: [
      {
        id: "ai-in-cybersecurity",
        name: "AI in Cybersecurity",
        slug: "ai-in-cybersecurity",
      },
      {
        id: "ai-security",
        name: "AI Security",
        slug: "ai-security",
      },
      {
        id: "llm-genai-security",
        name: "LLM & GenAI Security",
        slug: "llm-genai-security",
      },
      {
        id: "emerging-threats",
        name: "Emerging Threats",
        slug: "emerging-threats",
      },
      {
        id: "new-attack-techniques",
        name: "New Attack Techniques",
        slug: "new-attack-techniques",
      },
      {
        id: "security-automation",
        name: "Security Automation",
        slug: "security-automation",
      },
      {
        id: "zero-trust",
        name: "Zero Trust",
        slug: "zero-trust",
      },
      {
        id: "cloud-emerging-technologies",
        name: "Cloud & Emerging Technologies",
        slug: "cloud-emerging-technologies",
      },
      {
        id: "future-of-cybersecurity",
        name: "Future of Cybersecurity",
        slug: "future-of-cybersecurity",
      },
    ],
  },

  {
    id: "guides-learning",
    number: "06",
    name: "Guides & Learning",
    slug: "guides-learning",
    description:
      "Cybersecurity learning resources, guides, tools, career preparation and advanced topics.",
    subcategories: [
      {
        id: "cybersecurity-fundamentals",
        name: "Cybersecurity Fundamentals",
        slug: "cybersecurity-fundamentals",
      },
      {
        id: "networking-fundamentals",
        name: "Networking Fundamentals",
        slug: "networking-fundamentals",
      },
      {
        id: "linux-windows-security",
        name: "Linux & Windows Security",
        slug: "linux-windows-security",
      },
      {
        id: "soc-analyst-guide",
        name: "SOC Analyst Guide",
        slug: "soc-analyst-guide",
      },
      {
        id: "siem-guide",
        name: "SIEM Guide",
        slug: "siem-guide",
      },
      {
        id: "threat-intelligence-guide",
        name: "Threat Intelligence Guide",
        slug: "threat-intelligence-guide",
      },
      {
        id: "dfir-guide",
        name: "DFIR Guide",
        slug: "dfir-guide",
      },
      {
        id: "threat-hunting-guide",
        name: "Threat Hunting Guide",
        slug: "threat-hunting-guide",
      },
      {
        id: "penetration-testing",
        name: "Penetration Testing",
        slug: "penetration-testing",
      },
      {
        id: "application-security-guide",
        name: "Application Security",
        slug: "application-security-guide",
      },
      {
        id: "cloud-security-guide",
        name: "Cloud Security",
        slug: "cloud-security-guide",
      },
      {
        id: "advanced-security",
        name: "Advanced Security",
        slug: "advanced-security",
      },
      {
        id: "tools-techniques",
        name: "Tools & Techniques",
        slug: "tools-techniques",
      },
      {
        id: "cybersecurity-career",
        name: "Cybersecurity Career",
        slug: "cybersecurity-career",
      },
      {
        id: "interview-preparation",
        name: "Interview Preparation",
        slug: "interview-preparation",
      },
    ],
  },
];

/*
 * Flat list of all subcategories.
 *
 * Useful for matching the navbar categories with
 * database Field records in admin pages.
 */
export const subcategories = fields.flatMap(
  (field) =>
    field.subcategories.map((subcategory) => ({
      ...subcategory,
      parentId: field.id,
      parentName: field.name,
      parentSlug: field.slug,
      parentNumber: field.number,
    }))
);

/*
 * Quick lookup by slug.
 */
export const fieldBySlug = Object.fromEntries(
  fields.map((field) => [
    field.slug,
    field,
  ])
);

/*
 * Quick lookup for subcategories.
 */
export const subcategoryBySlug =
  Object.fromEntries(
    subcategories.map((subcategory) => [
      subcategory.slug,
      subcategory,
    ])
  );