import { UserPayload } from '@/modules/auth/strategies/jwt.strategy'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FetchGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllGroups(user: UserPayload) {
    return await this.prisma.activityGroup.findMany({
      where: {
        createdBy: {
          id: user.sub,
        },
      },
    })
  }
}
