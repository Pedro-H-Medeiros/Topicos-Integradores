import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
// import { Handler, Context, Callback } from 'aws-lambda'
import serverless from '@codegenie/serverless-express'
import cookieParser from 'cookie-parser'
// let server: Handler

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.init()

  const configService: ConfigService<Env, true> = app.get(ConfigService)

  app.use(cookieParser())

  app.enableCors({
    origin: configService.get('CORS_ORIGIN', { infer: true }),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('Tópicos Integradores - UNINASSAU')
    .setDescription(
      'Documentação da api utilizada na disciplina de tópicos integradores da turma do 7º semestre de SI da UNINASSAU',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  const PORT = configService.get('PORT', {
    infer: true,
  })

  const expressApp = app.getHttpAdapter().getInstance()

  try {
    await app.listen(PORT)
    serverless({ app: expressApp })
    console.log('🚀 Server listening on port', PORT)
  } catch (error) {
    throw new Error(error)
  }
}
bootstrap()

// export const handler: Handler = async (
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   event: any,
//   context: Context,
//   callback: Callback,
// ) => {
//   server = server ?? (await bootstrap())
//   return server(event, context, callback)
// }
