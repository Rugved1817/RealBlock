/**
 * Backfill script: Create custodial wallets for all existing users who don't have one.
 * Run once: npx tsx scripts/backfill-custodial-wallets.ts
 */
import prisma from '../src/prisma/client.js';
import { custodialWalletService } from '../src/modules/blockchain/custodial-wallet.service.js';

async function main() {
    console.log('🔍 Finding users without custodial wallets...');

    const usersWithoutWallet = await prisma.user.findMany({
        where: { custodialWallet: null },
        select: { id: true, email: true },
    });

    console.log(`📋 Found ${usersWithoutWallet.length} users to backfill.\n`);

    let success = 0;
    let failed = 0;

    for (const user of usersWithoutWallet) {
        try {
            const wallet = await custodialWalletService.createWalletForUser(user.id);
            console.log(`✅ ${user.email} → ${wallet.address}`);
            success++;
        } catch (err) {
            console.error(`❌ Failed for ${user.email}:`, err);
            failed++;
        }
    }

    console.log(`\n✨ Done! Created ${success} wallets. ${failed} failed.`);
    await prisma.$disconnect();
}

main();
