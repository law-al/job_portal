-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('STAGE_CHANGED', 'STATUS_CHANGED', 'ASSIGNED', 'UNASSIGNED', 'NOTE_ADDED', 'COMMENT', 'EMAIL_SENT', 'INTERVIEW_SCHEDULED', 'INTERVIEW_UPDATED', 'INTERVIEW_CANCELED', 'FILE_UPLOADED', 'PIPELINE_AUTOMATION', 'APPLICATION_CREATED');

-- CreateTable
CREATE TABLE "application_activities" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "actorId" UUID,
    "type" "ActivityType" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_activities_applicationId_idx" ON "application_activities"("applicationId");

-- CreateIndex
CREATE INDEX "application_activities_actorId_idx" ON "application_activities"("actorId");

-- AddForeignKey
ALTER TABLE "application_activities" ADD CONSTRAINT "application_activities_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_activities" ADD CONSTRAINT "application_activities_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
