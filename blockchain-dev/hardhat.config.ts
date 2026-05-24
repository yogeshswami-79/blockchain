import 'dotenv/config';
import toolbox from '@nomicfoundation/hardhat-toolbox-mocha-ethers';
import type { HardhatUserConfig } from 'hardhat/config';

const PRIVATE_KEY     = process.env.PRIVATE_KEY;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL   || '';
const ETHERSCAN_KEY   = process.env.ETHERSCAN_API_KEY || '';

const config: HardhatUserConfig = {
  plugins: [toolbox],

  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    hardhat: {
      type:    'edr-simulated',
      chainId: 31337,
    },
    localhost: {
      type: 'http',
      url:  'http://127.0.0.1:8545',
    },
    ...(PRIVATE_KEY && SEPOLIA_RPC_URL
      ? {
          sepolia: {
            type:     'http' as const,
            url:      SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId:  11155111,
          },
        }
      : {}),
  },

  verify: {
    etherscan: {
      apiKey: ETHERSCAN_KEY,
    },
  },
};

export default config;
