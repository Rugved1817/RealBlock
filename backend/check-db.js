
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const prop = await prisma.property.findFirst({
        where: { name: 'Horizon Tech Park' }
    });
    console.log(JSON.stringify(prop, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
