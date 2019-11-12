import React from 'react'
import Web3 from 'web3'
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import Squarelink from "squarelink";
import Torus from "@toruslabs/torus-embed";
import Arkane from "@arkane-network/web3-arkane-provider";
import Authereum from "authereum";

interface IAppState {
  fetching: boolean;
  address: string;
  web3: any;
  connected: boolean;
  chainId: number;
  networkId: number;
  assets: IAssetData[];
  showModal: boolean;
  pendingRequest: boolean;
  result: any | null;
}

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: "",
  web3: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null
}

class Web3ConnectButton extends React.Component { 
  state = {
    ...INITIAL_STATE
  }

  render() {
    const {
      assets,
      address,
      connected,
      chainId,
      fetching,
      showModal,
      pendingRequest,
      result
    } = this.state; 

    return (
      <div>
        {connected ? 
          <div>
            <div>Address: {address}</div>
            <div>Connected: {connected ? "true" : "false"}</div>
            <div>Chain ID: {chainId}</div>
          </div>
          :
          (<Web3Connect.Button
            network="mainnet" // optional
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
            onConnect={ async (provider: any) => {
              console.log("hello in onConnect");

              const web3 = new Web3(provider);

              const accounts = await web3.eth.getAccounts();

              const address = accounts[0];

              const networkId = await web3.eth.net.getId();

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

              await this.setState({
                web3,
                connected: true,
                address,
                chainId,
                networkId
              });
              // await this.getAccountAssets();
            }}
            onClose={() => {
              console.log("Web3Connect Modal Closed"); // modal has closed
            }}
            onError={(error: Error) => {
              console.error(error); // tslint:disable-line
            }}
          />)
        }
      </div>
    )
  }
}

export default Web3ConnectButton