const deployDat = require("../../scripts/deployDAT");

const { constants } = require("../helpers");

contract("dat / noWhitelist", (accounts) => {
  let contracts;
  const buyer = accounts[2];
  const investor = accounts[7];

  before(async () => {
    contracts = await deployDat(web3, {
      initGoal: 0,
      whitelistAddress: constants.ZERO_ADDRESS,
    });
    await contracts.dat.methods.buy(buyer, "100000000000000000000", 1).send({
      value: "100000000000000000000",
      from: buyer,
      gas: 9000000
    });

    await contracts.dat.methods.pay(constants.ZERO_ADDRESS, "100000000000000000000").send({
      value: "100000000000000000000",
      from: investor,
      gas: 9000000
    });
  });

  it("DXD balanceOf should not have changed on pay", async () => {
    const balance = await contracts.dat.methods.balanceOf(investor).call();
    assert.equal(balance.toString(), "0");
  });
});
