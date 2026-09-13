export type Blog = {
  id: string;
  title: string;
  slug: string;
  field: string;
  fieldSlug: string;
  excerpt: string;
  content: string;
  image: string;
  gallery?: string[];
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
};

export const blogs: Blog[] = [
  {
    id: "1",
    title: "Understanding Modern Ransomware Attacks",
    slug: "understanding-modern-ransomware-attacks",
    field: "Malware",
    fieldSlug: "malware",
    excerpt:
      "A look at how modern ransomware campaigns operate, spread and impact organizations.",
    content: `## What is ransomware?

Ransomware is a type of malicious software designed to prevent victims from accessing their systems or data.

## How modern campaigns operate

Modern ransomware operations are increasingly organized and can involve multiple stages.

Attackers may first obtain an initial foothold before moving through the environment.

## Why organizations remain vulnerable

Weak credentials, exposed services and insufficient segmentation can increase the impact of an attack.

## Protecting against ransomware

Organizations should combine technical controls, monitoring, backups and security awareness to reduce risk.`,
    image: "/images/blogs/ransomware.jpg",
    gallery: [
      "/images/blogs/ransomware.jpg",
      "/images/blogs/ransomware-2.jpg",
      "/images/blogs/ransomware-3.jpg",
    ],
    author: "CyberIncidents",
    publishedAt: "September 12, 2026",
    readTime: "6 min read",
    tags: ["Ransomware", "Malware", "Cyber Security"],
    featured: true,
  },

  {
    id: "2",
    title: "How Infostealers Target Your Credentials",
    slug: "how-infostealers-target-your-credentials",
    field: "Malware",
    fieldSlug: "malware",
    excerpt:
      "Infostealer malware is increasingly used to collect credentials, browser data and authentication information from compromised devices.",
    content: `## What are infostealers?

Infostealers are malicious programs designed to quietly collect valuable information from infected systems.

## What they target

Depending on the malware family, infostealers may target browser credentials, session information, cookies and other sensitive data.

## Why they are dangerous

Stolen credentials can provide attackers with access to online accounts and organizational systems.`,
    image: "/images/blogs/infostealer.jpg",
    author: "CyberIncidents",
    publishedAt: "September 8, 2026",
    readTime: "6 min read",
    tags: ["Infostealer", "Credentials", "Malware"],
  },

  {
    id: "3",
    title: "The Anatomy of a Malware Campaign",
    slug: "the-anatomy-of-a-malware-campaign",
    field: "Malware",
    fieldSlug: "malware",
    excerpt:
      "A look at the lifecycle of a malware campaign, from initial delivery and execution to persistence and command-and-control.",
    content: `## The malware lifecycle

A successful malware campaign typically involves multiple stages designed to compromise a target and maintain access.

## Initial delivery

Attackers may use malicious attachments, compromised websites, social engineering or other delivery mechanisms.

## Persistence

Once executed, malware may attempt to establish persistence so that access survives system restarts.

## Command and control

Some malware communicates with attacker-controlled infrastructure to receive instructions or transfer information.`,
    image: "/images/blogs/malware-campaign.jpg",
    author: "CyberIncidents",
    publishedAt: "September 6, 2026",
    readTime: "7 min read",
    tags: ["Malware", "Campaigns", "Analysis"],
  },

  {
    id: "4",
    title: "Why Browser-Based Attacks Remain Dangerous",
    slug: "why-browser-based-attacks-remain-dangerous",
    field: "Hacking",
    fieldSlug: "hacking",
    excerpt:
      "Modern browsers are powerful applications, but their complexity also creates opportunities for attackers.",
    content: `## The modern browser attack surface

Browsers are an important part of the modern attack surface.

## Common attack vectors

Malicious websites, extensions, phishing campaigns and browser vulnerabilities can all create security risks.

## Reducing browser risk

Keeping browsers updated, limiting unnecessary extensions and maintaining security awareness can reduce exposure.`,
    image: "/images/blogs/browser-attacks.jpg",
    author: "CyberIncidents",
    publishedAt: "September 5, 2026",
    readTime: "5 min read",
    tags: ["Hacking", "Browser", "Security"],
  },

  {
    id: "5",
    title: "Network Segmentation as a Security Layer",
    slug: "network-segmentation-as-a-security-layer",
    field: "Network Security",
    fieldSlug: "network-security",
    excerpt:
      "Network segmentation can limit the impact of a compromised device and make lateral movement more difficult.",
    content: `## What is network segmentation?

Effective network segmentation separates systems according to trust, function and security requirements.

## Why segmentation matters

If one system is compromised, segmentation can make it more difficult for an attacker to move freely across the environment.

## Segmentation strategies

Organizations can use network zones, access controls and security policies to isolate sensitive systems.`,
    image: "/images/blogs/network-security.jpg",
    author: "CyberIncidents",
    publishedAt: "September 3, 2026",
    readTime: "6 min read",
    tags: ["Network", "Defense", "Security"],
  },

  {
    id: "6",
    title: "The Privacy Risks Behind Everyday Tracking",
    slug: "privacy-risks-behind-everyday-tracking",
    field: "Privacy",
    fieldSlug: "privacy",
    excerpt:
      "Websites, applications and advertising systems can collect significant amounts of information about user activity.",
    content: `## Digital tracking

Digital tracking technologies have become deeply integrated into everyday online experiences.

## What can be collected?

Depending on the technology and implementation, systems may collect information about browsing activity, device characteristics and interactions.

## Protecting privacy

Understanding tracking mechanisms and reviewing privacy settings can help users make more informed decisions.`,
    image: "/images/blogs/privacy.jpg",
    author: "CyberIncidents",
    publishedAt: "September 1, 2026",
    readTime: "5 min read",
    tags: ["Privacy", "Tracking", "Data"],
  },
];