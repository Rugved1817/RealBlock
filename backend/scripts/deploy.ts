/**
 * Deploy RealEstatePropertyToken to any network.
 */

import hre from 'hardhat';

const PROPERTIES_TO_DEPLOY = [
  { name: 'Skyline Office Complex',  symbol: 'SKY-SQFT', totalSqft: 10000, pricePerSqftINR: 6500 },
  { name: 'Meridian Tech Park',      symbol: 'MTP-SQFT', totalSqft: 8000,  pricePerSqftINR: 5800 },
  { name: 'Coastal Warehouse Hub',   symbol: 'CWH-SQFT', totalSqft: 15000, pricePerSqftINR: 3200 },
];

async function main() {
  const ethers = (hre as any).ethers;
  if (!ethers) {
    console.log("Current HRE Keys:", Object.keys(hre));
    throw new Error("hre.ethers is undefined! Hardhat v3 requires plugins to be explicitly loaded in hardhat.config.ts.");
  }

  const networkName = hre.network.name;
  const [deployer] = await ethers.getSigners();
  
  // v6 ethers uses address or getAddress()
  const deployerAddress = await deployer.getAddress();
  const provider = deployer.provider;
  const { chainId } = await provider.getNetwork();

  console.log(`\n🚀 Deploying on: ${networkName} (chainId: ${chainId})`);
  console.log(`📍 Deployer: ${deployerAddress}`);

  const balance = await provider.getBalance(deployerAddress);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} MATIC\n`);

  if (balance.toString() === '0') {
    console.error('❌ No balance. Get test MATIC from: https://faucet.polygon.technology/');
    process.exit(1);
  }

  const Factory = await ethers.getContractFactory('RealEstatePropertyToken');
  const deployed: Record<string, string> = {};

  for (const prop of PROPERTIES_TO_DEPLOY) {
    console.log(`\n📦 Deploying: ${prop.name} (${prop.symbol})`);
    
    // Convert INR to "MATIC" - 1 MATIC = 100,000 INR for simulation
    const priceInMaticStr = (prop.pricePerSqftINR / 100000).toFixed(8);
    const priceWei = ethers.parseUnits(priceInMaticStr, 18);
    
    console.log(`   SQFT: ${prop.totalSqft.toLocaleString()} | Price: ₹${prop.pricePerSqftINR.toLocaleString()} (${priceInMaticStr} MATIC)`);

    const contract = await Factory.deploy(prop.name, prop.symbol, prop.totalSqft, priceWei);
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    deployed[prop.symbol] = address;

    const explorerBase = networkName === 'polygon'
      ? 'https://polygonscan.com'
      : 'https://amoy.polygonscan.com';

    console.log(`   ✅ Address: ${address}`);
    console.log(`   🔗 ${explorerBase}/address/${address}`);
  }

  console.log('\n\n══════════════════════════════════════════════════════');
  console.log('✨ DEPLOYMENT COMPLETE — copy these contract addresses');
  console.log('══════════════════════════════════════════════════════\n');
  console.log(JSON.stringify(deployed, null, 2));
}

main().catch((err) => {
  console.error('\n❌ Deployment failed:', err);
  process.exit(1);
});
