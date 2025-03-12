import { Module } from '@nestjs/common'
import { CreateGroupController } from './controllers/create-group.controller'
import { PrismaService } from '@/prisma/prisma.service'
import { FetchGroupControler } from './controllers/fetch-group.controller'

@Module({
  controllers: [CreateGroupController, FetchGroupControler],
  providers: [PrismaService],
})
export class ActivityGroupModule {}
