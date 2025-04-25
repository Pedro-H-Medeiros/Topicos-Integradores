import { UserPayload } from '@/modules/auth/strategies/jwt.strategy'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateGroupControllerBody } from '../schemas/activity-group.schema'

@Injectable()
export class CreateGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(user: UserPayload, body: CreateGroupControllerBody) {
    const { name, description } = body

    const userExists = await this.prisma.administrator.findUnique({
      where: { id: user.sub },
    })

    if (!userExists.id) {
      throw new NotFoundException('This user does not exists.')
    }

    return await this.prisma.activityGroup.create({
      data: {
        name,
        description,
        createdBy: {
          connect: { id: userExists.id },
        },
      },
    })
  }
}
