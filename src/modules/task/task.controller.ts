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
  Query,
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
import { Public } from '../auth/decorators/public.decorator'

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
  async getAllTasks(
    @CurrentUser() user: UserPayload,
    @Query('page') page: number,
  ) {
    return await this.taskService.getAllTasks(user, page)
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

  @ApiOperation({ summary: 'Assign task to external user via email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task assigned and email sent successfully.',
  })
  @Put('/:taskId/assign')
  @HttpCode(HttpStatus.OK)
  async assignTask(
    @Param('taskId') taskId: string,
    @Query('name') name: string,
    @Query('email') email: string,
  ) {
    return await this.taskService.assignTask(taskId, name, email)
  }

  @ApiOperation({
    summary: 'Get task assigned to an external user by accessToken',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task assigned to external user retrieved successfully.',
  })
  @Public()
  @Get('/external/:accessToken')
  @HttpCode(HttpStatus.OK)
  async getTaskByAccessToken(@Param('accessToken') accessToken: string) {
    return await this.taskService.getTasksByAccessToken(accessToken)
  }
}
