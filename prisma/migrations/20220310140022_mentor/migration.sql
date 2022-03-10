-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'MENTEE';
ALTER TYPE "Role" ADD VALUE 'MENTOR';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "birthday" TEXT,
ADD COLUMN     "coin" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "UserMentor" (
    "userId" INTEGER NOT NULL,
    "degree" TEXT[],
    "experiences" TEXT[],
    "linkedin" TEXT,
    "field" TEXT NOT NULL,
    "skill" JSONB NOT NULL,
    "detail" TEXT NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "UserMentor_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "additional" JSONB,
    "mentorId" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "additional" JSONB,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "additional" JSONB,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserMentor" ADD CONSTRAINT "UserMentor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "UserMentor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "UserMentor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "UserMentor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
