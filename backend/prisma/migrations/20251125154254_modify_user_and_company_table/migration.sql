/*
  Warnings:

  - The values [COMPANY_ADMIN,RECRUITER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `role` on table `user_companies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "CompanyRole" ADD VALUE 'COMPANY_ADMIN';

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('JOB_SEEKER', 'COMPANY', 'OTHER');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "user_companies" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'OTHER';
