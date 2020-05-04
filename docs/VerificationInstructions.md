# Verification Instructions

## Smart Contracts

The contract used is a modified version of the implementation provided by Fairmint for a Decentralized Autonomous Trust as described in the continuous organization whitepaper (https://github.com/c-org/whitepaper) and specified here: https://github.com/fairmint/c-org/wiki.
Code from : https://github.com/Fairmint/c-org/blob/dfd3129f9bce8717406aba54d1f1888d8e253dbb/contracts/DecentralizedAutonomousTrust.sol
Changes Added: https://github.com/Fairmint/c-org/commit/60bb63b9112a82996f275a75a87c28b1d73e3f11

The implementation deployed to be used for mainnet is in the `.openzeppelin/mainnet.json` file.
The implementation deployed to be used for kovan is in the `.openzeppelin/kovan.json` file.

The implementation contracts are verified in etherscan.

## Application

To calculate the same ipfs hash used for the application deployed you will need: The git commit of the codebase to be used, the ENV variables that were used for build, and the `contracts.json` file used in `src/config.contracts.json`.
Once you have your ENV variables set and the contracts added in the `src/config` folder, you cna checkout to the specified commit by using `git co COMMIT_HASH`, then you should delete the `node_modules` and `build` folders, run `yarn` to have fresh dependencies installed and at last run `yarn run build` to generate a clean build.
Now with the build at your disposal you can calculate the hash of the folder by running `ipfs add -r -n build`.

For example with the git commit:
```
c6c172a608461f4dd6a6967b054ab1944128c6a0
```
And ONLY this ENV varibales enabled:
```
REACT_APP_KEY_INFURA_API_KEY=9237a024142a4be892c7b9a7c9bd3491
REACT_APP_ETH_NETWORKS=kovan
REACT_APP_GIT_SHA=c6c172a608461f4dd6a6967b054ab1944128c6a0
NODE_ENV=production
```
And a contracts.json file:
```
{
  "contracts": {
    "kovan": {
      "multicall": "0xc58930e7d81E97D3B82B324eF59e8AfF4bD723BB",
      "DAT": "0xDd25BaE0659fC06a8d00CD06C7f5A98D71bfB715",
      "implementationAddress": "0x05a28eE1EeeE05A5ab66E18c08C417860a607d81",
      "collateral": "0x0000000000000000000000000000000000000000",
      "DATinfo": {
        "collateralType": "ETH",
        "name": "DXdao",
        "symbol": "DXD",
        "currency": "0x0000000000000000000000000000000000000000",
        "initReserve": "100000000000000000000000",
        "initGoal": "4898979485566395000000",
        "buySlopeNum": "1",
        "buySlopeDen": "48000000000000000000000",
        "investmentReserveBasisPoints": "1000",
        "revenueCommitmentBasisPoints": "1000",
        "minInvestment": "1000000000000000"
      }
    }
  }
}
```

The build hash ipfs of the entire build folder will be `QmdF8osjvZyQXWNXLtAbua5DYNQaFzcTUgM4xkaEpKvpxC`
