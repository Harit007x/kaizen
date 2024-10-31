/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UnverifiedAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "profile" TEXT,
ADD COLUMN     "publicId" TEXT;

-- DropTable
DROP TABLE "UnverifiedAccount";
