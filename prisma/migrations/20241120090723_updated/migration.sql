/*
  Warnings:

  - You are about to drop the column `priority` on the `Task` table. All the data in the column will be lost.
  - Added the required column `priorityId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "priority",
ADD COLUMN     "priorityId" TEXT NOT NULL;
