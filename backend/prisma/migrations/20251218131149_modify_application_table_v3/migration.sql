/*
  Warnings:

  - You are about to drop the column `documentsUrls` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "applications" DROP COLUMN "documentsUrls",
DROP COLUMN "resumeUrl",
ADD COLUMN     "documentsIds" TEXT[],
ADD COLUMN     "resumeId" TEXT;
