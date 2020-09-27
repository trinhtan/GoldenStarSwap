require('dotenv').config();
const { TruffleProvider } = require('@harmony-js/core');

const testnet_mnemonic = process.env.HMY_OPERATOR_MNEMONIC;
const testnet_private_key = process.env.HMY_OPERATOR_PRIVATE_KEY;
const testnet_url = process.env.TESTNET_0_URL;

gasLimit = process.env.GAS_LIMIT;
gasPrice = process.env.GAS_PRICE;

module.exports = {
  networks: {
    testnet: {
      network_id: '2', // Any network (default: none)
      provider: () => {
        const truffleProvider = new TruffleProvider(
          testnet_url,
          { memonic: testnet_mnemonic },
          { shardID: 0, chainId: 2 },
          { gasLimit: gasLimit, gasPrice: gasPrice }
        );
        const newAcc = truffleProvider.addByPrivateKey(testnet_private_key);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      }
    },
    mainnet0: {
      network_id: '1',
      provider: () => {
        const truffleProvider = new TruffleProvider(
          mainnet_url,
          { memonic: mainnet_mnemonic },
          { shardID: 0, chainId: 1 },
          { gasLimit: gasLimit, gasPrice: gasPrice }
        );
        const newAcc = truffleProvider.addByPrivateKey(mainnet_private_key);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      }
    }
  },

  mocha: {},

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.5.8'
    }
  }
};
