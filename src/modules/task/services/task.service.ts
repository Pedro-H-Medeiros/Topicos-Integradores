import { UserPayload } from '@/modules/auth/strategies/jwt.strategy'
import { PrismaService } from '@/prisma/prisma.service'
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateTaskBody } from '../schemas/create-task.schema'
import { EmailService } from '@/modules/mail/email.service'
import { randomUUID } from 'node:crypto'

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

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

  async getAllTasks(user: UserPayload, page: number) {
    const perPage = 6

    const tasks = await this.prisma.task.findMany({
      where: {
        administratorId: user.sub,
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
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

    if (!tasks) {
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

  async assignTask(taskId: string, name: string, email: string) {
    let externalUser = await this.prisma.externalUser.findUnique({
      where: { email },
      select: { id: true, accessToken: true },
    })

    if (!externalUser) {
      const accessToken = randomUUID()

      externalUser = await this.prisma.externalUser.create({
        data: {
          name,
          email,
          accessToken,
        },
        select: { id: true, accessToken: true },
      })
    }

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.')
    }

    const existingAssignment = await this.prisma.taskAssignment.findFirst({
      where: {
        externalUser: { email },
        taskId,
      },
    })

    if (!existingAssignment) {
      await this.prisma.taskAssignment.create({
        data: {
          externalUserId: externalUser.id,
          taskId,
        },
      })
    }

    const accessLink = `${process.env.CORS_ORIGIN}/task/external/${externalUser.accessToken}`

    const subject = 'Tarefa atribuída'
    const html = `<p>Você recebeu uma nova tarefa. Acesse pelo link: 
      <a href="${accessLink}" target="_blank">${accessLink}</a></p>`
    const text = `Você recebeu uma nova tarefa. Acesse: ${accessLink}`

    await this.emailService.handler({ email, subject, html, text })

    return { message: `Email enviado para ${email}!` }
  }

  async getTasksByAccessToken(accessToken: string) {
    const externalUser = await this.prisma.externalUser.findUnique({
      where: { accessToken },
      include: {
        assignments: {
          include: {
            task: {
              include: {
                createdBy: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    })

    if (!externalUser) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso.',
      )
    }

    const tasks = externalUser.assignments.map((assignment) => ({
      id: assignment.task.id,
      title: assignment.task.title,
      description: assignment.task.description,
      status: assignment.task.status,
      createdAt: assignment.task.createdAt,
      createdBy: assignment.task.createdBy.name,
    }))

    if (!tasks) {
      throw new NotFoundException('Tarefas não encontradas.')
    }

    return { tasks }
  }
}
