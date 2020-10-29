const KOVAN_CONTRACTS = require('./kovan.json');
const RINKEBY_CONTRACTS = require('./rinkeby.json');
const MAINNET_CONTRACTS = require('./mainnet.json');
const DEVELOPMENT_CONFIG = require('../developmentConfig.json');

export const getConfig = function(network) {
  if (network === 'development') {
    return {
      multicall: process.env.REACT_APP_MULTICALL_ADDRESS.replace(/["']/g, ""),
      DAT: process.env.REACT_APP_DAT_ADDRESS.replace(/["']/g, ""),
      implementationAddress: process.env.REACT_APP_DAT_IMPLEMENTATION_ADDRESS.replace(/["']/g, ""),
      DATinfo: DEVELOPMENT_CONFIG
    }
  } else if (network === 'mainnet') {
    return MAINNET_CONTRACTS;
  } else if (network === 'kovan') {
    return KOVAN_CONTRACTS;
  } else if (network === 'rinkeby') {
    return RINKEBY_CONTRACTS;
  } else {
    return {};
  }
}
