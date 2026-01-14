-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hasCompletedProfile" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "professionalHeadline" VARCHAR(255),
    "aboutMe" TEXT,
    "phone" VARCHAR(20),
    "location" VARCHAR(255),
    "linkedin" VARCHAR(255),
    "github" VARCHAR(255),
    "portfolioUrl" VARCHAR(255),
    "resumeId" VARCHAR(255)[],
    "skills" TEXT[],
    "preferredLocations" TEXT[],
    "expectedSalary" INTEGER,
    "expectedSalaryMax" INTEGER,
    "experiences" JSONB,
    "education" JSONB,
    "certifications" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "profiles_userId_idx" ON "profiles"("userId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
