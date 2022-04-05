-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'HOLD');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TOPUP', 'WITHDRAW', 'APPLY', 'RECEIVE', 'TRANSFER');

-- CreateTable
CREATE TABLE "UserTransaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "type" "TransactionType" NOT NULL,
    "message" TEXT NOT NULL DEFAULT E'',
    "status" "TransactionStatus" NOT NULL DEFAULT E'PENDING',
    "relatedId" INTEGER,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTransaction" ADD CONSTRAINT "UserTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
