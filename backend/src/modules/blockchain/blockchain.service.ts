import { ethers } from 'ethers';
import abiData from '../../../artifacts/contracts/RealEstatePropertyToken.sol/RealEstatePropertyToken.json' with { type: 'json' };

const ABI = abiData.abi;

export class BlockchainService {
    private provider: ethers.providers.StaticJsonRpcProvider | null = null;
    private wallet: ethers.Wallet | null = null;
    private _initialized = false;

    /**
     * Lazy-initialize the provider only when actually needed for a blockchain call.
     * This prevents the 10-second timeout on module load when Hardhat isn't running.
     */
    private getProvider(): ethers.providers.StaticJsonRpcProvider {
        if (!this.provider) {
            const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
            // StaticJsonRpcProvider skips the auto-detection eth_chainId call on init
            this.provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl);
        }
        return this.provider;
    }

    private getWallet(): ethers.Wallet {
        if (!this.wallet) {
            const privateKey = process.env.PRIVATE_KEY;
            if (!privateKey) {
                throw new Error('PRIVATE_KEY not set in environment. Blockchain operations cannot proceed.');
            }
            this.wallet = new ethers.Wallet(privateKey, this.getProvider());
        }
        return this.wallet;
    }

    /**
     * Deploys a new property token contract.
     */
    async deployPropertyToken(name: string, symbol: string, totalSqft: number, pricePerSqftWei: string) {
        const factory = new ethers.ContractFactory(ABI, abiData.bytecode, this.getWallet());
        const contract = await factory.deploy(name, symbol, totalSqft, pricePerSqftWei);
        await contract.deployed();
        return contract.address;
    }

    /**
     * Gets a contract instance for a specific property.
     */
    getContract(address: string) {
        return new ethers.Contract(address, ABI, this.getWallet());
    }

    /**
     * Synchronizes a purchase on-chain on behalf of the user (custodial model).
     * Called asynchronously in the background — never blocks the API response.
     */
    async purchaseOnChain(contractAddress: string, userAddress: string, amount: number, valueWei: string) {
        const contract = this.getContract(contractAddress);
        const tx = await contract.buyTokensFor(userAddress, amount, { value: valueWei });
        const receipt = await tx.wait();
        return receipt.transactionHash;
    }
}

export const blockchainService = new BlockchainService();
