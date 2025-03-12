import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { UserModule } from './modules/user/user.module'
import { TaskModule } from './modules/task/task.module'
import { AuthModule } from './modules/auth/auth.module'
import { ActivityGroupModule } from './modules/activity-group/activity-group.module'
import { MailModule } from './modules/mail/mail.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    MailModule,
    AuthModule,
    ActivityGroupModule,
    TaskModule,
    UserModule,
  ],
})
export class AppModule {}
