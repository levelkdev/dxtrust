const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const zeroAddress = '0x0000000000000000000000000000000000000000';

module.exports = async function deployDat(contracts, web3, options) {
  
  ZWeb3.initialize(web3.currentProvider);
  Contracts.setLocalBuildDir('contracts/build/');
  const accounts = await web3.eth.getAccounts();

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

  //console.log(`Update DAT: ${JSON.stringify(callOptions, null, 2)}`);
  const result = await datContract.methods.updateConfig(
    zeroAddress,
    callOptions.beneficiary,
    callOptions.control,
    callOptions.feeCollector,
    callOptions.feeBasisPoints,
    callOptions.autoBurn,
    callOptions.revenueCommitmentBasisPoints,
    callOptions.minInvestment,
    callOptions.openUntilAtLeast
  ).send(
    { from: await contracts.dat.methods.control().call() }
  );
  return result;
};
