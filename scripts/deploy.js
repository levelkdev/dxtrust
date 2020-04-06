const deployDat = require("./deployDAT");
const fs = require("fs");
const Web3 = require("web3");
const BN = require("bignumber.js");
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const HDWalletProvider = require('truffle-hdwallet-provider')
const args = process.argv;
require('dotenv').config();
const zeroAddress = '0x0000000000000000000000000000000000000000';

// Get network to use from arguments
let network, mnemonic, httpProviderUrl, web3;
for (var i = 0; i < args.length; i++) {
  if (args[i] == "--network")
    network = args[i+1];
}
if (!network) throw('Not network selected, --network parameter missing');

mnemonic = process.env.BCAPP_KEY_MNEMONIC;
httpProviderUrl = 'http://localhost:8545';
console.log(mnemonic, network)
// Get development keys
if (network != 'develop') {
  infuraApiKey = process.env.BCAPP_KEY_INFURA_API_KEY;
  httpProviderUrl = `https://${network}.infura.io/v3/${infuraApiKey }`
} 

console.log('Running deploy on', httpProviderUrl)
const provider = new HDWalletProvider(mnemonic, new Web3.providers.HttpProvider(httpProviderUrl), 0, 10);
web3 = new Web3(provider)

ZWeb3.initialize(web3.currentProvider);

// Get configuration file
const config = JSON.parse(fs.readFileSync("config/app.json", "utf-8"));
const addresses = config.addresses || {};

async function deployOrgs() {
  const accounts = await web3.eth.getAccounts();
  console.log('Accounts:',accounts);
  const DATInfo = config.DATinfo;
  let collateralToken = zeroAddress;

  const contracts = await deployDat( web3, DATInfo);
  
  const blockchainInfo = {
    network: network,
    DAT: contracts.dat.address,
    collateral: zeroAddress,
    DATinfo: config.DATinfo
  };
  console.log('New blockchainInfo.json file', blockchainInfo);
  fs.writeFileSync('src/blockchainInfo.json', JSON.stringify(blockchainInfo, null, 2), {encoding:'utf8',flag:'w'})

  return;
} 

return deployOrgs();
