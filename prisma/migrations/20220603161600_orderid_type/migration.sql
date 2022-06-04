/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `OrderTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OrderTransaction" ALTER COLUMN "orderId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OrderTransaction_orderId_key" ON "OrderTransaction"("orderId");
