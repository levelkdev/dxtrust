const { deployDAT } = require("../../scripts/DAT");

const { tokens } = require("hardlydifficult-eth");
const { constants } = require("../helpers");
const { reverts } = require("truffle-assertions");

contract("dat / collectInvestment", (accounts) => {
  it("shouldFail with DO_NOT_SEND_ETH", async () => {
    const token = await tokens.sai.deploy(web3, accounts[0]);
    const contracts = await deployDAT(web3, { currency: token.address });
    await token.mint(accounts[1], constants.MAX_UINT, {
      from: accounts[0],
    });
    await token.approve(contracts.dat.address, constants.MAX_UINT, {
      from: accounts[1],
    });
    await reverts(
      contracts.dat.methods.buy(accounts[1], "100000000000000000000", 1).send({
        from: accounts[1],
        value: 1,
      }),
      "DO_NOT_SEND_ETH"
    );
  });
});
