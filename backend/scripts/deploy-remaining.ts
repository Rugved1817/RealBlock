import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROPERTIES_TO_DEPLOY = [
  { name: 'Meridian Tech Park',      symbol: 'MTP-SQFT', totalSqft: 8000,  pricePerSqftINR: 5800 },
  { name: 'Coastal Warehouse Hub',   symbol: 'CWH-SQFT', totalSqft: 15000, pricePerSqftINR: 3200 },
];

async function main() {
  const rpcUrl = "https://rpc-amoy.polygon.technology/";
  const privateKey = (process.env.DEPLOYER_PRIVATE_KEY || "").trim();
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const address = await wallet.getAddress();
  
  const balance = await provider.getBalance(address);
  console.log(`🚀 Deployer: ${address} | Balance: ${ethers.utils.formatEther(balance)} MATIC`);

  const maxPriorityFeePerGas = ethers.utils.parseUnits("50", "gwei");
  const maxFeePerGas = ethers.utils.parseUnits("70", "gwei");

  const artifactPath = path.resolve(__dirname, '../artifacts/contracts/RealEstatePropertyToken.sol/RealEstatePropertyToken.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const Factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode || artifact.data?.bytecode?.object, wallet);

  const deployed: Record<string, string> = {};

  for (const prop of PROPERTIES_TO_DEPLOY) {
    console.log(`\n📦 Deploying: ${prop.name} (${prop.symbol})`);
    const priceInMatic = (prop.pricePerSqftINR / 100000);
    const priceWei = ethers.utils.parseEther(priceInMatic.toFixed(8));
    
    try {
        const contract = await Factory.deploy(prop.name, prop.symbol, prop.totalSqft, priceWei, {
            maxPriorityFeePerGas,
            maxFeePerGas,
            gasLimit: 3000000
        });
        
        console.log(`   ⏳ Transaction: ${contract.deployTransaction.hash}`);
        await contract.deployed();
        deployed[prop.name] = contract.address;
        console.log(`   ✅ Success at Address: ${contract.address}`);
    } catch (err: any) {
        console.error(`   ❌ Failed: ${err.message}`);
    }
  }

  console.log("\nDeployment Results:", JSON.stringify(deployed, null, 2));
}

main().catch(console.error);
