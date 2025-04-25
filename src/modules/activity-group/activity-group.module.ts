import { Module } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { ActiviyGroupController } from './activity-group.controller'
import { CreateGroupService } from './services/create-group.service'
import { FetchGroupService } from './services/fetch-group.service'

@Module({
  controllers: [ActiviyGroupController],
  providers: [PrismaService, CreateGroupService, FetchGroupService],
})
export class ActivityGroupModule {}
