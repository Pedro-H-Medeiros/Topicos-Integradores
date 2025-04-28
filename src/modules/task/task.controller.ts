import { UserPayload } from '@/modules/auth/strategies/jwt.strategy'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { UpdateTaskStatusSwagger } from './schemas/update-task.swagget.schema'
import {
  UpdateTaskStatusBody,
  updateTaskStatusBodySchema,
} from './schemas/update-task.schema'

@ApiTags('Tasks')
@Controller('/task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiOperation({ summary: 'Create Task' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully.',
  })
  @ApiBody({ type: CreateTaskSchemaSwagger })
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createTaskBodySchema))
    body: CreateTaskBody,
  ) {
    return await this.taskService.createTask(user, body)
  }

  @ApiOperation({ summary: 'List all tasks in a group' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All tasks returned successfully.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllTasks(@CurrentUser() user: UserPayload) {
    return await this.taskService.getAllTasks(user)
  }

  @ApiOperation({ summary: 'List tasks with TODO status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'TODO tasks returned successfully.',
  })
  @Get('/todo')
  @HttpCode(HttpStatus.OK)
  getTodoTasks(@CurrentUser() user: UserPayload) {
    return this.taskService.getTodoTasks(user)
  }

  @ApiOperation({ summary: 'List tasks with IN_PROGRESS status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'In-progress tasks returned successfully.',
  })
  @Get('/in-progress')
  @HttpCode(HttpStatus.OK)
  getInProgressTasks(@CurrentUser() user: UserPayload) {
    return this.taskService.getInProgressTasks(user)
  }

  @ApiOperation({ summary: 'List tasks with COMPLETED status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Completed tasks returned successfully.',
  })
  @Get('/completed')
  @HttpCode(HttpStatus.OK)
  getCompletedTasks(@CurrentUser() user: UserPayload) {
    return this.taskService.getCompletedTasks(user)
  }

  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task status updated successfully.',
  })
  @ApiBody({ type: UpdateTaskStatusSwagger })
  @Put('/:taskId/update-status')
  @HttpCode(HttpStatus.OK)
  async updateTaskStatus(
    @CurrentUser() user: UserPayload,
    @Param('taskId') taskId: string,
    @Body(new ZodValidationPipe(updateTaskStatusBodySchema))
    body: UpdateTaskStatusBody,
  ) {
    return this.taskService.updateTaskStatus(user, taskId, body.status)
  }
}
