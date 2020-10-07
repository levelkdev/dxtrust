const { deployDAT } = require('./DAT');
const fs = require('fs');
const Web3 = require('web3');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const HDWalletProvider = require('truffle-hdwallet-provider')
const args = process.argv;
require('dotenv').config();
const zeroAddress = '0x0000000000000000000000000000000000000000';

// Get network to use from arguments
let network, mnemonic, httpProviderUrl, web3;
for (var i = 0; i < args.length; i++) {
  if (args[i] == '--network')
    network = args[i+1];
}
if (!network) throw('Not network selected, --network parameter missing');

mnemonic = process.env.REACT_APP_KEY_MNEMONIC;
httpProviderUrl = 'http://localhost:8545';

// Get development keys
if (network != 'development') {
  infuraApiKey = process.env.REACT_APP_KEY_INFURA_API_KEY;
  httpProviderUrl = `https://${network}.infura.io/v3/${infuraApiKey }`
} 

console.log('Running deploy on', httpProviderUrl)
const provider = new HDWalletProvider(mnemonic, new Web3.providers.HttpProvider(httpProviderUrl), 0, 10);
web3 = new Web3(provider)

ZWeb3.initialize(web3.currentProvider);

// Get deployment parameters
const developmentConfig = JSON.parse(fs.readFileSync('src/config/developmentConfig.json', 'utf-8'));

async function main() {
  const contracts = await deployDAT(web3, developmentConfig);
  developmentConfig.fromBlock = (await web3.eth.getBlock('latest')).number;
  const contractsDeployed = {
    multicall: contracts.multicall.address,
    DAT: contracts.dat.address,
    collateral: zeroAddress,
    implementationAddress: contracts.dat.implementation,
    DATinfo: developmentConfig,
  };
  
  console.log('File src/config/contracts/'+network+'.json in src/config updated for network '+network);
  fs.writeFileSync(
    'src/config/contracts/'+network+'.json',
    JSON.stringify(contractsDeployed, null, 2),
    {encoding:'utf8',flag:'w'}
  )
} 

Promise.all([main()]).then(process.exit);
