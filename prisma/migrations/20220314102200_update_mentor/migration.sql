/*
  Warnings:

  - You are about to drop the column `mentorId` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `field` on the `UserMentor` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `UserMentor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_mentorId_fkey";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "mentorId";

-- AlterTable
ALTER TABLE "UserMentor" DROP COLUMN "field",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillsOnMentors" (
    "mentorId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillsOnMentors_pkey" PRIMARY KEY ("mentorId","skillId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "UserMentor" ADD CONSTRAINT "UserMentor_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsOnMentors" ADD CONSTRAINT "SkillsOnMentors_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "UserMentor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsOnMentors" ADD CONSTRAINT "SkillsOnMentors_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
