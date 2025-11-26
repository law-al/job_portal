/*
  Warnings:

  - You are about to drop the `PipelineStage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PipelineStage" DROP CONSTRAINT "PipelineStage_jobId_fkey";

-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_stageId_fkey";

-- DropTable
DROP TABLE "PipelineStage";

-- CreateTable
CREATE TABLE "pipelineStages" (
    "id" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "pipelineStages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "applications_id_idx" ON "applications"("id");

-- AddForeignKey
ALTER TABLE "pipelineStages" ADD CONSTRAINT "pipelineStages_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "pipelineStages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
