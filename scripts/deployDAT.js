const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

module.exports = async function deployDat(web3, accounts, options, useProxy = true) {
  
  ZWeb3.initialize(web3.currentProvider);
  // workaround for https://github.com/zeppelinos/zos/issues/704
  Contracts.setArtifactsDefaults({
    gas: 60000000,
  });

  const DATContract = Contracts.getFromLocal("DecentralizedAutonomousTrust");
  const WhitelistContract = Contracts.getFromLocal("Whitelist");
  const ProxyContract = Contracts.getFromLocal("AdminUpgradeabilityProxy");
  const ProxyAdminContract = Contracts.getFromLocal("ProxyAdmin");
  const TokenVestingContract = Contracts.getFromLocal("TokenVesting");
  
  const contracts = {};
  const callOptions = Object.assign(
    {
      initReserve: "42000000000000000000",
      currency: web3.utils.padLeft(0, 40),
      initGoal: "0",
      buySlopeNum: "1",
      buySlopeDen: "100000000000000000000",
      investmentReserveBasisPoints: "1000",
      revenueCommitmentBasisPoints: "1000",
      control: accounts.length > 2 ? accounts[1] : accounts[0],
      beneficiary: accounts[0],
      feeCollector: accounts.length > 2 ? accounts[2] : accounts[0],
      name: "Test org",
      symbol: "TFO"
    },
    options
  );
  // console.log(`Deploy DAT: ${JSON.stringify(callOptions, null, 2)}`);

  if (useProxy) {
    // ProxyAdmin
    contracts.proxyAdmin = await ProxyAdminContract.new({
      from: callOptions.control
    });
    console.log(`ProxyAdmin deployed ${contracts.proxyAdmin.address}`);
  }

  // DAT
  const datContract = await DATContract.new({
    from: callOptions.control
  });
  console.log(`DAT template deployed ${datContract.address}`);

  if (useProxy) {
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
  } else {
    contracts.dat = datContract;
  }
  console.log(contracts.dat.methods)
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
  // Whitelist
  if (callOptions.whitelistAddress === undefined) {
    const whitelistContract = await WhitelistContract.new({
      from: callOptions.control
    });
    console.log(`Whitelist template deployed ${whitelistContract.address}`);

    if (useProxy) {
      const whitelistProxy = await ProxyContract.new(
        whitelistContract.address, // logic
        contracts.proxyAdmin.address, // admin
        [], // data
        {
          from: callOptions.control
        }
      );
      console.log(`Whitelist proxy deployed ${whitelistProxy.address}`);

      contracts.whitelist = await WhitelistContract.at(whitelistProxy.address);
    } else {
      contracts.whitelist = whitelistContract;
    }
    await contracts.whitelist.methods.initialize(contracts.dat.address)
      .send({ from: callOptions.control });
    await contracts.whitelist.methods.updateJurisdictionFlows(
      [1, 4, 4],
      [4, 1, 4],
      [1, 1, 1]
    ).send({ from: callOptions.control });
    callOptions.whitelistAddress = contracts.whitelist.address;
    // console.log(`Deployed whitelist: ${contracts.whitelist.address}`);

    promises.push(
      contracts.whitelist.methods.approveNewUsers([callOptions.control], [4])
      .send({ from: callOptions.control })
    );
    if (callOptions.control != callOptions.beneficiary) {
      promises.push(
        contracts.whitelist.methods.approveNewUsers([callOptions.beneficiary], [4])
        .send({ from: callOptions.control })
      );
    }
    if (
      callOptions.feeCollector != callOptions.control &&
      callOptions.feeCollector != callOptions.beneficiary
    ) {
      promises.push(
        contracts.whitelist.methods.approveNewUsers([callOptions.feeCollector], [4])
        .send({ from: callOptions.control })
      );
    }
    promises.push(
      contracts.whitelist.methods.approveNewUsers([web3.utils.padLeft(0, 40)], [1])
      .send({ from: callOptions.control })
    );
  }

  //console.log(`Update DAT: ${JSON.stringify(callOptions, null, 2)}`);
  promises.push(
    await contracts.dat.methods.updateConfig(
      await contracts.dat.methods.whitelist().call(),
      await contracts.dat.methods.beneficiary().call(),
      await contracts.dat.methods.control().call(),
      await contracts.dat.methods.feeCollector().call(),
      await contracts.dat.methods.feeBasisPoints().call(),
      await contracts.dat.methods.autoBurn().call(),
      await contracts.dat.methods.revenueCommitmentBasisPoints().call(),
      await contracts.dat.methods.minInvestment().call(),
      await contracts.dat.methods.openUntilAtLeast().call()
    ).send({ from: callOptions.control })
  );
  
  await Promise.all(promises);

  // Move the initReserve to vesting contracts
  if (callOptions.vesting) {
    contracts.vesting = [];
    for (let i = 0; i < callOptions.vesting.length; i++) {
      const vestingBeneficiary = callOptions.vesting[i].address;
      const contract = await TokenVestingContract.new(
        vestingBeneficiary, // beneficiary
        Math.round(Date.now() / 1000) + 100, // startDate is seconds
        120, // cliffDuration in seconds
        200, // duration in seconds
        false, // non-revocable
        {
          from: callOptions.control
        }
      );
      console.log(`Vesting contract deployed ${contract.address}`);

      contracts.vesting.push(contract);

      if (contracts.whitelist) {
        await contracts.whitelist.methods.approveNewUsers(
          [contracts.vesting[i].address],
          [4]
        ).send({ from: callOptions.control });
        await contracts.whitelist.addApprovedUserWallets(
          [callOptions.beneficiary],
          [contracts.vesting[i].address]
        ).send({ from: callOptions.control });
      }
      await contracts.dat.methods.transfer(
        contract.address,
        callOptions.vesting[i].value
      ).send({ from: callOptions.beneficiary });
    }
  }

  console.log(`===============================`);
  return contracts;
};
