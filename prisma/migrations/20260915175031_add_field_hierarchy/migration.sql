-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "Field_parentId_idx" ON "Field"("parentId");

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Field"("id") ON DELETE SET NULL ON UPDATE CASCADE;
