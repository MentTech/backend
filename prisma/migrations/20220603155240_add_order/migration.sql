-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Paypal', 'WireTransfer', 'Momo', 'ViettelPay', 'ZaloPay');

-- CreateTable
CREATE TABLE "OrderTransaction" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT E'WireTransfer',
    "status" "TransactionStatus" NOT NULL DEFAULT E'PENDING',
    "note" TEXT NOT NULL DEFAULT E'',
    "token" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderTransaction_pkey" PRIMARY KEY ("id")
);
