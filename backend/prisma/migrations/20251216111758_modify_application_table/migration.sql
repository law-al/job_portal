/*
  Warnings:

  - Added the required column `email` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_assignedTo_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_stageId_fkey";

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "documentsUrls" TEXT[],
ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "firstName" VARCHAR(100) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(100) NOT NULL,
ADD COLUMN     "linkedin" VARCHAR(255),
ADD COLUMN     "phone" VARCHAR(20) NOT NULL,
ALTER COLUMN "resumeUrl" DROP NOT NULL,
ALTER COLUMN "coverLetter" DROP NOT NULL,
ALTER COLUMN "expectedSalary" DROP NOT NULL,
ALTER COLUMN "portfolioUrl" DROP NOT NULL,
ALTER COLUMN "stageId" DROP NOT NULL,
ALTER COLUMN "assignedTo" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "applications_jobId_idx" ON "applications"("jobId");

-- CreateIndex
CREATE INDEX "applications_userId_idx" ON "applications"("userId");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "pipelineStages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "user_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
