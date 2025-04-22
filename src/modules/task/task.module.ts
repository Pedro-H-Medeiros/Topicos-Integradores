import { Module } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { TaskService } from './services/create-task.service'
import { TaskController } from './task.controller'

@Module({
  controllers: [TaskController],
  providers: [PrismaService, TaskService],
})
export class TaskModule {}
