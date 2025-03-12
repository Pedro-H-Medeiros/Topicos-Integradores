import { CurrentUser } from '@/modules/auth/current-user.decorator'
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard'
import { UserPayload } from '@/modules/auth/strategies/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { CreateTaskSchemaSwagger } from '../schemas/create-task.schema'

const createTaskControllerSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).default('TODO'),
})

const createTaskValidationPipe = new ZodValidationPipe(
  createTaskControllerSchema,
)

type CreateTaskControllerBody = z.infer<typeof createTaskControllerSchema>

@ApiTags('Tasks')
@Controller('/repositories/:groupId/task')
@UseGuards(JwtAuthGuard)
export class CreateTaskController {
  constructor(private prisma: PrismaService) {}

  @ApiOperation({ summary: 'Create Task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiBody({ type: CreateTaskSchemaSwagger })
  @Post('/create')
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('groupId') groupId: string,
    @Body(createTaskValidationPipe) body: CreateTaskControllerBody,
  ) {
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
        activityGroup: {
          connect: { id: activityGroup.id },
        },
      },
    })
  }
}
