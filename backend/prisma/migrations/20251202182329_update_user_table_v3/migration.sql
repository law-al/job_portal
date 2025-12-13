/*
  Warnings:

  - The values [COMPANY_ADMIN] on the enum `CompanyRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [JOB_SEEKER,OTHER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CompanyRole_new" AS ENUM ('ADMIN', 'HR', 'RECRUITER', 'INTERVIEWER', 'OTHER');
ALTER TABLE "public"."user_companies" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user_companies" ALTER COLUMN "role" TYPE "CompanyRole_new" USING ("role"::text::"CompanyRole_new");
ALTER TABLE "invitations" ALTER COLUMN "role" TYPE "CompanyRole_new" USING ("role"::text::"CompanyRole_new");
ALTER TYPE "CompanyRole" RENAME TO "CompanyRole_old";
ALTER TYPE "CompanyRole_new" RENAME TO "CompanyRole";
DROP TYPE "public"."CompanyRole_old";
ALTER TABLE "user_companies" ALTER COLUMN "role" SET DEFAULT 'OTHER';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('USER', 'COMPANY');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
