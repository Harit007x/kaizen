/*
  Warnings:

  - You are about to drop the column `is_completed` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "is_completed",
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;
