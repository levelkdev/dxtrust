const { deployDAT } = require("../../scripts/DAT");

const { getDomainSeparator } = require("../helpers");

contract("dat / domainSeparator", (accounts) => {
  let contracts;

  beforeEach(async () => {
    contracts = await deployDAT(web3);
  });

  it("has the correct domain separator", async () => {
    const expected = await getDomainSeparator(
      await contracts.dat.methods.name().call(),
      await contracts.dat.methods.version().call(),
      await contracts.dat.address
    );
    const actual = await contracts.dat.methods.DOMAIN_SEPARATOR().call();
    assert.equal(actual, expected);
  });
});
