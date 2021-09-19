const { deployDAT } = require("../../scripts/DAT");

const { constants } = require("../helpers");
const { reverts } = require("truffle-assertions");


contract("dat / upgrade", ([_, controller, buyer, investor]) => {
  let contracts;

  it.only("should upgrade to ERC20Recoverable", async () => {
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
    
    console.log('Contract upgrade tx:',
      await contracts.proxyAdmin.methods
        .upgrade(contracts.datProxy.address, contracts.datOnlyERC20.address)
        .send({ from: controller })
    );
    assert.equal(
      await contracts.proxyAdmin.methods.getProxyImplementation(contracts.datProxy.address).call(),
      contracts.datOnlyERC20.address
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
      contracts.dat.methods.sell(buyer, "666666666666", 1)
        .send({ from: buyer, gas: 9000000 }),
      "DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now"
    );
    
    await reverts(
      contracts.dat.methods.pay(constants.ZERO_ADDRESS, "666").send({
        from: investor,
        value: "666",
      }),
      "DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now"
    );
    
  });

});
