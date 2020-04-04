import { NetworkConnector } from 'provider/NetworkConnector';
import { MetamaskConnector } from './MetamaskConnector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const supportedChainId = Number(
    process.env.REACT_APP_SUPPORTED_NETWORK_ID
);

export const getSupportedChainId = () => {
    return supportedChainId;
};

export const getSupportedChainName = () => {
    return chainNameById[supportedChainId];
};

export const chainNameById = {
    '1': 'mainnet',
    '42': 'kovan',
};

export const isChainIdSupported = (chainId: number): boolean => {
    return supportedChainId === chainId;
};

const POLLING_INTERVAL = 5000;
const RPC_URLS: { [chainId: number]: string } = {
    [process.env.REACT_APP_SUPPORTED_NETWORK_ID] : process.env.REACT_APP_SUPPORTED_NETWORK_URL as string,
};


export const web3ContextNames = {
    backup: 'BACKUP',
    injected: 'INJECTED',
    metamask: 'METAMASK',
    walletconnect: 'WALLETCONNECT',
};

const backupUrls = {};
backupUrls[supportedChainId] = RPC_URLS[supportedChainId];

export const backup = new NetworkConnector({
    urls: backupUrls,
    defaultChainId: supportedChainId,
    pollingInterval: POLLING_INTERVAL,
});

export const injected = new MetamaskConnector({
    supportedChainIds: [1, Number(process.env.REACT_APP_SUPPORTED_NETWORK_ID)],
});


export const walletconnect = new WalletConnectConnector({
  rpc: { 
    [process.env.REACT_APP_SUPPORTED_NETWORK_ID] : process.env.REACT_APP_SUPPORTED_NETWORK_URL,
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
