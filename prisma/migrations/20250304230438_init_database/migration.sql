-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "administrators" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "administrators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activityGroupId" INTEGER NOT NULL,
    "administratorId" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "administratorId" TEXT NOT NULL,

    CONSTRAINT "activity_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_assignments" (
    "id" SERIAL NOT NULL,
    "accessToken" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "externalUserId" TEXT NOT NULL,

    CONSTRAINT "task_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "external_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "administrators_email_key" ON "administrators"("email");

-- CreateIndex
CREATE UNIQUE INDEX "task_assignments_accessToken_key" ON "task_assignments"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "external_users_email_key" ON "external_users"("email");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_activityGroupId_fkey" FOREIGN KEY ("activityGroupId") REFERENCES "activity_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_administratorId_fkey" FOREIGN KEY ("administratorId") REFERENCES "administrators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_groups" ADD CONSTRAINT "activity_groups_administratorId_fkey" FOREIGN KEY ("administratorId") REFERENCES "administrators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_externalUserId_fkey" FOREIGN KEY ("externalUserId") REFERENCES "external_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
