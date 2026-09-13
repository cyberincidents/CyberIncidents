/*
  Warnings:

  - A unique constraint covering the columns `[unsubscribeToken]` on the table `NotificationSubscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "NotificationSubscriber" ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "unsubscribeToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSubscriber_unsubscribeToken_key" ON "NotificationSubscriber"("unsubscribeToken");
