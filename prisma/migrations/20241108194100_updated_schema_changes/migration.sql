/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `UserWorkspace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workspace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "UserWorkspace" DROP CONSTRAINT "UserWorkspace_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserWorkspace" DROP CONSTRAINT "UserWorkspace_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "workspaceId";

-- DropTable
DROP TABLE "UserWorkspace";

-- DropTable
DROP TABLE "Workspace";

-- DropEnum
DROP TYPE "ROLES";
