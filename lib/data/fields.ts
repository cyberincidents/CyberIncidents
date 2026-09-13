export type CyberField = {
  id: string;
  name: string;
  slug: string;
  description: string;
  number: string;
};

export const fields: CyberField[] = [
  {
    id: "1",
    name: "Hacking",
    slug: "hacking",
    description:
      "Hacking techniques, vulnerabilities, exploits and real-world incidents.",
    number: "01",
  },
  {
    id: "2",
    name: "Cyber Security",
    slug: "cyber-security",
    description:
      "Cybersecurity concepts, threats, defenses and security practices.",
    number: "02",
  },
  {
    id: "3",
    name: "Malware",
    slug: "malware",
    description:
      "Malware families, campaigns, analysis and emerging malicious threats.",
    number: "03",
  },
  {
    id: "4",
    name: "Network Security",
    slug: "network-security",
    description:
      "Network attacks, vulnerabilities, defenses and security architecture.",
    number: "04",
  },
  {
    id: "5",
    name: "Privacy",
    slug: "privacy",
    description:
      "Digital privacy, tracking, data protection and privacy technologies.",
    number: "05",
  },
];