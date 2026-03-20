import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROPERTIES_TO_DEPLOY = [
  { name: 'Skyline Office Complex',  symbol: 'SKY-SQFT', totalSqft: 10000, pricePerSqftINR: 6500 },
];

async function main() {
  const rpcUrl = "https://rpc-amoy.polygon.technology/";
  const privateKey = (process.env.DEPLOYER_PRIVATE_KEY || "").trim();
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const address = await wallet.getAddress();
  
  const balance = await provider.getBalance(address);
  console.log(`🚀 Deployer: ${address} | Balance: ${ethers.utils.formatEther(balance)} MATIC`);

  // Force higher gas for Amoy
  const maxPriorityFeePerGas = ethers.utils.parseUnits("50", "gwei");
  const maxFeePerGas = ethers.utils.parseUnits("70", "gwei");

  const artifactPath = path.resolve(__dirname, '../artifacts/contracts/RealEstatePropertyToken.sol/RealEstatePropertyToken.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const Factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode || artifact.data?.bytecode?.object, wallet);

  for (const prop of PROPERTIES_TO_DEPLOY) {
    console.log(`\n📦 Deploying: ${prop.name} (${prop.symbol})`);
    const priceInMatic = (prop.pricePerSqftINR / 100000);
    const priceWei = ethers.utils.parseEther(priceInMatic.toFixed(8));
    
    try {
        const contract = await Factory.deploy(prop.name, prop.symbol, prop.totalSqft, priceWei, {
            maxPriorityFeePerGas,
            maxFeePerGas,
            gasLimit: 3000000 // Upped to 3M to ensure minting works
        });
        
        console.log(`   ⏳ Transaction: ${contract.deployTransaction.hash}`);
        await contract.deployed();
        console.log(`   ✅ Success at Address: ${contract.address}`);
    } catch (err: any) {
        console.error(`   ❌ Failed: ${err.message}`);
    }
  }
}

main().catch(console.error);
