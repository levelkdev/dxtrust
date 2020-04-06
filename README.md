# BC-DAPP

Bonding Curve Dapp, based in the [DXdao Bonding Curve DAPP Proposal doc](https://github.com/levelkdev/BC-DAPP/blob/master/docs/dxdao-proposal.md).

## Setup

### Installation
- Install dependencies
    ```
    yarn
    ```

### Development

1.- Add a 12 phrase mnemonic phrase in the `.env` file on the `BCAPP_KEY_MNEMONIC` variable, you can generate and see your keys and addresses (here)[https://iancoleman.io/bip39/], use 12 words, select ETH and use BIP 44.
2.- Configure your `.env` file, make sure to set the environment to develop, see the `.env.example` file.
4.- Start the local testnet, it will deploy new orgs based in the configuration from `config/app.json` file. Once the deployment finish it will create the file `src/blockchainInfo.json` with the testing addresses for the app.
    ```
    yarn run dev
    ```
    
5.- Once the contracts are deployed and testnet running execute the start script and use metamask from `localhost:8545`
    ```
    yarn start
    ```
    
### Kovan developement

To develop over kovan you have to use the right values for network id and url in the `.env` file. You can use the default contracts deployed in `config/contracts.json` or deploy new ones deploy in kovan by executing `yarn run deploy --network kovan`. You will need to have balance in the account index 1 generated from your mnemonic key.    

### Start App
- As per create-react-app
    ```
    yarn start
    ```

### Test
- No front-end tests at the moment. (Jest is included for testing React components).
    ```
    yarn test
    ```
    
### Build For Production
- Full dApp build will live in /build folder.
    ```
    yarn build
    ```
