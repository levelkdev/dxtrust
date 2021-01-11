const { deployDAT } = require("../../scripts/DAT");

const { tokens } = require("hardlydifficult-eth");
const BigNumber = require("bignumber.js");

contract("dat / defaultMinInvestment", (accounts) => {
  let contracts;

  describe("ETH", () => {
    beforeEach(async () => {
      contracts = await deployDAT(web3);
    });

    it("should default to 100 ETH min investment", async () => {
      const actual = await contracts.dat.methods.minInvestment().call();
      assert.equal(actual.toString(), web3.utils.toWei("0.0001", "ether"));
    });
  });

});
