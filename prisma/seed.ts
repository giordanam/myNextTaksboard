import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

const users = [
  { id: 'giordana', username: 'giordana', password: 'password123' },
  { id: 'lucio', username: 'lucio', password: 'password123' },
  { id: 'matteo', username: 'matteo', password: 'password123' },
  { id: 'federico', username: 'federico', password: 'password123' },
  { id: 'delin', username: 'delin', password: 'password123' },
];

async function main() {
  console.log('Inizio il seed del database...');

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }

  console.log('Seed completato con successo!');
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
