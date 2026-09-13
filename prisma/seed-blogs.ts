import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const blogs = [
  {
    title: "Understanding Modern Ransomware Attacks",
    slug: "understanding-modern-ransomware-attacks",
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
    publishedAt: "2026-09-12",
    readTime: 6,
    tags: ["Ransomware", "Malware", "Cyber Security"],
    featured: true,
  },
  {
    title: "How Infostealers Target Your Credentials",
    slug: "how-infostealers-target-your-credentials",
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
    publishedAt: "2026-09-08",
    readTime: 6,
    tags: ["Infostealer", "Credentials", "Malware"],
  },
  {
    title: "The Anatomy of a Malware Campaign",
    slug: "the-anatomy-of-a-malware-campaign",
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
    publishedAt: "2026-09-06",
    readTime: 7,
    tags: ["Malware", "Campaigns", "Analysis"],
  },
  {
    title: "Why Browser-Based Attacks Remain Dangerous",
    slug: "why-browser-based-attacks-remain-dangerous",
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
    publishedAt: "2026-09-05",
    readTime: 5,
    tags: ["Hacking", "Browser", "Security"],
  },
  {
    title: "Network Segmentation as a Security Layer",
    slug: "network-segmentation-as-a-security-layer",
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
    publishedAt: "2026-09-03",
    readTime: 6,
    tags: ["Network", "Defense", "Security"],
  },
  {
    title: "The Privacy Risks Behind Everyday Tracking",
    slug: "privacy-risks-behind-everyday-tracking",
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
    publishedAt: "2026-09-01",
    readTime: 5,
    tags: ["Privacy", "Tracking", "Data"],
  },
];

async function main() {
  console.log("Seeding blogs...");

  for (const blogData of blogs) {
    const field = await prisma.field.findUnique({
      where: {
        slug: blogData.fieldSlug,
      },
    });

    if (!field) {
      throw new Error(
        `Field not found: ${blogData.fieldSlug}`
      );
    }

    const tagIds: string[] = [];

    for (const tagName of blogData.tags) {
      const tagSlug = tagName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const tag = await prisma.tag.upsert({
        where: {
          slug: tagSlug,
        },
        update: {
          name: tagName,
        },
        create: {
          name: tagName,
          slug: tagSlug,
        },
      });

      tagIds.push(tag.id);
    }

    const blog = await prisma.blog.upsert({
      where: {
        slug: blogData.slug,
      },
      update: {
        title: blogData.title,
        excerpt: blogData.excerpt,
        content: blogData.content,
        author: blogData.author,
        publishedAt: new Date(blogData.publishedAt),
        readTime: blogData.readTime,
        featured: blogData.featured ?? false,
        status: "PUBLISHED",
        access: "FREE",
      },
      create: {
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        author: blogData.author,
        publishedAt: new Date(blogData.publishedAt),
        readTime: blogData.readTime,
        featured: blogData.featured ?? false,
        status: "PUBLISHED",
        access: "FREE",
      },
    });

    await prisma.blogField.deleteMany({
      where: {
        blogId: blog.id,
      },
    });

    await prisma.blogField.create({
      data: {
        blogId: blog.id,
        fieldId: field.id,
      },
    });

    await prisma.blogTag.deleteMany({
      where: {
        blogId: blog.id,
      },
    });

    await prisma.blogTag.createMany({
      data: tagIds.map((tagId) => ({
        blogId: blog.id,
        tagId,
      })),
      skipDuplicates: true,
    });

    const existingImages = await prisma.blogImage.findMany({
      where: {
        blogId: blog.id,
      },
    });

    if (existingImages.length === 0) {
      const images = blogData.gallery ?? [blogData.image];

      await prisma.blogImage.createMany({
        data: images.map((url, index) => ({
          blogId: blog.id,
          publicId: url,
          url,
          altText: blogData.title,
          sortOrder: index,
          isPrimary: index === 0,
        })),
      });
    }

    console.log(`✓ ${blogData.title}`);
  }

  console.log("Blogs seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Blog seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });