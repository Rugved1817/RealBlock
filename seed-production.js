import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    // Create a test user with a known ID for easy testing
    const testUser = await prisma.user.upsert({
        where: { email: 'test@realblock.com' },
        update: {},
        create: {
            id: 'test-user-12345', // Fixed ID for easy testing
            email: 'test@realblock.com',
            isKycVerified: false,
        },
    });

    console.log('✅ Test user created:');
    console.log('   ID:', testUser.id);
    console.log('   Email:', testUser.email);
    console.log('');
    console.log('🔑 Use this Authorization header for testing:');
    console.log('   Authorization: Bearer', testUser.id);
}

seed()
    .catch((error) => {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
