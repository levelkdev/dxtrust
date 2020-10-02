const { tokens } = require("hardlydifficult-eth");

const BigNumber = require("bignumber.js");
const deployDat = require("../../scripts/deployDAT");

const { constants, getGasCost } = require("../helpers");
const { reverts } = require("truffle-assertions");

contract("dat / pay", (accounts) => {
  let contracts;
  const buyer = accounts[2];
  const investor = accounts[3];
  const payAmount = "42000000000000000000";

  beforeEach(async () => {
    contracts = await deployDat(web3, {});

    await contracts.dat.methods.buy(buyer, "100000000000000000000", 1).send({
      value: "100000000000000000000",
      from: buyer,
      gas: 9000000
    });
  });

  it("Sanity check: state is run", async () => {
    const state = await contracts.dat.methods.state().call();
    assert.equal(state.toString(), constants.STATE.RUN);
  });

  describe("on pay", () => {
    let investorBalanceBefore;

    beforeEach(async () => {
      investorBalanceBefore = new BigNumber(
        await contracts.dat.methods.balanceOf(investor).call()
      );
      await contracts.dat.methods.pay(constants.ZERO_ADDRESS, payAmount).send({
        from: investor,
        value: payAmount,
      });
    });

    it("The investor balance did not change", async () => {
      const balance = new BigNumber(await contracts.dat.methods.balanceOf(investor).call());
      assert.equal(balance.toFixed(), investorBalanceBefore.toFixed());
    });
  });

  it("can make a tiny payment", async () => {
    await contracts.dat.methods.pay(investor, "1").send({
      from: investor,
      value: "1",
    });
  });

  it("shouldFail if currencyValue is missing", async () => {
    // Redeploy with an erc-20
    const token = await tokens.sai.deploy(web3, accounts[0]);
    await token.mint(accounts[0], constants.MAX_UINT, { from: accounts[0] });
    const contracts = await deployDat(
      web3,
      {
        initGoal: "0", // Start in the run state
        currency: token.address,
      },
      false
    );
    await token.approve(contracts.dat.address, constants.MAX_UINT, {
      from: investor,
    });
    await reverts(
      contracts.dat.methods.pay(investor, "0").send({
        from: investor,
        gas: 9000000
      }),
      "MISSING_CURRENCY"
    );
  });

});
