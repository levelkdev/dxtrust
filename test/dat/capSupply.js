const deployDat = require("../../scripts/deployDAT");

const { tokens } = require("hardlydifficult-eth");
const { constants } = require("../helpers");
const { reverts } = require("truffle-assertions");

contract("dat / capSupply", (accounts) => {
  let contracts;
  let token;
  const buyer = accounts[2];

  before(async () => {
    token = await tokens.sai.deploy(web3, accounts[0]);
    contracts = await deployDat(web3, { currency: token.address });
    await token.mint(buyer, constants.MAX_UINT, {
      from: accounts[0],
    });
    await token.approve(contracts.dat.address, constants.MAX_UINT, {
      from: buyer,
    });
    await contracts.dat.methods.buy(buyer, "30000000000000000000000000000000000000000000000000000000", 1).send({
      from: buyer,
      gas: 9000000
    });
  });

  it("supply is near cap", async () => {
    const reserve = await contracts.dat.methods.totalSupply().call();
    assert.equal(reserve.toString(), "77459666924148337745585307995647992216");
  });

  it("buying over cap shouldFail", async () => {
    await reverts(
      contracts.dat.methods.buy(buyer, "30000000000000000000000000000000000000000000000000000000", 1).send({
        from: buyer,
        gas: 9000000
      }),
      "EXCESSIVE_SUPPLY"
    );
  });
});
