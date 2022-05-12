-- CreateTable
CREATE TABLE "RegisterMenteeInfo" (
    "id" SERIAL NOT NULL,
    "registerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "expectation" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegisterMenteeInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegisterMenteeInfo_registerId_key" ON "RegisterMenteeInfo"("registerId");

-- AddForeignKey
ALTER TABLE "RegisterMenteeInfo" ADD CONSTRAINT "RegisterMenteeInfo_registerId_fkey" FOREIGN KEY ("registerId") REFERENCES "ProgramRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
