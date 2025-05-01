import { Module } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { TaskService } from './services/task.service'
import { TaskController } from './task.controller'
import { EmailModule } from '../mail/email.module'

@Module({
  imports: [EmailModule],
  controllers: [TaskController],
  providers: [PrismaService, TaskService],
})
export class TaskModule {}
