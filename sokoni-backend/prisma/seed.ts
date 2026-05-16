import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/shared/auth/password.js';

const prisma = new PrismaClient();

const run = async () => {
  const passwordHash = await hashPassword('ChangeMe123!');

  await prisma.user.upsert({
    where: { email: 'admin@sokoni.local' },
    update: { passwordHash, role: 'ADMIN' },
    create: {
      email: 'admin@sokoni.local',
      passwordHash,
      role: 'ADMIN',
    },
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
