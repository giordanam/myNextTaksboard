import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Inizio il seed del database...');

  const createMany = await prisma.user.createMany({
    data: [
      { username: 'giordana', name: 'Giordana Martucci', password: 'password123' },
      { username: 'lucio', name: 'Lucio Morelli', password: 'password123' },
      { username: 'matteo', name: 'Matteo Di Donato', password: 'password123' },
      { username: 'federico', name: 'Federico Micello', password: 'password123' },
      { username: 'delin', name: 'Delin Squarcella', password: 'password123' },
    ],
  });

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
