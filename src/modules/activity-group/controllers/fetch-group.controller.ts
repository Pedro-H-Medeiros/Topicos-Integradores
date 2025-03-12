import { CurrentUser } from '@/modules/auth/current-user.decorator'
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard'
import { UserPayload } from '@/modules/auth/strategies/jwt.strategy'
import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Activity Group')
@Controller('/repositories')
@UseGuards(JwtAuthGuard)
export class FetchGroupControler {
  constructor(private prisma: PrismaService) {}

  @ApiOperation({ summary: 'Get All Activity Group' })
  @ApiResponse({ status: 200 })
  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    return await this.prisma.activityGroup.findMany({
      where: {
        createdBy: {
          id: user.sub,
        },
      },
    })
  }
}
