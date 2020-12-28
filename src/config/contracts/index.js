const KOVAN_CONTRACTS = require('./kovan.json');
const RINKEBY_CONTRACTS = require('./rinkeby.json');
const MAINNET_CONTRACTS = require('./mainnet.json');
const DEVELOPMENT_CONFIG = require('./development.json');

export const getConfig = function(network) {
  if (network === 'development') {
    return DEVELOPMENT_CONFIG;
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
