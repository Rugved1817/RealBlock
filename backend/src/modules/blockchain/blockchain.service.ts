import { ethers } from 'ethers';
import abiData from '../../../artifacts/contracts/RealEstatePropertyToken.sol/RealEstatePropertyToken.json' with { type: 'json' };

const ABI = abiData.abi;

export class BlockchainService {
    private provider: ethers.providers.JsonRpcProvider;
    private wallet: ethers.Wallet;

    constructor() {
        // Use a local Hardhat node or a testnet RPC
        const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
        const privateKey = process.env.PRIVATE_KEY;

        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);

        if (privateKey) {
            this.wallet = new ethers.Wallet(privateKey, this.provider);
        } else {
            console.warn('PRIVATE_KEY not found in environment. Blockchain operations will fail.');
            // For development, we might use a fallback if needed, but better to be explicit
            this.wallet = ethers.Wallet.createRandom().connect(this.provider);
        }
    }

    /**
     * Deploys a new property token contract.
     */
    async deployPropertyToken(name: string, symbol: string, totalSqft: number, pricePerSqftWei: string) {
        const factory = new ethers.ContractFactory(ABI, abiData.bytecode, this.wallet);
        const contract = await factory.deploy(name, symbol, totalSqft, pricePerSqftWei);
        await contract.deployed();
        return contract.address;
    }

    /**
     * Gets a contract instance for a specific property.
     */
    getContract(address: string) {
        return new ethers.Contract(address, ABI, this.wallet);
    }

    /**
     * Synchronizes a purchase on-chain if the user pays via the platform (simulated buy).
     * In a real DApp, the user would call buyTokens() directly from their wallet (MetaMask).
     * This method is for when the platform executes the buy on behalf of the user or for syncing.
     */
    async purchaseOnChain(contractAddress: string, userAddress: string, amount: number, valueWei: string) {
        const contract = this.getContract(contractAddress);
        // Use buyTokensFor to reward the specific user address
        const tx = await contract.buyTokensFor(userAddress, amount, { value: valueWei });
        const receipt = await tx.wait();
        return receipt.transactionHash;
    }
}

export const blockchainService = new BlockchainService();
