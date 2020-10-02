const deployDat = require("../../scripts/deployDAT");

const { reverts } = require("truffle-assertions");
const { constants } = require("hardlydifficult-eth");

contract("initializers", (accounts) => {
  let contracts;

  before(async () => {
    contracts = await deployDat(web3);
  });

  it("There are 2 public initializers", async () => {
    const count = contracts.dat.schema.abi.filter(
      (x) => (x.name || "").toLowerCase() === "initialize"
    ).length;
    assert.equal(count, 2);
  });

  it("initialize may not be called again", async () => {
    await reverts(
      contracts.dat.methods.initialize(
        1,
        constants.ZERO_ADDRESS,
        1,
        1,
        1,
        1,
        "test",
        "test"
      ).send(),
      "ALREADY_INITIALIZED"
    );
  });

  it("initialize(string, string, uint) may not be called", async () => {
    await reverts(
      contracts.dat.methods.initialize("test", "test", 1).send(),
      "Contract instance has already been initialized"
    );
  });
});
