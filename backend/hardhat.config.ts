import { defineConfig } from 'hardhat/config';
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
dotenv.config();

const rawKey = (process.env.DEPLOYER_PRIVATE_KEY || process.env.PRIVATE_KEY || '').trim().replace(/^0x/, '');
const PRIVATE_KEY: string | null = /^[0-9a-fA-F]{64}$/.test(rawKey) ? `0x${rawKey}` : null;
const POLYGON_RPC = (process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/').trim();

export default defineConfig({
  solidity: {
    profiles: {
      default: { version: '0.8.20' },
      production: {
        version: '0.8.20',
        settings: { optimizer: { enabled: true, runs: 200 } }
      }
    }
  },
  networks: {
    ...(PRIVATE_KEY ? {
      polygonAmoy: {
        type: 'http',
        chainType: 'l1',
        url: POLYGON_RPC,
        accounts: [PRIVATE_KEY],
        chainId: 80002,
      } as any,
      polygon: {
        type: 'http',
        chainType: 'l1',
        url: (process.env.POLYGON_MAINNET_RPC_URL || 'https://polygon-rpc.com/').trim(),
        accounts: [PRIVATE_KEY],
        chainId: 137,
      } as any,
    } : {}),
  },
});
