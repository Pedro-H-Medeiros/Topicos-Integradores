import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.administrator.deleteMany()
  await prisma.task.deleteMany()
  await prisma.taskAssignment.deleteMany()
  await prisma.externalUser.deleteMany()

  // Criação de administradores
  const admin1 = await prisma.administrator.create({
    data: {
      name: 'Alice Silva',
      email: 'alice@admin.com',
      password: await hash('admin123', 10),
    },
  })

  const admin2 = await prisma.administrator.create({
    data: {
      name: 'Bruno Costa',
      email: 'bruno@admin.com',
      password: await hash('admin123', 10),
    },
  })

  // Tarefas
  await prisma.task.create({
    data: {
      title: 'Criar post para Instagram',
      description: 'Post com CTA para nova campanha',
      status: 'TODO',
      administratorId: admin1.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Corrigir bugs na API',
      description: 'Revisar rotas de autenticação',
      status: 'IN_PROGRESS',
      administratorId: admin2.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Planejar estratégia de lançamento',
      description: 'Reunião de alinhamento com equipe',
      status: 'COMPLETED',
      administratorId: admin1.id,
    },
  })
}

main()
  .then(() => {
    console.log('🌱 Seed concluído com sucesso!')
    return prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
