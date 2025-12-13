/*
  Warnings:

  - You are about to drop the column `googleId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `linkendinId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_googleId_key";

-- DropIndex
DROP INDEX "users_linkendinId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "googleId",
DROP COLUMN "linkendinId",
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "providerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_providerId_key" ON "users"("providerId");
