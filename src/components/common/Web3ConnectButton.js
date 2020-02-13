import React from 'react'
import { observer, inject } from 'mobx-react'
import Web3 from 'web3'
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import Squarelink from "squarelink";
import Torus from "@toruslabs/torus-embed";
import Arkane from "@arkane-network/web3-arkane-provider";
import Authereum from "authereum";
import store from '../../stores/Root'
import UserAddress from './UserAddress'
import ErrorButton from './ErrorButton'
// Keeping
// interface IAppState {
//   fetching: boolean;
//   address: string;
//   web3: any;
//   connected: boolean;
//   chainId: number;
//   networkId: number;
//   assets: IAssetData[];
//   showModal: boolean;
//   pendingRequest: boolean;
//   result: any | null;
// }

@observer
class Web3ConnectButton extends React.Component { 

  state = {
    wrongNetwork: false
  }

  connect = async provider => {
      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      const networkId = await web3.eth.net.getId();
      // console.log(networkId)
      if (networkId !== 42) {
        this.setState({ wrongNetwork: true })
        return;
      } else {
        web3.eth.extend({
          methods: [
            {
              name: "chainId",
              call: "eth_chainId",
              outputFormatter: web3.utils.hexToNumber
            }
          ]
        });
        const chainId = await web3.eth.chainId();
        
        store.providerStore.address = address
        store.providerStore.chainId = chainId
        store.providerStore.web3 = web3
        store.providerStore.isConnected = true
        await store.tradingStore.setDappTradeData()
        await store.tradingStore.checkCollateralAllowance()
        await store.tradingStore.checkBondedTokenAllowance()
    }
  }

  render() {
    const { wrongNetwork } = this.state

    if (!store.tradingStore.recentTradeSet) {
      store.tradingStore.setRecentTrades()
    }


    return (
      <div>
        {
          wrongNetwork ?
            <ErrorButton onClick={this.connect}/>
          :
          store.providerStore.isConnected ? 
            <UserAddress address={store.providerStore.address} />
          :
          (<Web3Connect.Button
            network="mainnet" // optional
          /* 
            providerOptions={{
              walletconnect: {
                package: WalletConnectProvider, // required
                options: {
                  // TODO add infura id
                  infuraId: "INFURA_ID" // required
                }
              },
              portis: {
                package: Portis, // required
                options: {
                  // TODO add portis id
                  id: "PORTIS_ID" // required
                }
              },
              // fortmatic: {
              //   package: Fortmatic, // required
              //   options: {
              //     key: "FORTMATIC_KEY" // required
              //   }
              // },
              // squarelink: {
              //   package: Squarelink, // required
              //   options: {
              //     id: "SQUARELINK_ID" // required
              //   }
              // },
              // torus: {
              //   package: Torus, // required
              //   options: {
              //     enableLogging: false, // optional
              //     buttonPosition: "bottom-left", // optional
              //     buildEnv: "production", // optional
              //     showTorusButton: true // optional
              //   }
              // },
              // arkane: {
              //   package: Arkane, // required
              //   options: {
              //     clientId: "ARKANE_CLIENT_ID" // required, replace
              //   }
              // },
              authereum: {
                package: Authereum, // required
                options: {}
              }
            }}
          */
            onConnect={this.connect}
            onClose={() => {
              console.log("Web3Connect Modal Closed"); // modal has closed
            }}
            onError={(error) => {
              console.error(error); // tslint:disable-line
            }}
          />)
        }
      </div>
    )
  }
}

export default Web3ConnectButton