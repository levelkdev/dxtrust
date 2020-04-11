import { action, observable } from 'mobx';
import RootStore from 'stores/Root';
import { ContractTypes } from 'stores/Provider';
import * as helpers from 'utils/helpers';
import { bnum } from 'utils/helpers';
import { parseEther } from 'ethers/utils';
import { FetchCode } from './Transaction';
import { BigNumber } from 'utils/bignumber';
import {
    AsyncStatus,
    TokenBalanceFetch,
    TotalSupplyFetch,
    UserAllowanceFetch,
} from './actions/fetch';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { BigNumberMap } from '../types';
import { PromiEvent } from 'web3-core';
import { TransactionState } from './TradingForm';

export interface TokenBalance {
    balance: BigNumber;
    lastFetched: number;
}

export interface UserAllowance {
    allowance: BigNumber;
    lastFetched: number;
}

export interface TotalSupply {
    totalSupply: BigNumber;
    lastFetched: number;
}

interface TotalSupplyMap {
    [index: string]: TotalSupply;
}

interface TokenBalanceMap {
    [index: string]: {
        [index: string]: TokenBalance;
    };
}

interface UserAllowanceMap {
    [index: string]: {
        [index: string]: {
            [index: string]: UserAllowance;
        };
    };
}

export const EtherKey = 'ether';

export default class TokenStore {
    @observable symbols = {};
    @observable balances: TokenBalanceMap;
    @observable allowances: UserAllowanceMap;
    @observable totalSupplies: TotalSupplyMap;
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.balances = {} as TokenBalanceMap;
        this.allowances = {} as UserAllowanceMap;
        this.totalSupplies = {} as TotalSupplyMap;
    }

    getAccountBalances(
        tokenAddresses: string[],
        account: string
    ): BigNumberMap {
        const result: BigNumberMap = {};
        tokenAddresses.forEach((tokenAddress) => {
            if (
                this.balances[tokenAddress] &&
                this.balances[tokenAddress][account]
            ) {
                result[tokenAddress] = this.balances[tokenAddress][
                    account
                ].balance;
            }
        });

        return result;
    }

    areAccountApprovalsLoaded(
        tokenAddresses: string[],
        account: string,
        spender: string
    ): boolean {
        const approvals = this.getAllowances(tokenAddresses, account, spender);
        return Object.keys(approvals).length === tokenAddresses.length;
    }

    @action async fetchAccountApprovals(
        web3React,
        tokenAddresses: string[],
        account: string,
        spender: string
    ) {
        const { providerStore } = this.rootStore;

        const promises: Promise<any>[] = [];
        const fetchBlock = providerStore.getCurrentBlockNumber();
        tokenAddresses.forEach((tokenAddress) => {
            promises.push(
                this.fetchAllowance(
                    web3React,
                    tokenAddress,
                    account,
                    spender,
                    fetchBlock
                )
            );
        });

        let allFetchesSuccess = true;

        try {
            const responses = await Promise.all(promises);
            responses.forEach((response) => {
                if (response instanceof UserAllowanceFetch) {
                    const { status, request, payload } = response;
                    const { tradingStore } = this.rootStore;
                    if (status === AsyncStatus.SUCCESS) {
                        this.setAllowanceProperty(
                            request.tokenAddress,
                            request.owner,
                            request.spender,
                            payload.allowance,
                            payload.lastFetched
                        );

                        if (this.hasMaxApproval(request.tokenAddress, request.owner, request.spender)) {
                            tradingStore.enableDXDState = TransactionState.APPROVED;
                        };
                    } else {
                        allFetchesSuccess = false;
                    }
                }
            });

            if (allFetchesSuccess) {
                console.debug('[Fetch Account Approvals] All Fetches Success');
            }
        } catch (e) {
            console.error(
                '[Fetch Account Approvals] Failure in one or more fetches',
                { error: e }
            );
            return FetchCode.FAILURE;
        }
        return FetchCode.SUCCESS;
    }

    getAllowances(
        tokenAddresses: string[],
        account: string,
        spender: string
    ): BigNumberMap {
        const result: BigNumberMap = {};
        tokenAddresses.forEach((tokenAddress) => {
            if (
                this.allowances[tokenAddress] &&
                this.allowances[tokenAddress][account] &&
                this.allowances[tokenAddress][account][spender]
            ) {
                result[tokenAddress] = this.allowances[tokenAddress][account][
                    spender
                ].allowance;
            }
        });

        return result;
    }

    private setAllowanceProperty(
        tokenAddress: string,
        owner: string,
        spender: string,
        approval: BigNumber,
        blockFetched: number
    ): void {
        const chainApprovals = this.allowances;

        if (!chainApprovals[tokenAddress]) {
            chainApprovals[tokenAddress] = {};
        }

        if (!chainApprovals[tokenAddress][owner]) {
            chainApprovals[tokenAddress][owner] = {};
        }

        chainApprovals[tokenAddress][owner][spender] = {
            allowance: approval,
            lastFetched: blockFetched,
        };

        this.allowances = chainApprovals;
    }

    private setBalanceProperty(
        tokenAddress: string,
        account: string,
        balance: BigNumber,
        blockFetched: number
    ): void {
        const chainBalances = this.balances;

        if (!chainBalances[tokenAddress]) {
            chainBalances[tokenAddress] = {};
        }

        chainBalances[tokenAddress][account] = {
            balance: balance,
            lastFetched: blockFetched,
        };

        this.balances = chainBalances;
    }

    getTotalSupply(tokenAddress: string): BigNumber | undefined {
        const {blockchainStore} = this.rootStore;
        const entry = {
            contractType: ContractTypes.ERC20,
            address: tokenAddress,
            method: 'totalSupply',
            params: []
        };

        if (blockchainStore.has(entry)) {
            return bnum(blockchainStore.get(entry).value);
        } else {
            return undefined;
        }
    }

    getBalance(tokenAddress: string, account: string): BigNumber | undefined {
        const tokenBalances = this.balances[tokenAddress];
        if (tokenBalances) {
            const balance = tokenBalances[account];
            if (balance) {
                if (balance.balance) {
                    return balance.balance;
                }
            }
        }

        return undefined;
    }

    private getBalanceLastFetched(
        tokenAddress: string,
        account: string
    ): number | undefined {
        const tokenBalances = this.balances[tokenAddress];
        if (tokenBalances) {
            const balance = tokenBalances[account];
            if (balance) {
                if (balance.lastFetched) {
                    return balance.lastFetched;
                }
            }
        }
        return undefined;
    }

    @action approveMax = (
        web3React,
        tokenAddress,
        spender
    ): PromiEvent<any> => {
        const { providerStore, tradingStore } = this.rootStore;
        return providerStore.sendTransaction(
            web3React,
            ContractTypes.ERC20,
            tokenAddress,
            'approve',
            [spender, helpers.MAX_UINT.toString()]
        );
        tradingStore.enableDXDState = TransactionState.APPROVED;
    };

    @action revokeApproval = (
        web3React,
        tokenAddress,
        spender
    ): PromiEvent<any> => {
        const { providerStore } = this.rootStore;
        return providerStore.sendTransaction(
            web3React,
            ContractTypes.ERC20,
            tokenAddress,
            'approve',
            [spender, 0]
        );
    };

    @action fetchTokenBalances = async (
        web3React: Web3ReactContextInterface,
        account: string,
        tokensToTrack: string[]
    ): Promise<FetchCode> => {
        const { providerStore } = this.rootStore;
        const promises: Promise<any>[] = [];
        const fetchBlock = providerStore.getCurrentBlockNumber();
        tokensToTrack.forEach((value, index) => {
            promises.push(
                this.fetchBalanceOf(web3React, value, account, fetchBlock)
            );
        });

        let allFetchesSuccess = true;

        try {
            const responses = await Promise.all(promises);
            responses.forEach((response) => {
                if (response instanceof TokenBalanceFetch) {
                    const { status, request, payload } = response;
                    if (status === AsyncStatus.SUCCESS) {
                        this.setBalanceProperty(
                            request.tokenAddress,
                            request.account,
                            payload.balance,
                            payload.lastFetched
                        );
                    } else {
                        allFetchesSuccess = false;
                    }
                }
            });

            if (allFetchesSuccess) {
                console.debug('[All Fetches Success]');
            }
        } catch (e) {
            console.error('[Fetch] Token Data', { error: e });
            return FetchCode.FAILURE;
        }
        return FetchCode.SUCCESS;
    };

    @action fetchBalanceOf = async (
        web3React: Web3ReactContextInterface,
        tokenAddress: string,
        account: string,
        fetchBlock: number
    ): Promise<TokenBalanceFetch> => {
        const { providerStore } = this.rootStore;

        /* Before and after the network operation, check for staleness
            If the fetch is stale, don't do network call
            If the fetch is stale after network call, don't set DB variable
        */
        const stale =
            fetchBlock <= this.getBalanceLastFetched(tokenAddress, account);
        if (!stale) {
            let balance;

            if (tokenAddress === EtherKey) {
                const { library } = web3React;
                balance = bnum(await library.eth.getBalance(account));
            } else {
                const token = providerStore.getContract(
                    web3React,
                    ContractTypes.ERC20,
                    tokenAddress
                );
                balance = bnum(await token.methods.balanceOf(account).call());
            }

            const stale =
                fetchBlock <= this.getBalanceLastFetched(tokenAddress, account);
            if (!stale) {
                console.debug('[Balance Fetch]', {
                    tokenAddress,
                    account,
                    balance: balance.toString(),
                    fetchBlock,
                });
                return new TokenBalanceFetch({
                    status: AsyncStatus.SUCCESS,
                    request: {
                        tokenAddress,
                        account,
                        fetchBlock,
                    },
                    payload: {
                        balance,
                        lastFetched: fetchBlock,
                    },
                });
            }
        } else {
            console.debug('[Balance Fetch] - Stale', {
                tokenAddress,
                account,
                fetchBlock,
            });
            return new TokenBalanceFetch({
                status: AsyncStatus.STALE,
                request: {
                    tokenAddress,
                    account,
                    fetchBlock,
                },
                payload: undefined,
            });
        }
    };

    @action mint = async (
        web3React: Web3ReactContextInterface,
        tokenAddress: string,
        amount: string
    ) => {
        const { providerStore } = this.rootStore;
        await providerStore.sendTransaction(
            web3React,
            ContractTypes.ERC20,
            tokenAddress,
            'mint',
            [parseEther(amount).toString()]
        );
    };

    @action fetchAllowance = async (
        web3React: Web3ReactContextInterface,
        tokenAddress: string,
        owner: string,
        spender: string,
        fetchBlock: number
    ): Promise<UserAllowanceFetch> => {
        const { providerStore } = this.rootStore;

        // Always max allowance for Ether
        if (tokenAddress === EtherKey) {
            return new UserAllowanceFetch({
                status: AsyncStatus.SUCCESS,
                request: {
                    tokenAddress,
                    owner,
                    spender,
                    fetchBlock,
                },
                payload: {
                    allowance: bnum(helpers.setPropertyToMaxUintIfEmpty()),
                    lastFetched: fetchBlock,
                },
            });
        }

        const token = providerStore.getContract(
            web3React,
            ContractTypes.ERC20,
            tokenAddress
        );

        /* Before and after the network operation, check for staleness
            If the fetch is stale, don't do network call
            If the fetch is stale after network call, don't set DB variable
        */
        const stale =
            fetchBlock <=
            this.getAllowanceLastFetched(tokenAddress, owner, spender);
        if (!stale) {
            try {
                const allowance = bnum(await token.methods.allowance(owner, spender).call());

                const stale =
                    fetchBlock <=
                    this.getAllowanceLastFetched(tokenAddress, owner, spender);
                if (!stale) {
                    console.debug('[Allowance Fetch]', {
                        tokenAddress,
                        owner,
                        spender,
                        allowance: allowance.toString(),
                        fetchBlock,
                    });
                    return new UserAllowanceFetch({
                        status: AsyncStatus.SUCCESS,
                        request: {
                            tokenAddress,
                            owner,
                            spender,
                            fetchBlock,
                        },
                        payload: {
                            allowance,
                            lastFetched: fetchBlock,
                        },
                    });
                }
            } catch (e) {
                return new UserAllowanceFetch({
                    status: AsyncStatus.FAILURE,
                    request: {
                        tokenAddress,
                        owner,
                        spender,
                        fetchBlock,
                    },
                    payload: undefined,
                    error: e.message,
                });
            }
        } else {
            console.debug('[Allowance Fetch] - Stale', {
                tokenAddress,
                owner,
                spender,
                fetchBlock,
            });
            return new UserAllowanceFetch({
                status: AsyncStatus.STALE,
                request: {
                    tokenAddress,
                    owner,
                    spender,
                    fetchBlock,
                },
                payload: undefined,
            });
        }
    };

    hasMaxApproval = (tokenAddress, account, spender): boolean => {
        const allowance = this.getAllowance(tokenAddress, account, spender);
        if (!allowance) {
            return false;
        }
        return helpers.hasMaxApproval(allowance);
    };

    getAllowance = (tokenAddress, account, spender): BigNumber | undefined => {
        const chainApprovals = this.allowances;
        if (chainApprovals) {
            const tokenApprovals = chainApprovals[tokenAddress];
            if (tokenApprovals) {
                const userApprovals = tokenApprovals[account];
                if (userApprovals) {
                    if (userApprovals[spender]) {
                        return userApprovals[spender].allowance;
                    }
                }
            }
        }
        return undefined;
    };

    getAllowanceLastFetched = (
        tokenAddress,
        account,
        spender
    ): number | undefined => {
        const chainApprovals = this.allowances;
        if (chainApprovals) {
            const tokenApprovals = chainApprovals[tokenAddress];
            if (tokenApprovals) {
                const userApprovals = tokenApprovals[account];
                if (userApprovals) {
                    if (userApprovals[spender]) {
                        return userApprovals[spender].lastFetched;
                    }
                }
            }
        }
        return undefined;
    };
}
