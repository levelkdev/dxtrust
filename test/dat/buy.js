/**
 * Tests the ability to buy dat tokens
 */

const deployDat = require("../../scripts/deployDAT");
const { reverts } = require("truffle-assertions");

contract("dat / buy", (accounts) => {
  let contracts;
  const buyer = accounts[4];

  before(async () => {
    contracts = await deployDat(web3);
  });

  it("balanceOf should be 0 by default", async () => {
    const balance = await contracts.dat.methods.balanceOf(buyer).call();
    assert.equal(balance, 0);
  });

  it("shouldFail with INCORRECT_MSG_VALUE", async () => {
    await reverts(
      contracts.dat.methods.buy(buyer, "100000000000000000001", 1).send({
        value: "100000000000000000000",
        from: buyer
      }),
      "INCORRECT_MSG_VALUE"
    );
  });

  describe("can buy tokens", () => {
    before(async () => {
      await contracts.dat.methods.buy(buyer, "100000000000000000000", "1").send({
        value: "100000000000000000000",
        from: buyer,
        gas: 9000000
      });
    });

    it("balanceOf should have increased", async () => {
      const balance = await contracts.dat.methods.balanceOf(buyer).call();
      assert.equal(balance.toString(), "141421356237309504880");
    });
  });
});
