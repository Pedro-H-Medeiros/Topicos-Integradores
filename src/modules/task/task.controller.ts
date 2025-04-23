import { UserPayload } from '@/modules/auth/strategies/jwt.strategy'
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateTaskSchemaSwagger } from './schemas/create-task-swagger.schema'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { TaskService } from './services/task.service'
import {
  CreateTaskBody,
  createTaskBodySchema,
} from './schemas/create-task.schema'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Tasks')
@Controller('/repositories/:groupId/task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiOperation({ summary: 'Create Task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiBody({ type: CreateTaskSchemaSwagger })
  @Post('/create')
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('groupId') groupId: string,
    @Body(new ZodValidationPipe(createTaskBodySchema))
    body: CreateTaskBody,
  ) {
    return await this.taskService.createTask(user, groupId, body)
  }
}
