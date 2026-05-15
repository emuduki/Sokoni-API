import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const run = async () => {
  await prisma.user.upsert({
    where: { email: 'admin@sokoni.local' },
    update: {},
    create: { email: 'admin@sokoni.local' },
  });
};

run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed', error);
    await prisma.$disconnect();
    process.exit(1);
  });
