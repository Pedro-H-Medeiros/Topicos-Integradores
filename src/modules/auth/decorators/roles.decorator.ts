import { SetMetadata } from '@nestjs/common'
import { UserRoleEnum } from '../enum/user-roles.enum'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: UserRoleEnum[]) => SetMetadata(ROLES_KEY, roles)
