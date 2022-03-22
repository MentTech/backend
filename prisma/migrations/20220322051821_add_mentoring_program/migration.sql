-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "credit" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "UserMentor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
