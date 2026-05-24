require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

// Safely read env vars — fallback to empty string so config loads without them
const PRIVATE_KEY      = process.env.PRIVATE_KEY      || '0x' + '0'.repeat(64);
const SEPOLIA_RPC_URL  = process.env.SEPOLIA_RPC_URL  || '';
const ETHERSCAN_KEY    = process.env.ETHERSCAN_API_KEY || '';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,     // optimise for 200 calls — good default
      },
    },
  },

  networks: {
    // Local Hardhat node — instant mining, 20 pre-funded accounts
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    // Sepolia testnet
    sepolia: {
      url:      SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId:  11155111,
    },
  },

  // Etherscan contract verification
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },

  // Gas reporter — shows gas cost per function after tests
  gasReporter: {
    enabled:  true,
    currency: 'USD',
  },
};