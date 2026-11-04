import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

const createMany = await prisma.user.createMany({
  data: [
    { id: 'giordana', username: 'giordana', password: 'password123' },
    { id: 'lucio', username: 'lucio', password: 'password123' },
    { id: 'matteo', username: 'matteo', password: 'password123' },
    { id: 'federico', username: 'federico', password: 'password123' },
    { id: 'delin', username: 'delin', password: 'password123' },
  ],
});

async function main() {
  console.log('Inizio il seed del database...');

  console.log('Utenti creati:', createMany);

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
