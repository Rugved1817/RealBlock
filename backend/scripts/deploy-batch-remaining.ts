import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROPERTIES_TO_DEPLOY = [
  { name: "Lakeview Residency",       totalSqft: 18000, pricePerSqft: 52777 },
  { name: "North Logistics Hub",      totalSqft: 50000, pricePerSqft: 8400  },
  { name: "Azure Heights Phase 2",    totalSqft: 25000, pricePerSqft: 48000 },
  { name: "Westside Logistics Park",  totalSqft: 60000, pricePerSqft: 9166  },
  { name: "Metro City Plaza",         totalSqft: 30000, pricePerSqft: 50000 },
  { name: "Skyline Office Complex",   totalSqft: 12000, pricePerSqft: 54166 },
  { name: "Tech Hub II",              totalSqft: 22000, pricePerSqft: 50000 }
];

async function main() {
  const rpcUrl = "https://rpc-amoy.polygon.technology/";
  const privateKey = (process.env.DEPLOYER_PRIVATE_KEY || "").trim();
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const address = await wallet.getAddress();
  
  const balance = await provider.getBalance(address);
  console.log(`🚀 Starting Global Deployment | Wallet: ${address}`);
  console.log(`💰 Balance: ${ethers.utils.formatEther(balance)} MATIC\n`);

  const maxPriorityFeePerGas = ethers.utils.parseUnits("50", "gwei");
  const maxFeePerGas = ethers.utils.parseUnits("70", "gwei");

  const artifactPath = path.resolve(__dirname, '../artifacts/contracts/RealEstatePropertyToken.sol/RealEstatePropertyToken.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const Factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode || artifact.data?.bytecode?.object, wallet);

  const deployed: Record<string, string> = {};

  for (const prop of PROPERTIES_TO_DEPLOY) {
    console.log(`📦 Deploying: ${prop.name}...`);
    // Simulating ₹ (prop.pricePerSqft / 100,000) = MATIC
    const priceInMatic = (prop.pricePerSqft / 100000);
    const priceWei = ethers.utils.parseEther(priceInMatic.toFixed(8));
    const symbol = prop.name.split(" ").map(w => w[0]).join("").toUpperCase() + "-SQFT";

    try {
        const contract = await Factory.deploy(prop.name, symbol, prop.totalSqft, priceWei, {
            maxPriorityFeePerGas,
            maxFeePerGas,
            gasLimit: 3000000
        });
        
        console.log(`   ⏳ Transaction broadcasted: ${contract.deployTransaction.hash}`);
        await contract.deployed();
        deployed[prop.name] = contract.address;
        console.log(`   ✅ Success! Address: ${contract.address}\n`);
    } catch (err: any) {
        console.error(`   ❌ Failed: ${err.message}`);
    }
  }

  console.log("\n✨ BATCH DEPLOYMENT FINISHED ✨");
  console.log(JSON.stringify(deployed, null, 2));
}

main().catch(console.error);
