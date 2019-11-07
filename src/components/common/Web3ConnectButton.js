import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import Squarelink from "squarelink";
import Torus from "@toruslabs/torus-embed";
import Arkane from "@arkane-network/web3-arkane-provider";
import Authereum from "authereum";

const Web3ConnectButton = ({}) => { 
  return (
    <Web3Connect.Button
      network="mainnet" // optional
      providerOptions={{
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "INFURA_ID" // required
          }
        },
        portis: {
          package: Portis, // required
          options: {
            id: "PORTIS_ID" // required
          }
        },
        fortmatic: {
          package: Fortmatic, // required
          options: {
            key: "FORTMATIC_KEY" // required
          }
        },
        squarelink: {
          package: Squarelink, // required
          options: {
            id: "SQUARELINK_ID" // required
          }
        },
        torus: {
          package: Torus, // required
          options: {
            enableLogging: false, // optional
            buttonPosition: "bottom-left", // optional
            buildEnv: "production", // optional
            showTorusButton: true // optional
          }
        },
        arkane: {
          package: Arkane, // required
          options: {
            clientId: "ARKANE_CLIENT_ID" // required, replace
          }
        },
        authereum: {
          package: Authereum, // required
          options: {}
        }
      }}
      onConnect={(provider: any) => {
        const web3 = new Web3(provider); // add provider to web3
      }}
      onClose={() => {
        console.log("Web3Connect Modal Closed"); // modal has closed
      }}
    />;
  )
}

export default InactiveButton