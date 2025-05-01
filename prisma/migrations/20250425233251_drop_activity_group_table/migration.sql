/*
  Warnings:

  - You are about to drop the column `activityGroupId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `activity_groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activity_groups" DROP CONSTRAINT "activity_groups_administratorId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_activityGroupId_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "activityGroupId";

-- DropTable
DROP TABLE "activity_groups";
