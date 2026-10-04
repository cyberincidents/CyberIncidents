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
    subcategories: [],
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
    subcategories: [],
  },

  {
    id: "security-defense",
    number: "04",
    name: "Security & Defense",
    slug: "security-defense",
    description:
      "Security operations, defensive technologies, monitoring, detection and enterprise security.",
    subcategories: [],
  },

  {
    id: "emerging-security",
    number: "05",
    name: "Emerging Security",
    slug: "emerging-security",
    description:
      "AI security, emerging technologies, new attack techniques and the future of cybersecurity.",
    subcategories: [],
  },

  {
    id: "guides-learning",
    number: "06",
    name: "Guides & Learning",
    slug: "guides-learning",
    description:
      "Cybersecurity learning resources, guides, tools, career preparation and advanced topics.",
    subcategories: [],
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