import { prisma } from "@/lib/prisma";

export async function getFields() {
  return prisma.field.findMany({
    orderBy: {
      number: "asc",
    },
  });
}
export async function getFieldSlugs() {
  return prisma.field.findMany({
    select: {
      slug: true,
    },
  });
}