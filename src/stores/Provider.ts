import { action, observable, ObservableMap } from 'mobx';
import RootStore from 'stores/Root';
import { ethers } from 'ethers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import UncheckedJsonRpcSigner from 'provider/UncheckedJsonRpcSigner';
import { sendAction } from './actions/actions';
import { supportedChainId, web3ContextNames } from '../provider/connectors';
import PromiEvent from 'promievent';
import { TXEvents } from '../types';
import moment from 'moment';

export enum ContractTypes {
    ERC20 = 'ERC20',
    BondedToken = 'BondedToken',
    BondingCurve = 'BondingCurve',
    BondingCurveEther = 'BondingCurveEther',
    RewardsDistributor = 'RewardsDistributor',
    StaticCurveLogic = 'StaticCurveLogic',
    DecentralizedAutonomousTrust = 'DecentralizedAutonomousTrust',
}

export const schema = {
    ERC20: require('../contracts/ERC20').abi,
    BondedToken: require('../contracts/ERC20').abi,
    BondingCurve: require('../contracts/ERC20').abi,
    BondingCurveEther: require('../contracts/ERC20').abi,
    RewardsDistributor: require('../contracts/ERC20').abi,
    StaticCurveLogic: require('../contracts/ERC20').abi,
    DecentralizedAutonomousTrust: require('../contracts/DecentralizedAutonomousTrust')
        .abi,
};

export interface ChainData {
    currentBlockNumber: number;
}

enum ERRORS {
    UntrackedChainId = 'Attempting to access data for untracked chainId',
    ContextNotFound = 'Specified context name note stored',
    BlockchainActionNoAccount = 'Attempting to do blockchain transaction with no account',
    BlockchainActionNoChainId = 'Attempting to do blockchain transaction with no chainId',
    BlockchainActionNoResponse = 'No error or response received from blockchain action',
}

type ChainDataMap = ObservableMap<number, ChainData>;

export default class ProviderStore {
    @observable provider: any;
    @observable accounts: string[];
    @observable defaultAccount: string | null;
    @observable web3Contexts: object;
    @observable blockNumber: number;
    @observable supportedNetworks: number[];
    @observable chainData: ChainData;
    @observable activeChainId: number;
    @observable activeFetchLoop: any;
    @observable activeAccount: string;
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.web3Contexts = {};
        this.chainData = { currentBlockNumber: -1 } as ChainData;
    }

    isFresh(blockNumber: number): boolean {
        return blockNumber === this.getCurrentBlockNumber();
    }

    isFresher(newBlockNumber: number, oldBlockNumber: number): boolean {
        return newBlockNumber > oldBlockNumber;
    }

    isBlockStale(blockNumber: number) {
        return blockNumber < this.chainData.currentBlockNumber;
    }

    getCurrentBlockNumber(): number {
        return this.chainData.currentBlockNumber;
    }

    @action setCurrentBlockNumber(blockNumber): void {
        this.chainData.currentBlockNumber = blockNumber;
    }

    @action setActiveAccount(account: string) {
        this.activeAccount = account;
    }

    @action fetchUserBlockchainData = async (
        web3React: Web3ReactContextInterface,
        account: string
    ) => {
        const { transactionStore } = this.rootStore;

        console.debug('[Fetch Start - User Blockchain Data]', {
            account,
        });

        transactionStore.checkPendingTransactions(web3React, account);
    };

    // account is optional
    getProviderOrSigner(library, account) {
        console.debug('[getProviderOrSigner', {
            library,
            account,
            signer: library.getSigner(account),
        });

        return account
            ? new UncheckedJsonRpcSigner(library.getSigner(account))
            : library;
    }

    getContract(
        web3React: Web3ReactContextInterface,
        type: ContractTypes,
        address: string,
        signerAccount?: string
    ): ethers.Contract {
        const { library } = web3React;

        if (signerAccount) {
            return new library.eth.Contract(schema[type], address, {
                from: signerAccount,
            });
        }

        return new library.eth.Contract(schema[type], address);
    }

    // get blockTime from blockNumber
    async getBlockTime(blockNumber) {
        const context = this.getActiveWeb3React();
        const blockData = await context.library.eth.getBlock(blockNumber);
        const date = new Date(blockData.timestamp * 1000);
        return moment(date).format('DD.MM - HH:mm');
    }


    // get blockHash from blockNumber
    async getBlockHash(blockNumber) {
        const context = this.getActiveWeb3React();
        const blockData = await context.library.eth.getBlock(blockNumber);
        return blockData.hash;
    }

    getActiveWeb3React(): Web3ReactContextInterface {
        const contextBackup = this.web3Contexts[web3ContextNames.backup];
        const contextInjected = this.web3Contexts[web3ContextNames.injected];

        return contextInjected.active &&
            contextInjected.chainId === supportedChainId
            ? contextInjected
            : contextBackup;
    }

    getWeb3React(name): Web3ReactContextInterface {
        if (!this.web3Contexts[name]) {
            throw new Error(ERRORS.ContextNotFound);
        }
        return this.web3Contexts[name];
    }

    @action setWeb3Context(name, context: Web3ReactContextInterface) {
        console.debug('[setWeb3Context]', name, context);
        this.web3Contexts[name] = context;
    }

    @action sendTransaction = (
        web3React: Web3ReactContextInterface,
        contractType: ContractTypes,
        contractAddress: string,
        action: string,
        params: any[],
        overrides?: any
    ): PromiEvent<any> => {
        const { transactionStore } = this.rootStore;
        const { chainId, account } = web3React;

        overrides = overrides ? overrides : {};

        if (!account) {
            throw new Error(ERRORS.BlockchainActionNoAccount);
        }

        if (!chainId) {
            throw new Error(ERRORS.BlockchainActionNoChainId);
        }

        const contract = this.getContract(
            web3React,
            contractType,
            contractAddress,
            account
        );

        const response = sendAction({
            contract,
            action,
            sender: account,
            data: params,
            overrides,
        }).on(TXEvents.TX_HASH, (hash) => {
            console.log('tracking transaction', hash);
            transactionStore.addTransactionRecord(account, hash);
        });

        return response;
    };
}
