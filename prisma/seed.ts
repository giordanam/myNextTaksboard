import { PrismaClient } from '@/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

async function main() {
  console.log('Inizio il seeding degli utenti...');

  const giordana = await prisma.user.upsert({
    where: { username: 'giordana' },
    update: {},
    create: {
      id: 'giordana',
      username: 'giordana',
      password: 'password123',
    },
  });

  const lucio = await prisma.user.upsert({
    where: { username: 'lucio' },
    update: {},
    create: {
      id: 'lucio',
      username: 'lucio',
      password: 'password123',
    },
  });

  const matteo = await prisma.user.upsert({
    where: { username: 'matteo' },
    update: {},
    create: {
      id: 'matteo',
      username: 'matteo',
      password: 'password123',
    },
  });

  const federico = await prisma.user.upsert({
    where: { username: 'federico' },
    update: {},
    create: {
      id: 'federico',
      username: 'federico',
      password: 'password123',
    },
  });

  const delin = await prisma.user.upsert({
    where: { username: 'delin' },
    update: {},
    create: {
      id: 'delin',
      username: 'delin',
      password: 'password123',
    },
  });

  console.log('Seeding completato! Utenti creati:');
  console.log({
    giordana: giordana.username,
    lucio: lucio.username,
    matteo: matteo.username,
    federico: federico.username,
    delin: delin.username,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
