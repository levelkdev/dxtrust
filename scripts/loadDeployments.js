const fs = require('fs');
const Web3 = require('web3');
const BN = require('bignumber.js');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const HDWalletProvider = require('truffle-hdwallet-provider')
const args = process.argv;
require('dotenv').config();
const zeroAddress = '0x0000000000000000000000000000000000000000';
const infuraApiKey = process.env.REACT_APP_KEY_INFURA_API_KEY;

let httpProviderUrl, web3;

async function loadDeployment(network) {
  console.log('Loading deploy from network', network)
  const proxies = JSON.parse(fs.readFileSync('.openzeppelin/'+network+'.json', 'utf-8')).proxies;

  httpProviderUrl = `https://${network}.infura.io/v3/${infuraApiKey }`
  web3 = new Web3(new Web3.providers.HttpProvider(httpProviderUrl))
  ZWeb3.initialize(web3.currentProvider);
  Contracts.setLocalBuildDir('contracts/build/');
  const DATContract = Contracts.getFromLocal('DecentralizedAutonomousTrust');

  let contractsDeployed = {'contracts': {}};
  if (fs.existsSync('src/config/contracts.json'))
    contractsDeployed = JSON.parse(fs.readFileSync('src/config/contracts.json', 'utf-8'));

  const datContract = DATContract.at(proxies['BC-DAPP/DecentralizedAutonomousTrust'][0].address);

  contractsDeployed.contracts[network] = {
    multicall: proxies['BC-DAPP/Multicall'][0].address,
    DAT: proxies['BC-DAPP/DecentralizedAutonomousTrust'][0].address,
    implementationAddress: proxies['BC-DAPP/DecentralizedAutonomousTrust'][0].implementation,
    collateral: zeroAddress,
    DATinfo: {
      "collateralType": "ETH",
      "name": await datContract.methods.name().call(),
      "symbol": await datContract.methods.symbol().call(),
      "currency": zeroAddress,
      "initReserve": await datContract.methods.initReserve().call(),
      "initGoal": await datContract.methods.initGoal().call(),
      "buySlopeNum": await datContract.methods.buySlopeNum().call(),
      "buySlopeDen": await datContract.methods.buySlopeNum().call(),
      "investmentReserveBasisPoints": await datContract.methods.investmentReserveBasisPoints().call(),
      "revenueCommitmentBasisPoints": await datContract.methods.revenueCommitmentBasisPoints().call(),
      "minInvestment": await datContract.methods.minInvestment().call()
    },
  };

  fs.writeFileSync('src/config/contracts.json', JSON.stringify(contractsDeployed, null, 2), {encoding:'utf8',flag:'w'})
  console.log('Deployment configuration loaded for network '+network);
} 

async function main() {
  await loadDeployment(process.env.REACT_APP_ETH_NETWORK);
};

main();
