const deployDat = require("./deployDAT");
const fs = require("fs");
const Web3 = require("web3");
const BN = require("bignumber.js");
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const HDWalletProvider = require('truffle-hdwallet-provider')
const args = process.argv;
const zeroAddress = '0x0000000000000000000000000000000000000000';
const { tokens } = require("hardlydifficult-ethereum-contracts");

// Get network to use from arguments
let network = 'develop', mnemonic, httpProviderUrl, web3;
for (var i = 0; i < args.length; i++) {
  if (args[i] == "--network")
    network = args[i+1];
}
mnemonic = (fs.readFileSync('.mnemonic', 'utf8')).toString().replace(/(\r\n|\n|\r)/gm,"");
httpProviderUrl = 'http://localhost:8545';

// Get development keys
if (fs.existsSync('keys.json') && network != 'develop') {
  keys = JSON.parse(fs.readFileSync('keys.json', 'utf8'))
  httpProviderUrl = `https://${network}.infura.io/v3/${keys.infura_projectid }`
} else {
  console.log('no keys.json found. You can only deploy to the testrpc.')
}

const provider = new HDWalletProvider(mnemonic, new Web3.providers.HttpProvider(httpProviderUrl), 0, 10);
web3 = new Web3(provider)

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

// Get configuration file
const config = JSON.parse(fs.readFileSync("config/app.json", "utf-8"));
const addresses = config.addresses || {};

async function deployOrgs() {
  console.log(await web3.eth.getAccounts());
  const DATInfo = config.DATinfo;
  let collateralToken = zeroAddress;

  const contracts = await deployDat(
    web3,
    Object.assign(
      {
        whitelistAddress: addresses.whitelist,
        currency: (DATInfo.collateralType == "ETH") ? zeroAddress :collateralToken.address,
        minInvestment: new BN("100")
          .shiftedBy(18)
          .toFixed()
      },
      DATInfo
    )
  );    
  
  const blockchainInfo = {
    network: network,
    DAT: contracts.dat.address,
    collateral: zeroAddress,
    DATinfo: config.DATinfo
  };
  
  fs.writeFileSync('src/blockchainInfo.json', JSON.stringify(blockchainInfo, null, 2), {encoding:'utf8',flag:'w'})

  return;
} 

return deployOrgs();
