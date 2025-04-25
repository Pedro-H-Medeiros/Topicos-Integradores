import { PrismaService } from '@/prisma/prisma.service'
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { RegisterUserBody } from '../schemas/register.schema'
import { UserPayload } from '@/modules/auth/strategies/jwt.strategy'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(body: RegisterUserBody) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.administrator.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with this email already exists.')
    }

    const passwordHash = await hash(password, 12)

    return await this.prisma.administrator.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    })
  }

  async getUserName(user: UserPayload) {
    const userProfile = await this.prisma.administrator.findUnique({
      where: {
        id: user.sub,
      },
      select: {
        name: true,
      },
    })

    if (!userProfile) {
      throw new NotFoundException('This user does not Exists')
    }

    return { userProfile }
  }
}
