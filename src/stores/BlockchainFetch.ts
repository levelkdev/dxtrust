import { action, observable } from 'mobx';
import RootStore from 'stores/Root';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { isChainIdSupported } from '../provider/connectors';
import { validateTokenValue, ValidationStatus } from '../utils/validators';
import { denormalizeBalance, normalizeBalance } from '../utils/token';
import { ContractType } from './Provider';
import { TransactionState } from './TradingForm';

export default class BlockchainFetchStore {
    @observable activeFetchLoop: any;
    @observable initialLoadComplete: boolean;
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @action async refreshBuyFormPreview() {
        const { datStore, tradingStore } = this.rootStore;
        const minValue = normalizeBalance(
            datStore.getMinInvestment()
        );

        if (
            validateTokenValue(tradingStore.buyAmount, {
                minValue,
            }) === ValidationStatus.VALID
        ) {
            const weiValue = denormalizeBalance(tradingStore.buyAmount);

            const buyReturn = await datStore.fetchBuyReturn(weiValue);
            tradingStore.handleBuyReturn(buyReturn);
        }
    }

    @action setFetchLoop(
        web3React: Web3ReactContextInterface,
        accountSwitched?: boolean
    ) {
        if (web3React && web3React.active && isChainIdSupported(web3React.chainId)) {
            const { library, account, chainId } = web3React;
            const {
                providerStore,
                datStore,
                configStore,
                tradingStore,
                multicallService,
                blockchainStore,
                tokenStore,
                transactionStore
            } = this.rootStore;

            const activeDATAddress = configStore.getTokenAddress();
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
                            chainId
                        });

                        // Set block number
                        providerStore.setCurrentBlockNumber(blockNumber);

                        if (accountSwitched) {
                            tradingStore.resetTransactionStates();
                        }

                        // Get global blockchain data
                        multicallService.addCall({
                            contractType: ContractType.ERC20,
                            address: activeDATAddress,
                            method: 'totalSupply',
                            params: [],
                        });
                        
                        multicallService.addCall({
                            contractType: ContractType.DecentralizedAutonomousTrust,
                            address: activeDATAddress,
                            method: 'burnedSupply',
                            params: [],
                        });

                        // Get user-specific blockchain data
                        if (account) {
                            transactionStore.checkPendingTransactions(
                                web3React,
                                account
                            );

                            multicallService.addCall({
                                contractType: ContractType.Multicall,
                                address: configStore.getMulticallAddress(),
                                method: 'getEthBalance',
                                params: [account],
                            });

                            multicallService.addCall({
                                contractType: ContractType.ERC20,
                                address: activeDATAddress,
                                method: 'balanceOf',
                                params: [account],
                            });

                            multicallService.addCall({
                                contractType: ContractType.ERC20,
                                address: activeDATAddress,
                                method: 'allowance',
                                params: [account, activeDATAddress],
                            });
                        }

                        datStore
                            .fetchRecentTrades(10)
                            .then((trades) => {
                                tradingStore.setRecentTrades(trades);
                            })
                            .catch((e) => {
                                // TODO: Retry on failure, unless stale.
                                console.error(e);
                            });

                        if ( !datStore.areAllStaticParamsLoaded() ) {
                            multicallService.addCalls(
                                datStore.genStaticParamCalls()
                            );
                        }

                        const baseDatCall = {
                            contractType:
                                ContractType.DecentralizedAutonomousTrust,
                            address: activeDATAddress,
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
                                blockchainStore.updateStore(
                                    updates,
                                    blockNumber
                                );

                                // Check max approval if (1. We have an account  && 2 . We have max approval) && (3. We are in the initial load 4. || We are on an account switch call)
                                const hasMaxApproval = account && tokenStore.hasMaxApproval(configStore.getTokenAddress(), account, activeDATAddress);
                                const setEnableDXDState = !this.initialLoadComplete || accountSwitched;
                                
                                if (hasMaxApproval && setEnableDXDState) {
                                    tradingStore.setEnableDXDState(TransactionState.APPROVED);
                                }

                                if (datStore.areAllStaticParamsLoaded()) {
                                    this.refreshBuyFormPreview();
                                }
                            })
                            .catch((e) => {
                                // TODO: Retry on failure, unless stale.
                                console.error(e);
                            });

                            if (!this.initialLoadComplete) {
                                this.initialLoadComplete = true;
                            }
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
