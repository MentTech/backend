/*
  Warnings:

  - You are about to drop the column `degree` on the `UserMentor` table. All the data in the column will be lost.
  - You are about to drop the column `experiences` on the `UserMentor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "isAccepted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserMentor" DROP COLUMN "degree",
DROP COLUMN "experiences";

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Degree" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Degree_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "UserMentor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Degree" ADD CONSTRAINT "Degree_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "UserMentor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
