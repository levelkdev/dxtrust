# BC-DAPP

Bonding Curve Dapp, based in the [DXdao Bonding Curve DAPP Proposal doc](https://github.com/levelkdev/BC-DAPP/blob/master/docs/dxdao-proposal.md).

## Setup

### Installation
- Install dependencies
    ```
    yarn
    ```
    
## Test
- No front-end tests at the moment. (Jest is included for testing React components).
```
yarn test
```

## Formatting and Linting
- Husky will automatically format files, using prettier + tslist, before git commits.
- Manually execute formatting on staged files with ```yarn lint-staged```

## Build For Production
- Full dApp build will live in /build folder.
```
yarn build
```

## Development

### Local Development

1.- Add a 12 phrase mnemonic phrase in the `.env` file on the `BCAPP_KEY_MNEMONIC` variable, you can generate and see your keys and addresses [here](https://iancoleman.io/bip39/), use 12 words, select ETH and use BIP 44.
2.- Configure your `.env` file, make sure to set the environment to develop, see the `.env.example` file.
4.- Execute `yarn dev` , this will start the local testnet, deploy new orgs based in the configuration from `src/config/contracts.json` file. Once the deployment finish it will update the file with the testing addresses of the DAT in develop for the app, and start the react app in development network.
    
### Kovan Developement

1.- Add a 12 phrase mnemonic phrase in the `.env` file on the `BCAPP_KEY_MNEMONIC` variable, you can generate and see your keys and addresses [here](https://iancoleman.io/bip39/), use 12 words, select ETH and use BIP 44.
2.- Configure your `.env` file, make sure to set the environment to develop, see the `.env.example` file.
4.- Execute `yarn start`, it will work with the contracts specified in the configuration from `src/config/contracts.json` file. The app will connect to an infura provider by default using your infura api key form the `.env` file, if you want to override is an option envarioment variable you can use.

### Get last commit GIT
```
git rev-parse HEAD
```
