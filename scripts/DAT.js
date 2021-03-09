const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const zeroAddress = '0x0000000000000000000000000000000000000000';
const fs = require('fs');

async function deployDAT(web3, options = {}, useProxy, network) {
  
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
      initReserve: web3.utils.toWei("42", "ether"),
      currency: zeroAddress,
      initGoal: '0',
      buySlopeNum: '1',
      buySlopeDen: '100000000000000000000',
      investmentReserveBasisPoints: '1000',
      revenueCommitmentBasisPoints: '1000',
      control: accounts[1],
      beneficiary: accounts[5],
      feeCollector: accounts[6],
      minInvestment: web3.utils.toWei("0.0001", "ether"),
      name: 'Test org',
      symbol: 'TFO'
    },
    options
  );
  if (options.log)
    console.log(`Deploy DAT with config: ${JSON.stringify(callOptions, null, 2)}`, ' \n');
    
  contracts.proxyAdmin = await ProxyAdminContract.new({
    from: callOptions.control, gas: 9000000
  });
  if (options.log)
    console.log(`ProxyAdmin deployed ${contracts.proxyAdmin.address}`);

  const datContract = await DATContract.new({
    from: callOptions.control, gas: 9000000
  });
  if (options.log)
    console.log(`DAT template deployed ${datContract.address}`);

  const datProxy = await ProxyContract.new(
    datContract.address, // logic
    contracts.proxyAdmin.address, // admin
    [], // data
    {
      from: callOptions.control, gas: 9000000
    }
  );
  if (options.log)
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
  ).send({ from: callOptions.control, gas: 9000000 });
  
  await updateDAT(contracts, web3, callOptions);

  contracts.multicall = await Multicall.new({ gas: 9000000});
  
  if (options.log){
    console.log('DAT control accounts:', accounts[1]);
    console.log('DAT beneficiary accounts:', accounts[5]);
    console.log('DAT feeCollector accounts:', accounts[6], ' \n');
    console.log('Recommended testing accounts:', accounts[4]);
    console.log('Get your provate keys in https://iancoleman.io/bip39/ \n');
  }
  
  return contracts;
};

async function updateDAT(contracts, web3, options) {
  
  const datContract = contracts.dat;

  const callOptions = Object.assign(
    {
      beneficiary: await datContract.methods.beneficiary().call(),
      control: await datContract.methods.control().call(),
      feeCollector: await datContract.methods.feeCollector().call(),
      feeBasisPoints: await datContract.methods.feeBasisPoints().call(),
      autoBurn: await datContract.methods.autoBurn().call(),
      revenueCommitmentBasisPoints: await datContract.methods.revenueCommitmentBasisPoints().call(),
      minInvestment: await datContract.methods.minInvestment().call(),
      openUntilAtLeast: await datContract.methods.openUntilAtLeast().call(),
    },
    options
  );

  return await datContract.methods.updateConfig(
    '0x0000000000000000000000000000000000000000',
    callOptions.beneficiary,
    callOptions.control,
    callOptions.feeCollector,
    callOptions.feeBasisPoints,
    callOptions.autoBurn,
    callOptions.revenueCommitmentBasisPoints,
    callOptions.minInvestment,
    callOptions.openUntilAtLeast
  ).send(
    { from: await contracts.dat.methods.control().call(), gas: 9000000 }
  );
};

module.exports = {deployDAT, updateDAT};
