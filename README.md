# BC-DAPP

Bonding Curve Dapp, based in the [DXdao Bonding Curve DAPP Proposal doc](https://github.com/levelkdev/BC-DAPP/blob/master/docs/dxdao-proposal.md).

## Setup

### Installation
- Install dependencies
    ```
    yarn
    ```

### Development
1.- Add a 12 phrase mnemonic phrase in the .mnemonic file.
2.- Configure your .env file, make sure to set the environment to develop.
3- Modify the `node_modules/@web3-react/core/dist/core.esm.js` file in line 141. COmmet it and override the chainId for 66, the chainId of the localtestnet.

```
//!!Number.isNaN(parsedChainId) ? process.env.NODE_ENV !== "production" ? invariant(false, "chainId " + chainId + " is not an integer") : invariant(false) : void 0;
parsedChainId = 66; // localtestnet chainId override.
```

4.- Start the local testnet, it will deploy new orgs based in the configuration from `config/app.json` file. Once the deployment finish it will create the file `src/blockchainInfo.json` with the testing addresses for the app.
    ```
    yarn run dev
    ```
    
5.- Once the contracts are deployed and testnet running execute the start script and use metamask from `localhost:8545`
    ```
    yarn start
    ```    
    

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
