const { deployDAT } = require("../../scripts/DAT");

const { constants } = require("../helpers");
const { reverts } = require("truffle-assertions");

contract("dat / updateConfig", (accounts) => {
  let contracts;

  it("shouldFail with CONTROL_ONLY", async () => {
    contracts = await deployDAT(web3);
    await reverts(
      contracts.dat.methods.updateConfig(
        await contracts.dat.methods.whitelist().call(),
        await contracts.dat.methods.beneficiary().call(),
        await contracts.dat.methods.control().call(),
        await contracts.dat.methods.feeCollector().call(),
        await contracts.dat.methods.feeBasisPoints().call(),
        await contracts.dat.methods.autoBurn().call(),
        await contracts.dat.methods.revenueCommitmentBasisPoints().call(),
        await contracts.dat.methods.minInvestment().call(),
        await contracts.dat.methods.openUntilAtLeast().call(),
      ).send({ from: accounts[6] }),
      "CONTROL_ONLY"
    );
  });

  it("can remove the whitelist", async () => {
    contracts = await deployDAT(web3);
    await contracts.dat.methods.updateConfig(
      constants.ZERO_ADDRESS,
      await contracts.dat.methods.beneficiary().call(),
      await contracts.dat.methods.control().call(),
      await contracts.dat.methods.feeCollector().call(),
      await contracts.dat.methods.feeBasisPoints().call(),
      await contracts.dat.methods.autoBurn().call(),
      await contracts.dat.methods.revenueCommitmentBasisPoints().call(),
      await contracts.dat.methods.minInvestment().call(),
      await contracts.dat.methods.openUntilAtLeast().call(),
    ).send({ from: await contracts.dat.methods.control().call() });
  });

  it("shouldFail with INVALID_ADDRESS if control is missing", async () => {
    contracts = await deployDAT(web3);
    await reverts(
      contracts.dat.methods.updateConfig(
        await contracts.dat.methods.whitelist().call(),
        await contracts.dat.methods.beneficiary().call(),
        constants.ZERO_ADDRESS,
        await contracts.dat.methods.feeCollector().call(),
        await contracts.dat.methods.feeBasisPoints().call(),
        await contracts.dat.methods.autoBurn().call(),
        await contracts.dat.methods.revenueCommitmentBasisPoints().call(),
        await contracts.dat.methods.minInvestment().call(),
        await contracts.dat.methods.openUntilAtLeast().call(),
      ).send({ from: await contracts.dat.methods.control().call() }),
      "INVALID_ADDRESS"
    );
  });

  it("shouldFail with INVALID_ADDRESS if feeCollector is missing", async () => {
    contracts = await deployDAT(web3);
    await reverts(
      contracts.dat.methods.updateConfig(
        await contracts.dat.methods.whitelist().call(),
        await contracts.dat.methods.beneficiary().call(),
        await contracts.dat.methods.control().call(),
        constants.ZERO_ADDRESS,
        await contracts.dat.methods.feeBasisPoints().call(),
        await contracts.dat.methods.autoBurn().call(),
        await contracts.dat.methods.revenueCommitmentBasisPoints().call(),
        await contracts.dat.methods.minInvestment().call(),
        await contracts.dat.methods.openUntilAtLeast().call(),
      ).send({ from: await contracts.dat.methods.control().call() }),
      "INVALID_ADDRESS"
    );
  });

  it("shouldFail with INVALID_COMMITMENT", async () => {
    contracts = await deployDAT(web3, {
      revenueCommitmentBasisPoints: 0,
    });
    contracts.dat.methods.updateConfig(
      await contracts.dat.methods.whitelist().call(),
      await contracts.dat.methods.beneficiary().call(),
      await contracts.dat.methods.control().call(),
      await contracts.dat.methods.feeCollector().call(),
      await contracts.dat.methods.feeBasisPoints().call(),
      await contracts.dat.methods.autoBurn().call(),
      "11",
      await contracts.dat.methods.minInvestment().call(),
      await contracts.dat.methods.openUntilAtLeast().call(),
    ).send({ from: await contracts.dat.methods.control().call() });
    await reverts(
      contracts.dat.methods.updateConfig(
        await contracts.dat.methods.whitelist().call(),
        await contracts.dat.methods.beneficiary().call(),
        await contracts.dat.methods.control().call(),
        await contracts.dat.methods.feeCollector().call(),
        await contracts.dat.methods.feeBasisPoints().call(),
        await contracts.dat.methods.autoBurn().call(),
        "10",
        await contracts.dat.methods.minInvestment().call(),
        await contracts.dat.methods.openUntilAtLeast().call(),
      ).send({ from: await contracts.dat.methods.control().call() }),
      "COMMITMENT_MAY_NOT_BE_REDUCED"
    );
  });

  it("shouldFail with INVALID_COMMITMENT", async () => {
    contracts = await deployDAT(web3);
    await reverts(
      contracts.dat.methods.updateConfig(
        await contracts.dat.methods.whitelist().call(),
        await contracts.dat.methods.beneficiary().call(),
        await contracts.dat.methods.control().call(),
        await contracts.dat.methods.feeCollector().call(),
        await contracts.dat.methods.feeBasisPoints().call(),
        await contracts.dat.methods.autoBurn().call(),
        "100000",
        await contracts.dat.methods.minInvestment().call(),
        await contracts.dat.methods.openUntilAtLeast().call(),
      ).send({ from: await contracts.dat.methods.control().call() }),
      "INVALID_COMMITMENT"
    );
  });

  it("shouldFail with INVALID_FEE", async () => {
    contracts = await deployDAT(web3);
    await reverts(
      contracts.dat.methods.updateConfig(
        await contracts.dat.methods.whitelist().call(),
        await contracts.dat.methods.beneficiary().call(),
        await contracts.dat.methods.control().call(),
        await contracts.dat.methods.feeCollector().call(),
        "100000",
        await contracts.dat.methods.autoBurn().call(),
        await contracts.dat.methods.revenueCommitmentBasisPoints().call(),
        await contracts.dat.methods.minInvestment().call(),
        await contracts.dat.methods.openUntilAtLeast().call(),
      ).send({ from: await contracts.dat.methods.control().call() }),
      "INVALID_FEE"
    );
  });

  it("shouldFail with INVALID_MIN_INVESTMENT", async () => {
    contracts = await deployDAT(web3);
    await reverts(
      contracts.dat.methods.updateConfig(
        await contracts.dat.methods.whitelist().call(),
        await contracts.dat.methods.beneficiary().call(),
        await contracts.dat.methods.control().call(),
        await contracts.dat.methods.feeCollector().call(),
        await contracts.dat.methods.feeBasisPoints().call(),
        await contracts.dat.methods.autoBurn().call(),
        await contracts.dat.methods.revenueCommitmentBasisPoints().call(),
        "0",
        await contracts.dat.methods.openUntilAtLeast().call(),
      ).send({ from: await contracts.dat.methods.control().call() }),
      "INVALID_MIN_INVESTMENT"
    );
  });

  it("shouldFail with INVALID_ADDRESS when missing the beneficiary", async () => {
    contracts = await deployDAT(web3);
    await reverts(
      contracts.dat.methods.updateConfig(
        await contracts.dat.methods.whitelist().call(),
        constants.ZERO_ADDRESS,
        await contracts.dat.methods.control().call(),
        await contracts.dat.methods.feeCollector().call(),
        await contracts.dat.methods.feeBasisPoints().call(),
        await contracts.dat.methods.autoBurn().call(),
        await contracts.dat.methods.revenueCommitmentBasisPoints().call(),
        await contracts.dat.methods.minInvestment().call(),
        await contracts.dat.methods.openUntilAtLeast().call(),
      ).send({ from: await contracts.dat.methods.control().call() }),
      "INVALID_ADDRESS"
    );
  });

  it("shouldFail with OPEN_UNTIL_MAY_NOT_BE_REDUCED", async () => {
    contracts = await deployDAT(web3);
    await contracts.dat.methods.updateConfig(
      await contracts.dat.methods.whitelist().call(),
      await contracts.dat.methods.beneficiary().call(),
      await contracts.dat.methods.control().call(),
      await contracts.dat.methods.feeCollector().call(),
      await contracts.dat.methods.feeBasisPoints().call(),
      await contracts.dat.methods.autoBurn().call(),
      await contracts.dat.methods.revenueCommitmentBasisPoints().call(),
      await contracts.dat.methods.minInvestment().call(),
      "100",
    ).send({ from: await contracts.dat.methods.control().call() });
    await reverts(
      contracts.dat.methods.updateConfig(
        await contracts.dat.methods.whitelist().call(),
        await contracts.dat.methods.beneficiary().call(),
        await contracts.dat.methods.control().call(),
        await contracts.dat.methods.feeCollector().call(),
        await contracts.dat.methods.feeBasisPoints().call(),
        await contracts.dat.methods.autoBurn().call(),
        await contracts.dat.methods.revenueCommitmentBasisPoints().call(),
        await contracts.dat.methods.minInvestment().call(),
        "99",
      ).send({ from: await contracts.dat.methods.control().call() }),
      "OPEN_UNTIL_MAY_NOT_BE_REDUCED"
    );
  });
});
