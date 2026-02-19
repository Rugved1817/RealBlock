
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    console.log('Seeding wallets...');

    const users = await prisma.user.findMany({
        include: { wallet: true }
    });

    for (const user of users) {
        if (!user.wallet) {
            console.log(`Creating wallet for user: ${user.email}`);
            await prisma.wallet.create({
                data: {
                    userId: user.id,
                    balance: 500000 + Math.random() * 500000, // Random balance between 5L and 10L
                    currency: 'INR'
                }
            });
        } else {
            console.log(`Wallet already exists for user: ${user.email}`);
        }
    }

    console.log('Wallet seeding completed.');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
