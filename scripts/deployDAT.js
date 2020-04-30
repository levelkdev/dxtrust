const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const zeroAddress = '0x0000000000000000000000000000000000000000';
const updateDATConfig = require('./updateDATConfig');
const fs = require('fs');

async function getOzDevelopJSON() {
  const ozFiles = await fs.readdirSync('.openzeppelin');
  let ozJSON;
  ozFiles.forEach(function (file) {
      if (file.indexOf('dev-') >= 0)
        ozJSON = JSON.parse(fs.readFileSync('.openzeppelin/'+file, 'utf-8'));
  });
  return ozJSON;
}

async function saveOzDevelopProxies(proxies) {
  const ozFiles = await fs.readdirSync('.openzeppelin');
  ozFiles.forEach(function (file) {
      if (file.indexOf('dev-') >= 0){
        const ozJSON = JSON.parse(fs.readFileSync('.openzeppelin/'+file, 'utf-8'));
        ozJSON.proxies = proxies;
        fs.writeFileSync('.openzeppelin/'+file, JSON.stringify(ozJSON), null, 2)
      }
  });
}


module.exports = async function deployDat(web3, options, useProxy = true, saveOzProxies = true) {
  
  ZWeb3.initialize(web3.currentProvider);
  Contracts.setLocalBuildDir('contracts/build/');
  const accounts = await web3.eth.getAccounts();

  const DATContract = Contracts.getFromLocal('DecentralizedAutonomousTrust');
  const ProxyContract = Contracts.getFromLocal('AdminUpgradeabilityProxy');
  const ProxyAdminContract = Contracts.getFromLocal('ProxyAdmin');
  const Multicall = Contracts.getFromLocal('Multicall');

  const contracts = {};
  const callOptions = Object.assign(
    {
      initReserve: '42000000000000000000',
      currency: zeroAddress,
      initGoal: '0',
      buySlopeNum: '1',
      buySlopeDen: '100000000000000000000',
      investmentReserveBasisPoints: '1000',
      revenueCommitmentBasisPoints: '1000',
      control: accounts[1],
      minInvestment: 100000000000000,
      name: 'Test org',
      symbol: 'TFO'
    },
    options
  );
  console.log(`Deploy DAT with config: ${JSON.stringify(callOptions, null, 2)}`, ' \n');
    
  contracts.proxyAdmin = await ProxyAdminContract.new({
    from: callOptions.control
  });
  console.log(`ProxyAdmin deployed ${contracts.proxyAdmin.address}`);

  const datContract = await DATContract.new({
    from: callOptions.control
  });
  console.log(`DAT template deployed ${datContract.address}`);

  const datProxy = await ProxyContract.new(
    datContract.address, // logic
    contracts.proxyAdmin.address, // admin
    [], // data
    {
      from: callOptions.control
    }
  );
  console.log(`DAT proxy deployed ${datProxy.address}`);

  contracts.dat = await DATContract.at(datProxy.address);
  contracts.dat.implementation = datContract.address;
  
  await contracts.dat.methods.initialize(
    callOptions.initReserve,
    callOptions.currency,
    callOptions.initGoal,
    callOptions.buySlopeNum,
    callOptions.buySlopeDen,
    callOptions.investmentReserveBasisPoints,
    callOptions.name,
    callOptions.symbol
  ).send({ from: callOptions.control });
  
  await updateDATConfig(contracts, web3, callOptions);

  contracts.multicall = await Multicall.new();
  
  if (saveOzProxies) {
    const ozDevelopJSON = await getOzDevelopJSON();
    const proxies = { 
      'BC-DAPP/DecentralizedAutonomousTrust': [ 
        { 
          address: contracts.dat.address,
          version: ozDevelopJSON.version,
          implementation: contracts.dat.implementation,
          admin: contracts.proxyAdmin.address,
          kind: 'Upgradeable'
        }
      ],
      'BC-DAPP/Multicall': [
        {
          address: contracts.dat.address,
          kind: 'NonProxy',
          bytecodeHash: ozDevelopJSON.contracts.Multicall.bytecodeHash
        }
      ] 
    };
    saveOzDevelopProxies(proxies);
  }
  
  console.log('DAT control accounts:', accounts[1]);
  console.log('DAT beneficiary accounts:', accounts[1]);
  console.log('DAT feeCollector accounts:', accounts[1], ' \n');
  console.log('Recommended testing accounts:', accounts[4]);
  console.log('Get your provate keys in https://iancoleman.io/bip39/ \n');
  
  return contracts;
};
