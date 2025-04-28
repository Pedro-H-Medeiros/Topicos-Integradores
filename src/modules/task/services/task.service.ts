import { UserPayload } from '@/modules/auth/strategies/jwt.strategy'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTaskBody } from '../schemas/create-task.schema'

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(user: UserPayload, body: CreateTaskBody) {
    const { title, description, status } = body

    const userExists = await this.prisma.administrator.findUnique({
      where: { id: user.sub },
    })

    if (!userExists) {
      throw new NotFoundException('This user does not exists.')
    }

    return await this.prisma.task.create({
      data: {
        title,
        description,
        status,
        createdBy: {
          connect: { id: userExists.id },
        },
      },
    })
  }

  async getAllTasks(user: UserPayload) {
    const tasks = await this.prisma.task.findMany({
      where: {
        administratorId: user.sub,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('This group does not have tasks.')
    }

    return { tasks }
  }

  async getInProgressTasks(user: UserPayload) {
    const tasks = await this.prisma.task.findMany({
      where: {
        administratorId: user.sub,
        status: 'IN_PROGRESS',
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
      },
    })

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No tasks in progress for this group.')
    }

    return { tasks }
  }

  async getTodoTasks(user: UserPayload) {
    const tasks = await this.prisma.task.findMany({
      where: {
        administratorId: user.sub,
        status: 'TODO',
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
      },
    })

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No TODO tasks for this group.')
    }

    return { tasks }
  }

  async getCompletedTasks(user: UserPayload) {
    const tasks = await this.prisma.task.findMany({
      where: {
        administratorId: user.sub,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
      },
    })

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No completed tasks for this group.')
    }

    return { tasks }
  }

  async updateTaskStatus(
    user: UserPayload,
    taskId: string,
    newStatus: 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
  ) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        administratorId: user.sub,
      },
    })

    if (!task) {
      throw new NotFoundException('Task not found or access denied.')
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
      select: {
        id: true,
        title: true,
        status: true,
      },
    })
  }
}
