import { blockchainService } from "../src/modules/blockchain/blockchain.service.js";
import { custodialWalletService } from "../src/modules/blockchain/custodial-wallet.service.js";
import prisma from "../src/prisma/client.js";
import { ethers } from "ethers";

async function resync() {
  const txId = "d8566c14-bae4-41d6-9dad-3c37f8202ce0";
  console.log(`\n🔍 Looking up transaction ${txId}...`);
  
  const tx = await prisma.transaction.findUnique({ 
    where: { id: txId }, 
    include: { property: true } 
  });
  
  if (!tx) {
    console.error("❌ Transaction not found in database.");
    return;
  }

  if (!tx.property || !tx.property.contractAddress) {
    console.error("❌ Property or contract address missing.");
    return;
  }

  const userAddress = await custodialWalletService.getWalletAddress(tx.userId);
  // Using 1 MATIC = 100,000 INR for simulation consistency
  const valueWei = ethers.utils.parseEther((tx.amount / 100000).toString()).toString();

  console.log(`🚀 Resyncing: ${tx.property.name}`);
  console.log(`📍 User Wallet: ${userAddress}`);
  console.log(`📦 Units: ${tx.sqft} sqft`);
  console.log(`💰 Value: ${ethers.utils.formatEther(valueWei)} MATIC`);

  try {
    const txHash = await blockchainService.purchaseOnChain(
      tx.property.contractAddress,
      userAddress,
      tx.sqft,
      valueWei
    );
    
    await prisma.transaction.update({
      where: { id: txId },
      data: { transactionHash: txHash }
    });
    console.log(`\n✅ SUCCESS! Blockchain Transaction Hash: ${txHash}`);
    console.log(`🔗 https://amoy.polygonscan.com/tx/${txHash}`);
  } catch (err: any) {
    console.error("\n❌ Sync failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

resync();
