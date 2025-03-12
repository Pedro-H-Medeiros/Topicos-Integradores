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
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'
import { ActivityGroupSchemaSwagger } from '../schemas/activity-group.schema'

const createGroupControllerSchema = z.object({
  name: z.string(),
  description: z.string(),
})

const createGroupValidationPipe = new ZodValidationPipe(
  createGroupControllerSchema,
)

type CreateGroupControllerBody = z.infer<typeof createGroupControllerSchema>

@ApiBearerAuth()
@ApiTags('Activity Group')
@Controller('/repositories')
@UseGuards(JwtAuthGuard)
export class CreateGroupController {
  constructor(private prisma: PrismaService) {}

  @ApiOperation({ summary: 'Create Activity Group' })
  @ApiResponse({
    status: 201,
    description: 'Activity Group created successfully.',
  })
  @ApiResponse({ status: 404, description: 'This user does not exists.' })
  @ApiBody({ type: ActivityGroupSchemaSwagger })
  @Post('/create')
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(createGroupValidationPipe) body: CreateGroupControllerBody,
  ) {
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
