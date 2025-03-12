import { Module } from '@nestjs/common'
import { CreateTaskController } from './controllers/create-task.controller'
import { PrismaService } from '@/prisma/prisma.service'

@Module({
  controllers: [CreateTaskController],
  providers: [PrismaService],
})
export class TaskModule {}
