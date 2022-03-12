/*
  Warnings:

  - You are about to drop the column `detail` on the `UserMentor` table. All the data in the column will be lost.
  - You are about to drop the column `skill` on the `UserMentor` table. All the data in the column will be lost.
  - Added the required column `introduction` to the `UserMentor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserMentor" DROP COLUMN "detail",
DROP COLUMN "skill",
ADD COLUMN     "introduction" TEXT NOT NULL;
