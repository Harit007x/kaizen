/*
  Warnings:

  - Added the required column `position` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "position" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "position" INTEGER NOT NULL;
