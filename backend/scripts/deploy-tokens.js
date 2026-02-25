import 'dotenv/config';
import { blockchainService } from '../src/modules/blockchain/blockchain.service.js';
import prisma from '../src/prisma/client.js';
import { ethers } from 'ethers';

async function main() {
    console.log('🚀 Starting property token deployment...');

    const properties = await prisma.property.findMany({
        where: {
            contractAddress: null
        }
    });

    if (properties.length === 0) {
        console.log('✅ All properties already have contract addresses.');
        return;
    }

    console.log(`📡 Found ${properties.length} properties to deploy.`);

    for (const property of properties) {
        console.log(`📦 Deploying token for: ${property.name}...`);

        try {
            const sym = property.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 5);
            // Mock price conversion
            const priceWei = ethers.utils.parseEther((property.pricePerSqft / 100000).toString()).toString();

            const address = await blockchainService.deployPropertyToken(
                property.name,
                sym,
                property.totalSqft,
                priceWei
            );

            await prisma.property.update({
                where: { id: property.id },
                data: { contractAddress: address }
            });

            console.log(`✅ Deployed ${property.name} at ${address}`);
        } catch (error) {
            console.error(`❌ Failed to deploy ${property.name}:`, error.message);
        }
    }

    console.log('✨ Deployment finished.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
