const deployDat = require("../../scripts/deployDAT");

const { constants } = require("../helpers");
const { reverts } = require("truffle-assertions");
const BigNumber = require("bignumber.js");

contract("dat / initialize", (accounts) => {
  let contracts;

  it("shouldFail to init twice", async () => {
    contracts = await deployDat(web3);
    await reverts(
      contracts.dat.methods.initialize(
        await contracts.dat.methods.initReserve().call(),
        await contracts.dat.methods.currency().call(),
        await contracts.dat.methods.initGoal().call(),
        await contracts.dat.methods.buySlopeNum().call(),
        await contracts.dat.methods.buySlopeDen().call(),
        await contracts.dat.methods.investmentReserveBasisPoints().call(),
        await contracts.dat.methods.name().call(),
        await contracts.dat.methods.symbol().call()
      ).send(
        { from: await contracts.dat.methods.control().call() }
      ),
      "ALREADY_INITIALIZED"
    );
  });

  it("can deploy without any initReserve", async () => {
    await deployDat(web3, { initReserve: 0 }, true, false);
  });

  it("shouldFail with EXCESSIVE_GOAL", async () => {
    await reverts(
      deployDat(web3, { initGoal: constants.MAX_UINT }, true, false),
      "EXCESSIVE_GOAL"
    );
  });

  it("shouldFail with INVALID_SLOPE_NUM", async () => {
    await reverts(
      deployDat(web3, { buySlopeNum: "0" }, true, false),
      "INVALID_SLOPE_NUM"
    );
  });

  it("shouldFail with INVALID_SLOPE_DEN", async () => {
    await reverts(
      deployDat(web3, { buySlopeDen: "0" }, true, false),
      "INVALID_SLOPE_DEN"
    );
  });

  it("shouldFail with EXCESSIVE_SLOPE_NUM", async () => {
    await reverts(
      deployDat(web3, { buySlopeNum: constants.MAX_UINT }, true, false),
      "EXCESSIVE_SLOPE_NUM"
    );
  });

  it("shouldFail with EXCESSIVE_SLOPE_DEN", async () => {
    await reverts(
      deployDat(web3, { buySlopeDen: constants.MAX_UINT }, true, false),
      "EXCESSIVE_SLOPE_DEN"
    );
  });

  it("shouldFail with INVALID_RESERVE", async () => {
    await reverts(
      deployDat(
        web3,
        { investmentReserveBasisPoints: "100000" },
        true,
        false
      ),
      "INVALID_RESERVE"
    );
  });

});
