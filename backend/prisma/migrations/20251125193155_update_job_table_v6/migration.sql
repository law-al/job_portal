-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slot" INTEGER;
