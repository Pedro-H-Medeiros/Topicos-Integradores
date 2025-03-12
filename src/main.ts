import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

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

  const configService: ConfigService<Env, true> = app.get(ConfigService)
  const PORT = configService.get('PORT', {
    infer: true,
  })

  try {
    await app.listen(PORT)
    console.log('🚀 Server listening on port', PORT)
  } catch (error) {
    throw new Error(error)
  }
}
bootstrap()
