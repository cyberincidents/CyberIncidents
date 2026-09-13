-- CreateTable
CREATE TABLE "BlogViewEvent" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "referer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogViewEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogViewEvent_blogId_idx" ON "BlogViewEvent"("blogId");

-- CreateIndex
CREATE INDEX "BlogViewEvent_createdAt_idx" ON "BlogViewEvent"("createdAt");

-- CreateIndex
CREATE INDEX "BlogViewEvent_blogId_createdAt_idx" ON "BlogViewEvent"("blogId", "createdAt");

-- AddForeignKey
ALTER TABLE "BlogViewEvent" ADD CONSTRAINT "BlogViewEvent_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
