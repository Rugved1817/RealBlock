import prisma from '../src/prisma/client.js';

async function main() {
    const result = await prisma.user.updateMany({
        where: { email: 'rugved17@gmail.com' },
        data: { role: 'ADMIN' } as any,
    });
    console.log('✅ Promoted to ADMIN:', result);

    // Also print all admins
    const admins = await (prisma as any).user.findMany({
        where: { role: 'ADMIN' },
        select: { email: true, role: true }
    });
    console.log('Current admins:', admins);
    await prisma.$disconnect();
}
main();
