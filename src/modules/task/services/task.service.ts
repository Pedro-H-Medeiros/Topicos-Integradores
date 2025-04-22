import { UserPayload } from '@/modules/auth/strategies/jwt.strategy'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTaskBody } from '../schemas/create-task.schema'

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(user: UserPayload, groupId: string, body: CreateTaskBody) {
    const { title, description, status } = body

    const userExists = await this.prisma.administrator.findUnique({
      where: { id: user.sub },
    })

    if (!userExists) {
      throw new NotFoundException('This user does not exists.')
    }

    const activityGroup = await this.prisma.activityGroup.findUnique({
      where: {
        id: Number(groupId),
        createdBy: { id: userExists.id },
      },
    })

    return await this.prisma.task.create({
      data: {
        title,
        description,
        status,
        createdBy: {
          connect: { id: userExists.id },
        },
        activityGroup: {
          connect: { id: activityGroup.id },
        },
      },
    })
  }
}
