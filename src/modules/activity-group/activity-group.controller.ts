import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CreateGroupService } from './services/create-group.service'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { CurrentUser } from '../auth/current-user.decorator'
import { UserPayload } from '../auth/strategies/jwt.strategy'
import {
  createGroupControllerSchema,
  CreateGroupControllerBody,
} from './schemas/activity-group.schema'
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'
import { ActivityGroupSchemaSwagger } from './schemas/activity-group-swagger.schema'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { FetchGroupService } from './services/fetch-group.service'

@ApiBearerAuth()
@ApiTags('Activity Group')
@UseGuards(JwtAuthGuard)
@Controller('/repositories')
export class ActiviyGroupController {
  constructor(
    private createGroupService: CreateGroupService,
    private fetchGroupService: FetchGroupService,
  ) {}

  @ApiOperation({ summary: 'Create Activity Group' })
  @ApiResponse({
    status: 201,
    description: 'Activity Group created successfully.',
  })
  @ApiResponse({ status: 404, description: 'This user does not exists.' })
  @ApiBody({ type: ActivityGroupSchemaSwagger })
  @Post('/create')
  @HttpCode(201)
  async createGroup(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createGroupControllerSchema))
    body: CreateGroupControllerBody,
  ) {
    return await this.createGroupService.createGroup(user, body)
  }

  @ApiOperation({ summary: 'Get All Activity Group' })
  @ApiResponse({ status: 200 })
  @Get()
  async getAllGroups(@CurrentUser() user: UserPayload) {
    return await this.fetchGroupService.getAllGroups(user)
  }
}
