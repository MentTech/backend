-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('TopUp', 'Withdraw');

-- AlterTable
ALTER TABLE "OrderTransaction" ADD COLUMN     "orderType" "OrderType" NOT NULL DEFAULT E'TopUp';
