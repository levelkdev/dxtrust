const BigNumber = require("bignumber.js");
const deployDat = require("../../scripts/deployDAT");


contract("dat / sellPremint", (accounts) => {
  const [beneficiary, buyer, other] = accounts;
  const initReserve = web3.utils.toWei("10000", "ether");
  let buyAmount;
  const sellAmount = web3.utils.toWei("500", "ether");
  let contracts;

  before(async () => {
    contracts = await deployDat(web3, { beneficiary, initReserve });
    await contracts.dat.methods.transfer(other, initReserve).send({ from: beneficiary, gas: 9000000 });

    const value = web3.utils.toWei("100", "ether");
    buyAmount = await contracts.dat.methods.estimateBuyValue(value).call();
    await contracts.dat.methods.buy(buyer, value, 1).send({ from: buyer, value, gas: 9000000 });
    await contracts.dat.methods.sell(other, sellAmount, 1).send({ from: other, gas: 9000000 });
  });

  it("initReserve has been reduced by sellAmount", async () => {
    const actual = await contracts.dat.methods.initReserve().call();
    const expected = new BigNumber(initReserve)
      .plus(buyAmount)
      .minus(sellAmount);
    assert.equal(actual.toString(), expected.toFixed());
  });
});
