const deployDAT = require('./deployDAT');
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
if (network != 'develop') {
  infuraApiKey = process.env.REACT_APP_KEY_INFURA_API_KEY;
  httpProviderUrl = `https://${network}.infura.io/v3/${infuraApiKey }`
} 

console.log('Running deploy on', httpProviderUrl)
const provider = new HDWalletProvider(mnemonic, new Web3.providers.HttpProvider(httpProviderUrl), 0, 10);
web3 = new Web3(provider)

ZWeb3.initialize(web3.currentProvider);

// Get configuration file
let contractsDeployed = {'contracts': {}};
if (fs.existsSync('src/config/contracts.json'))
  contractsDeployed = JSON.parse(fs.readFileSync('src/config/contracts.json', 'utf-8'));
const toDeploy = JSON.parse(fs.readFileSync('src/config/toDeploy.json', 'utf-8'));

async function main() {
  const contracts = await deployDAT(web3, toDeploy.DATinfo);
  
  contractsDeployed.contracts[network] = {
    multicall: contracts.multicall.address,
    DAT: contracts.dat.address,
    collateral: zeroAddress,
    DATinfo: toDeploy.DATinfo,
    implementationAddress: contracts.dat.implementation,
  };
  
  console.log('File contracts.json in src/config updated for network '+network);
  fs.writeFileSync('src/config/contracts.json', JSON.stringify(contractsDeployed, null, 2), {encoding:'utf8',flag:'w'})
  console.log('===============================================');
} 

Promise.all([main()]).then(process.exit);
