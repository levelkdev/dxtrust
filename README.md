# BC-DAPP

The **Bonding Curve Decentralized Application** will be used to raise funds to support the development of decentralized finance focused applications governed and maintained by the [DXdao](https://dxdao.daostack.io/).

## Project Status

The project development can be followed in the milestones section https://github.com/levelkdev/BC-DAPP/milestones.

## Technical Description

The Bonding Curve Dapp is designed to be completely client side, which means that it runs entirely on the browser of the user and only consumes necessary information and interacts when needed with the Ethereum blockchain.
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
~/swarm --bzzapi https://swarm-gateways.net/ --defaultpath PATH_TO_BC-DAPP/build/index.html --recursive up PATH_TO_BC-DAPP/BC-DAPP/build
```
