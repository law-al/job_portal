/*
  Warnings:

  - Made the column `companyId` on table `applications` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_companyId_fkey";

-- AlterTable
ALTER TABLE "applications" ALTER COLUMN "companyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
