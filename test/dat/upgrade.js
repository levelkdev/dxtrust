const { deployDAT } = require("../../scripts/DAT");

const { constants } = require("../helpers");
const { reverts } = require("truffle-assertions");

const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
ZWeb3.initialize(web3.currentProvider);
Contracts.setLocalBuildDir('contracts/build/');
const DecentralizedAutonomousTrustOnlyERC20 = Contracts.getFromLocal('DecentralizedAutonomousTrustOnlyERC20');
const ERC20Mintable = Contracts.getFromLocal('ERC20Mintable');


contract("dat / upgrade", ([_, controller, buyer, investor, other, beneficiary]) => {
  let contracts;

  it("should upgrade to DecentralizedAutonomousTrustOnlyERC20", async () => {
    contracts = await deployDAT(web3);
    
    await contracts.dat.methods.buy(buyer, "100000000000000000000", "1").send({
      value: "100000000000000000000",
      from: buyer,
      gas: 9000000
    });
    assert.equal(
      (await contracts.dat.methods.balanceOf(buyer).call()).toString(),
      "141421356237309504880"
    );
    
    await contracts.dat.methods.sell(buyer, "666666666666", 1)
      .send({ from: buyer, gas: 9000000 });
    assert.equal(
      (await contracts.dat.methods.balanceOf(buyer).call()).toString(),
      "141421355570642838214"
    );

    await contracts.dat.methods.pay(constants.ZERO_ADDRESS, "666").send({
      from: investor,
      value: "666",
    });
    
    const testToken = await ERC20Mintable.new({
      from: controller, gas: 9000000
    });
    await testToken.methods.initialize(controller).send({from: controller});
    await testToken.methods.mint(controller, "1000000").send({from: controller});
    await testToken.methods.transfer(contracts.datProxy.address, "1000000").send({from: controller});

    const datOnlyERC20Implementation = await DecentralizedAutonomousTrustOnlyERC20.new({
      from: controller, gas: 9000000
    });
    
    // Upgrade implementation
    await contracts.proxyAdmin.methods
      .upgrade(contracts.datProxy.address, datOnlyERC20Implementation.address)
      .send({ from: controller })
    
    assert.equal(
      await contracts.proxyAdmin.methods.getProxyImplementation(contracts.datProxy.address).call(),
      datOnlyERC20Implementation.address
    );
    
    // Check that DAT functions are not allowed anymore
    await reverts(
      contracts.dat.methods.estimateBuyValue("100000000000000000000").call({
        from: buyer,
        gas: 9000000
      }),
      "DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now"
    );
    await reverts(
      contracts.dat.methods.buy(buyer, "100000000000000000000", "1").send({
        value: "100000000000000000000",
        from: buyer,
        gas: 9000000
      }),
      "DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now"
    );
    
    await reverts(
      contracts.dat.methods.estimateSellValue("666666666666").call({
        from: buyer,
        gas: 9000000
      }),
      "DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now"
    );
    await reverts(
      contracts.dat.methods.sell(buyer, "666666666666", 1)
        .send({ from: buyer, gas: 9000000 }),
      "DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now"
    );
    
    await reverts(
      contracts.dat.methods.estimatePayValue("666").call({
        from: investor,
        gas: 9000000
      }),
      "DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now"
    );
    await reverts(
      contracts.dat.methods.pay(constants.ZERO_ADDRESS, "666").send({
        from: investor,
        value: "666",
      }),
      "DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now"
    );
    
    await reverts(
      contracts.dat.methods.estimateExitFee("1").call({
        from: controller,
        gas: 9000000
      }),
      "DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now"
    );
    
    // Recover ERC20 and ETH from DAT
    assert.equal( await testToken.methods.balanceOf(contracts.datProxy.address).call(), 1000000 );
    assert.equal( await web3.eth.getBalance(contracts.datProxy.address), 9999999927307628892 );
    assert.equal(
      await web3.eth.getBalance(beneficiary),
      100000090000000000000000600
    );
    
    const datOnlyERC20 = await DecentralizedAutonomousTrustOnlyERC20.at(contracts.datProxy.address);
    
    await datOnlyERC20.methods.recover(testToken.address).send();
    await datOnlyERC20.methods.recover(constants.ZERO_ADDRESS).send();
    
    assert.equal(await testToken.methods.balanceOf(contracts.datProxy.address).call(), 0);
    assert.equal(await web3.eth.getBalance(contracts.datProxy.address), 0);
    assert.equal(await testToken.methods.balanceOf(beneficiary).call(), 1000000);
    assert.equal(
      await web3.eth.getBalance(beneficiary),
      100000090000000000000000600 + 9999999927307628892
    );
    
  });

});
