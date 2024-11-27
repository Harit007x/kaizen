/*
  Warnings:

  - Added the required column `updatedAt` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userId_fkey";

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
