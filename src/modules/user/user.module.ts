import { Module } from '@nestjs/common'
import { RegisterController } from './controllers/register.controller'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  controllers: [RegisterController],
  providers: [PrismaService],
})
export class UserModule {}
