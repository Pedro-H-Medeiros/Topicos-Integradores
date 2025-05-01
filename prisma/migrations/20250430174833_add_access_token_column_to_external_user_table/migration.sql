/*
  Warnings:

  - You are about to drop the column `accessToken` on the `task_assignments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accessToken]` on the table `external_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[taskId,externalUserId]` on the table `task_assignments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `external_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "task_assignments_accessToken_key";

-- AlterTable
ALTER TABLE "external_users" ADD COLUMN     "accessToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "task_assignments" DROP COLUMN "accessToken";

-- CreateIndex
CREATE UNIQUE INDEX "external_users_accessToken_key" ON "external_users"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "task_assignments_taskId_externalUserId_key" ON "task_assignments"("taskId", "externalUserId");
