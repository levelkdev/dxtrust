
const HDWalletProvider = require('truffle-hdwallet-provider')	
const fs = require('fs')	

mnemonic = provess.env.BCAPP_KEY_MNEMONIC;
infuraApiKey = provess.env.BCAPP_KEY_INFURA_API_KEY;

module.exports = {	
  networks: {	
    rpc: {	
      network_id: '*',	
      host: 'localhost',	
      port: 8545,	
      gas: 6.9e6,	
      gasPrice: 15000000001	
    },	
    devnet: {	
      network_id: '*',	
      host: 'localhost',	
      port: 8535,	
      gas: 6.9e6,	
      gasPrice: 15000000001	
    },	
    mainnet: {	
      provider: function () {	
        return new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${infuraApiKey}`)	
      },	
      network_id: '1',	
      gas: 9000000,	
      gasPrice: 10 * 10 ** 9,	
    },	
    rinkeby: {	
      provider: function () {	
        return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraApiKey}`)	
      },	
      network_id: '4',	
      gas: 6000000,	
      gasPrice: 1 * 10 ** 9,	
    },	
    ropsten: {	
      provider: function () {	
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraApiKey}`)	
      },	
      network_id: '3',	
      gas: 9000000,	
      gasPrice: 1 * 10 ** 9,	
    },	
    kovan: {	
      provider: function () {	
        return new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${infuraApiKey}`)	
      },	
      network_id: '42',	
      gas: 9000000,	
      gasPrice: 1 * 10 ** 9,	
    }	
  },	
  build: {},	
  compilers: {	
    solc: {	
      // version: '0.4.24' // Fetch exact version from solc-bin (default: truffle's version)	
    }	
  },	
  solc: {	
    optimizer: {	
      enabled: true,	
      runs: 10000	
    }	
  },	
}
