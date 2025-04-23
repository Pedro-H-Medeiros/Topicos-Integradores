import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'

const prisma = new PrismaClient()

async function main() {
  await prisma.administrator.deleteMany()
  await prisma.task.deleteMany()
  await prisma.activityGroup.deleteMany()
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

  // Grupos de atividade
  const group1 = await prisma.activityGroup.create({
    data: {
      name: 'Marketing',
      description: 'Atividades de redes sociais e campanhas',
      administratorId: admin1.id,
    },
  })

  const group2 = await prisma.activityGroup.create({
    data: {
      name: 'Desenvolvimento',
      description: 'Tarefas técnicas e desenvolvimento de software',
      administratorId: admin2.id,
    },
  })

  // Tarefas
  const task1 = await prisma.task.create({
    data: {
      title: 'Criar post para Instagram',
      description: 'Post com CTA para nova campanha',
      status: 'TODO',
      administratorId: admin1.id,
      activityGroupId: group1.id,
    },
  })

  const task2 = await prisma.task.create({
    data: {
      title: 'Corrigir bugs na API',
      description: 'Revisar rotas de autenticação',
      status: 'IN_PROGRESS',
      administratorId: admin2.id,
      activityGroupId: group2.id,
    },
  })

  const task3 = await prisma.task.create({
    data: {
      title: 'Planejar estratégia de lançamento',
      description: 'Reunião de alinhamento com equipe',
      status: 'COMPLETED',
      administratorId: admin1.id,
      activityGroupId: group1.id,
    },
  })

  // Usuários externos
  const user1 = await prisma.externalUser.create({
    data: {
      name: 'Carlos Menezes',
      email: 'carlos@externo.com',
    },
  })

  const user2 = await prisma.externalUser.create({
    data: {
      name: 'Daniela Rocha',
      email: 'daniela@externo.com',
    },
  })

  // Atribuições de tarefas
  await prisma.taskAssignment.createMany({
    data: [
      {
        taskId: task1.id,
        externalUserId: user1.id,
        accessToken: randomUUID(),
      },
      {
        taskId: task2.id,
        externalUserId: user2.id,
        accessToken: randomUUID(),
      },
      {
        taskId: task3.id,
        externalUserId: user1.id,
        accessToken: randomUUID(),
      },
    ],
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
