# OpenRaise

The **OpenRaise Dapp** is used to raise funds for decentralized organizations.


## Technical Description

The OpenRaise Dapp is designed to be completely client side, which means that it runs entirely on the browser of the user and only consumes necessary information and interacts when needed with the Ethereum blockchain.
The dapp is written in javascript and typescrypt, it uses ReactJS and Webapack.
The contracts used in the dapp are the c-org contracts from fairmint. https://github.com/Fairmint/c-org.

[Old DXdao Bonding Curve DAPP Proposal doc](https://github.com/levelkdev/BC-DAPP/blob/master/docs/dxdao-proposal.md)

## Install
Install dependencies with the following command:
```
yarn
```
    
## Test
No front-end tests at the moment. (Jest is included for testing React components), run tests with the following command:
```
yarn test
```

## Development

Before doing the build make sure to have the right values in the `.env` file:
```
REACT_APP_KEY_MNEMONIC
REACT_APP_KEY_INFURA_API_KEY
REACT_APP_ETH_NETWORK
REACT_APP_GIT_SHA
```
## Formatting and Linting
- Husky will automatically format files, using prettier + tslist, before git commits.
- Manually execute formatting on staged files with ```yarn lint-staged```
- Formatting tools can be installed for many editors for issue highlighting and features such as format on save
    - [Prettier](https://prettier.io/docs/en/editors.html)
    - [Tslint / Eslint](https://eslint.org/docs/user-guide/integrations)

### Local Development

1.- Add a 12 phrase mnemonic phrase in the `.env` file on the `REACT_APP_KEY_MNEMONIC` variable, you can generate and see your keys and addresses [here](https://iancoleman.io/bip39/), use 12 words, select ETH and use BIP 44.
2.- Configure your `.env` file, make sure to set the environment to develop, see the `.env.example` file.
4.- Execute `yarn dev` , this will start the local testnet, deploy new orgs based in the configuration from `src/config/contracts.json` file. Once the deployment finish it will update the file with the testing addresses of the DAT in develop for the app, and start the react app in development network.
    
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

### Swarm

Follow the installation instructions here https://swarm-guide.readthedocs.io/en/latest/node_operator.html#installation-and-updates.

Executable can be downloaded from https://swarm-gateways.net/bzz:/swarm.eth/downloads/.

The build can be upload to swarm with the following command:
```
~/swarm --bzzapi https://swarm-gateways.net/ --defaultpath PATH_TO_OPENRAISE-DAPP/build/index.html --recursive up PATH_TO_OPENRAISE-DAPP/OPENRAISE-DAPP/build
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
