import { action, observable, transaction } from 'mobx';
import RootStore from 'stores/Root';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { supportedChainId } from '../provider/connectors';
import { validateTokenValue, ValidationStatus } from '../utils/validators';
import { denormalizeBalance, normalizeBalance } from '../utils/token';
import { ContractType } from './Provider';
import blockchainStore from './BlockchainStore';
import { TransactionState } from './TradingForm';

export default class BlockchainFetchStore {
    @observable activeFetchLoop: any;
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @action async refreshBuyFormPreview() {
        const { datStore, configStore, tradingStore } = this.rootStore;
        const minValue = normalizeBalance(
            datStore.getMinInvestment(configStore.activeDatAddress)
        );

        if (
            validateTokenValue(tradingStore.buyAmount, {
                minValue,
            }) === ValidationStatus.VALID
        ) {
            const weiValue = denormalizeBalance(tradingStore.buyAmount);

            const buyReturn = await datStore.fetchBuyReturn(
                configStore.activeDatAddress,
                weiValue
            );

            tradingStore.handleBuyReturn(buyReturn);
        }
    }

    @action setFetchLoop(
        web3React: Web3ReactContextInterface,
        accountSwitched?: boolean
    ) {
        if (web3React.active && web3React.chainId === supportedChainId) {
            const { library, account, chainId } = web3React;
            const {
                providerStore,
                datStore,
                configStore,
                tradingStore,
                multicallService,
                blockchainStore,
                transactionStore
            } = this.rootStore;

            library.eth
                .getBlockNumber()
                .then((blockNumber) => {
                    const lastCheckedBlock = providerStore.getCurrentBlockNumber();

                    // console.debug('[Fetch Loop] Staleness Evaluation', {
                    //     blockNumber,
                    //     lastCheckedBlock,
                    //     forceFetch,
                    //     account: web3React.account,
                    //     doFetch: blockNumber !== lastCheckedBlock || forceFetch,
                    // });

                    const doFetch =
                        blockNumber !== lastCheckedBlock || accountSwitched;

                    if (doFetch) {
                        console.debug('[Fetch Loop] Fetch Blockchain Data', {
                            blockNumber,
                            account,
                        });

                        // Set block number
                        providerStore.setCurrentBlockNumber(blockNumber);

                        if (accountSwitched) {
                            tradingStore.resetTransactionStates();
                        }

                        // Get global blockchain data
                        multicallService.addCall({
                            contractType: ContractType.ERC20,
                            address: configStore.activeDatAddress,
                            method: 'totalSupply',
                            params: [],
                        });

                        // Get user-specific blockchain data
                        if (account) {
                            transactionStore.checkPendingTransactions(web3React, account);

                            multicallService.addCall({
                                contractType: ContractType.Multicall,
                                address: configStore.getMulticallAddress(),
                                method: 'getEthBalance',
                                params: [account],
                            });

                            multicallService.addCall({
                                contractType: ContractType.ERC20,
                                address: configStore.activeDatAddress,
                                method: 'balanceOf',
                                params: [account],
                            });

                            multicallService.addCall({
                                contractType: ContractType.ERC20,
                                address: configStore.activeDatAddress,
                                method: 'allowance',
                                params: [account, configStore.activeDatAddress],
                            });
                        }

                        datStore
                            .fetchRecentTrades(configStore.activeDatAddress, 10)
                            .then((trades) => {
                                tradingStore.setRecentTrades(trades);
                            });

                        if (
                            !datStore.areAllStaticParamsLoaded(
                                configStore.activeDatAddress
                            )
                        ) {
                            multicallService.addCalls(
                                datStore.genStaticParamCalls(
                                    configStore.activeDatAddress
                                )
                            );
                        }

                        const baseDatCall = {
                            contractType:
                                ContractType.DecentralizedAutonomousTrust,
                            address: configStore.activeDatAddress,
                        };

                        multicallService.addCalls([
                            {
                                ...baseDatCall,
                                method: 'state',
                            },
                            {
                                ...baseDatCall,
                                method: 'buybackReserve',
                            },
                            {
                                ...baseDatCall,
                                method: 'minInvestment',
                            },
                        ]);

                        const calls = multicallService.activeCalls;
                        const rawCalls = multicallService.activeCallsRaw;

                        multicallService
                            .executeCalls(calls, rawCalls)
                            .then(async (response) => {
                                const {
                                    calls,
                                    results,
                                    blockNumber,
                                } = response;
                                const updates = blockchainStore.reduceMulticall(
                                    calls,
                                    results,
                                    blockNumber
                                );
                                blockchainStore.updateStore(updates, blockNumber);

                                if (datStore.areAllStaticParamsLoaded(configStore.activeDatAddress)) {
                                    this.refreshBuyFormPreview();
                                }
                            })
                            .catch((e) => {
                                // TODO: Retry on failure, unless stale.
                                console.error(e);
                            });

                            multicallService.resetActiveCalls();
                    }
                })
                .catch((error) => {
                    console.error('[Fetch Loop Failure]', {
                        web3React,
                        providerStore,
                        forceFetch: accountSwitched,
                        chainId,
                        account,
                        library,
                        error,
                    });
                    providerStore.setCurrentBlockNumber(undefined);
                });
        }
    }
}
