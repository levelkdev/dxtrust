const BigNumber = require("bignumber.js");
const deployDat = require("./deployDAT");
const fs = require("fs");
const Web3 = require("web3");
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const HDWalletProvider = require('truffle-hdwallet-provider')
const args = process.argv;

let network,mnemonic, web3;
for (var i = 0; i < args.length; i++) {
  if (args[i] == "--network")
    network = args[i+1];
}

if (fs.existsSync('keys.json') && network) {
  keys = JSON.parse(fs.readFileSync('keys.json', 'utf8'))
  mnemonic = keys.mnemonic
  infuraProjectID = keys.infura_projectid  
  const httpProviderUrl = `https://${network}.infura.io/v3/${infuraProjectID}`
  const provider = new HDWalletProvider(mnemonic, new Web3.providers.HttpProvider(httpProviderUrl));
  web3 = new Web3(provider)
} else {
  console.log('no keys.json found. You can only deploy to the testrpc.')
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const { tokens } = require("hardlydifficult-ethereum-contracts");

const abiJson = {};
const bytecodeJson = {};

const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));
const addresses = config.addresses || {};

console.log(config);
async function deployOrgs() {
  
  const accounts = await web3.eth.getAccounts();
  const DATInfo = config.DAT;
  let currencyToken;
  let currencyDecimals = 18;
  
  if (addresses[DATInfo.currencyType]) {
    if (
      DATInfo.currencyType &&
      DATInfo.currencyType.toLowerCase().includes("dai")
    ) {
      currencyToken = tokens.sai.getToken(
        web3,
        addresses[DATInfo.currencyType]
      );
    } else if (
      DATInfo.currencyType &&
      DATInfo.currencyType.toLowerCase().includes("usdc")
    ) {
      currencyToken = tokens.usdc.getToken(
        web3,
        addresses[DATInfo.currencyType]
      );
    } else {
      throw new Error("Missing currency type");
    }
  } else {
    if (
      DATInfo.currencyType === "dai" ||
      DATInfo.currencyType === "testDAI"
    ) {
      console.log(accounts)
      currencyToken = await tokens.sai.deploy(web3, accounts[0]);
    } else if (
      DATInfo.currencyType === "usdc" ||
      DATInfo.currencyType === "testUSDC"
    ) {
      currencyToken = await tokens.usdc.deploy(
        web3,
        accounts[accounts.length - 1],
        accounts[0]
      );
    } else {
      throw new Error("Missing currency type");
    }

    console.log(
      `Deployed currency: ${
        currencyToken.address
      } (${await currencyToken.symbol()})`
    );
  }
  if (currencyToken) {
    currencyDecimals = parseInt(await currencyToken.decimals());
  }
  const contracts = await deployDat(
    web3,
    accounts,
    Object.assign(
      {
        whitelistAddress: addresses.whitelist,
        currency: currencyToken.address,
        minInvestment: new BigNumber("100")
          .shiftedBy(currencyDecimals)
          .toFixed()
      },
      DATInfo
    )
  );    
}

deployOrgs();
