# DXtrust

The **DXtrust** is used to raise funds for [DXdao](http://dxdao.eth.link/).

## Technical Description

The DXtrust Dapp is designed to be completely client side, which means that it runs entirely on the browser of the user and only consumes necessary information and interacts when needed with the Ethereum blockchain.
The dapp is written in javascript and typescrypt, it uses ReactJS and Webapack.
The contracts used in the dapp are the c-org contracts from fairmint. https://github.com/Fairmint/c-org.

[Old DXdao Bonding Curve DAPP Proposal doc](https://github.com/levelkdev/BC-DAPP/blob/master/docs/dxdao-proposal.md)

## Install
Install dependencies with the following command:
```
yarn
```

## Start dapp
This will start the dapp on the networks you have configured in ETH_NETWORKS form the configs that were loaded previously
```
yarn start-dapp
```

## Development
Before doing the build make sure to have the right values in the `.env.developement` and `.end.production` form the .env examples files.
The script will start the dapp on the networks you have configured in ETH_NETWORKS form the configs taht were loaded previously, we recommend you to use the development network as default (use it as first in the ETH_NETWORKS array), and you can use the app in loclahot:8545, take in mind that the accounts that are seeded are the ones from the mnmonic key.
```
yarn dev-dapp
```
    
## Test Contracts
This script will run test over the DAT contracts that are used.
```
yarn test-contracts
```
  
### Kovan Developement

1.- Add a 12 phrase mnemonic phrase in the `.env` file on the `REACT_APP_KEY_MNEMONIC` variable, you can generate and see your keys and addresses [here](https://iancoleman.io/bip39/), use 12 words, select ETH and use BIP 44.
2.- Configure your `.env` file, make sure to set the environment to develop, see the `.env.example` file.
4.- Execute `yarn start`, it will work with the contracts specified in the configuration from `src/config/contracts.json` file. The app will connect to an infura provider by default using your infura api key form the `.env` file, if you want to override is an option environment variable you can use.

## Deployment

Before doing the build make sure to have the right values in the `.env` file:
```
REACT_APP_KEY_INFURA_API_KEY
REACT_APP_ETH_NETWORK
REACT_APP_GIT_SHA
```
To make the build of the dapp use the command `yarn run build`. It will create production build that can be hosted anywhere. We host and support the builds in IPFS and Swarm networks.

## Contracts Deployment

Before doing the build make sure to have the `REACT_APP_KEY_INFURA_API_KEY` in the `.env` file with balance in the index 0 account.
To deploy the contracts for production on live networks we suggest using the script `yarn run deploy-contracts`.
An example of the script to run for mainnet: `yarn run deploy-contracts --provider https://mainnet.infura.io/v3/xxxxxxxxxxxxxxxxxxxxxxxxx`
An example of the script to run for kovan: `yarn run deploy-contracts --network kovan --provider https://kovan.infura.io/v3/xxxxxxxxxxxxxxxxxxxxxxxxx`
The script will deploy everything with the configuration proposed in https://daotalk.org/t/configuration-template-for-fundraising-decentralized-application/1250 and approved in https://alchemy.daostack.io/dao/0x519b70055af55a007110b4ff99b0ea33071c720a/proposal/0xeb9cf2b3d76664dc1e983137f33b2400ad11966b1d79399d7ca55c25ad6283fa.

## Governance

The DAT contract has two types of ownership. One is the Proxy Ownership and another is DAT Contract ownership.

The proxy owner is called admin in the (openzeppelin contracts that are used here)[https://docs.openzeppelin.com/upgrades/2.8/proxies]. We have to differentiate here from the ProxyAdmin contract and the proxy admin role. The ProxyAdmin contract is an Ownable contract that is owned by the DXdao, meaning the DXdao has control of the ProxyAdmin contract and all proxies administered by the ProxyAdmin contract. Each proxy registered in the ProxyAdmin contract has an admin address that can execute the upgrade functions.

The DAT Contract ownership would be the contract controller, an address set in the DAT contract that can execute the "owner" functions, such as updateConfig, which updates the configuration of the DAT. The controlller address is the DXdao.

Control flow for executing upgrade functions:
```
DXdao -> ProxyAdmin -> DATProxy
```
Control flow when the DAT is running normally and functions like pay() or burn() are called by DXdao:
```
DXdao -> DAT
```

### Kovan governance

A kovan instance for the DAT with the parameters outlined in the proposal to the DXdao will be provided by developers that are maintaining this repository. The only difference is that instead of DXdao a multisignature wallet with 1 required confirmation integrated by developers will govern the kovan DAT.

(Kovan Developers Multisig)[https://kovan.etherscan.io/address/0x0468eBA33b191C8A3C5eB5d62714fFFa155BCF52]


### IPFS

Follow the installation instructions here https://docs-beta.ipfs.io/how-to/command-line-quick-start/#install-ipfs.

Executables for ipfs-update can be downloaded from https://dist.ipfs.io/#ipfs-update.

The build can be upload to ipfs with the following command:
```
ipfs add -r build
```

### Smart Contracts

We use [openzeppelin](https://docs.openzeppelin.com/cli) to have upgradeable proxies of the Decentralized Autonomous Trust contract on kovan and mainnet. You can see the package information in the `.openzeppelin` folder.

The commands we used to deploy and verify the contracts were:

```
npx oz deploy -n kovan --from ACCOUNT DecentralizedAutonomousTrust
# It will ask the type of deployment you want to do and select the initialize function to use.
npx oz deploy -n kovan --from ACCOUNT Multicall
# It will ask the type of deployment you want to do and select the initialize function to use.
npx oz verify DAT_ADDRESS --api-key ETHERSCAN_API_KEY --network kovan --remote etherscan --optimizer --optimizer-runs 200 DecentralizedAutonomousTrust
```

## Code Verification

We provide instructions to verify the smart contracts and dapp deployed in the [docs/VerificationInstructions.md](docs/VerificationInstructions.md)
