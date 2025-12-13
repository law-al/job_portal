-- CreateEnum
CREATE TYPE "UserCompanyStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'REMOVED', 'BLOCKED');

-- AlterTable
ALTER TABLE "user_companies" ADD COLUMN     "status" "UserCompanyStatus" NOT NULL DEFAULT 'ACTIVE';
