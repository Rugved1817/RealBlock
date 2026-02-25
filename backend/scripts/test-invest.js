import 'dotenv/config';
import { propertyService } from '../src/modules/property/property.service.js';
import prisma from '../src/prisma/client.js';

async function main() {
    const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
    const property = await prisma.property.findFirst({ where: { contractAddress: { not: null }, status: 'OPEN' } });

    if (!user || !property) {
        console.error('User or property not found. Run seed and deploy-tokens first.');
        return;
    }

    console.log(`Testing investment for user ${user.email} in property ${property.name}...`);
    console.log(`Contract Address: ${property.contractAddress}`);

    try {
        const result = await propertyService.invest(user.id, property.id, 5);
        console.log('✅ Investment successful!');
        console.log('Transaction ID:', result.transaction.id);
        console.log('Blockchain Hash:', result.transaction.transactionHash);
        console.log('New sqftSold:', result.updatedProperty.sqftSold);
    } catch (error) {
        console.error('❌ Investment failed:', error.message);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
