const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

module.exports = async function deployDat(web3, options, useProxy = true) {
  
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
      currency: web3.utils.padLeft(0, 40),
      initGoal: '0',
      buySlopeNum: '1',
      buySlopeDen: '100000000000000000000',
      investmentReserveBasisPoints: '1000',
      revenueCommitmentBasisPoints: '1000',
      control: accounts[1],
      beneficiary: accounts[2],
      feeCollector: accounts[3],
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
  let promises = [];
  
  // Execute updateConfig method to set only the minInvestment variable.
  promises.push(
    await contracts.dat.methods.updateConfig(
      await contracts.dat.methods.whitelist().call(),
      await contracts.dat.methods.beneficiary().call(),
      await contracts.dat.methods.control().call(),
      await contracts.dat.methods.feeCollector().call(),
      await contracts.dat.methods.feeBasisPoints().call(),
      await contracts.dat.methods.autoBurn().call(),
      await contracts.dat.methods.revenueCommitmentBasisPoints().call(),
      options.minInvestment,
      await contracts.dat.methods.openUntilAtLeast().call()
    ).send({ from: callOptions.control })
  );
  
  await Promise.all(promises);

  contracts.multicall = await Multicall.new();

  console.log('DAT control accounts:', accounts[1]);
  console.log('DAT beneficiary accounts:', accounts[2]);
  console.log('DAT feeCollector accounts:', accounts[3], ' \n');
  console.log('Recommended testing accounts:', accounts[4]);
  console.log('Get your provate keys in https://iancoleman.io/bip39/ \n');
  return contracts;
};
