import { NetworkConnector } from 'provider/NetworkConnector';
import { MetamaskConnector } from './MetamaskConnector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const INFURA_API_KEY = process.env.REACT_APP_KEY_INFURA_API_KEY;
export const ETH_NETWORK = process.env.REACT_APP_ETH_NETWORK || 'develop';

export const chainNameById = {
  '1': 'mainnet',
  '3': 'ropsten',
  '4': 'rinkeby',
  '42': 'kovan',
  '66': 'develop',
};

export const chainIdByName = {
  'mainnet': 1,
  'ropsten': 3,
  'rinkeby': 4,
  'kovan': 42,
  'develop': 66,
};

export const RPC_URLS = {
  '1': process.env.REACT_APP_SUPPORTED_NETWORK_1 || 'https://mainnet.infura.io/v3/'+INFURA_API_KEY,
  '3': process.env.REACT_APP_SUPPORTED_NETWORK_3 || 'https://ropsten.infura.io/v3/'+INFURA_API_KEY,
  '4': process.env.REACT_APP_SUPPORTED_NETWORK_4 || 'https://rinkeby.infura.io/v3/'+INFURA_API_KEY,
  '42': process.env.REACT_APP_SUPPORTED_NETWORK_42 || 'https://kovan.infura.io/v3/'+INFURA_API_KEY,
  '66': process.env.REACT_APP_SUPPORTED_NETWORK_66 || 'https://localhost8545',
};

export const web3ContextNames = {
  backup: 'BACKUP',
  injected: 'INJECTED',
  metamask: 'METAMASK',
  walletconnect: 'WALLETCONNECT',
};

const POLLING_INTERVAL = 5000;

export const supportedChainId = chainIdByName[ETH_NETWORK];

export const getSupportedChainName = () => {
    return ETH_NETWORK;
};

export const isChainIdSupported = (chainId: number): boolean => {
    return supportedChainId == chainId.toString();
};

const backupUrls = {};
backupUrls[supportedChainId.toString()] = RPC_URLS[supportedChainId];

export const backup = new NetworkConnector({
    urls: backupUrls,
    defaultChainId: supportedChainId,
    pollingInterval: POLLING_INTERVAL,
});

export const injected = new MetamaskConnector({
    supportedChainIds: [1, 3, 4, 42, 66],
});


export const walletconnect = new WalletConnectConnector({
  rpc: { 
    [supportedChainId] : RPC_URLS[supportedChainId.toString()],
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: false,
  pollingInterval: POLLING_INTERVAL,
})

export default {
    backup,
    injected,
    walletconnect
};

export const SUPPORTED_WALLETS = {
    INJECTED: {
        connector: injected,
        name: 'Injected',
        iconName: 'arrow-right.svg',
        description: 'Injected web3 provider.',
        href: null,
        color: '#010101',
        primary: true,
    },
    METAMASK: {
        connector: injected,
        name: 'MetaMask',
        iconName: 'metamask.png',
        description: 'Easy-to-use browser extension.',
        href: null,
        color: '#E8831D',
    },
    WALLETCONNECT: {
        connector: walletconnect,
        name: 'WalletConnect',
        iconName: 'walletConnectIcon.svg',
        description: 'Connect form mobile.',
        href: null,
        color: '#E8831D',
    },
};
