import { action, observable } from 'mobx';
import RootStore from 'stores/Root';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { supportedChainId } from '../provider/connectors';
import { validateTokenValue, ValidationStatus } from '../utils/validators';
import { denormalizeBalance, normalizeBalance } from '../utils/token';
import { ContractType } from './Provider';
import blockchainStore from './BlockchainStore';

export default class BlockchainFetchStore {
    @observable activeFetchLoop: any;
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @action setFetchLoop(
        web3React: Web3ReactContextInterface,
        forceFetch?: boolean
    ) {
        if (web3React.active && web3React.chainId === supportedChainId) {
            const { library, account, chainId } = web3React;
            const {
                providerStore,
                datStore,
                configStore,
                tokenStore,
                tradingStore,
                multicallService,
                blockchainStore,
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
                        blockNumber !== lastCheckedBlock || forceFetch;

                    if (doFetch) {
                        console.debug('[Fetch Loop] Fetch Blockchain Data', {
                            blockNumber,
                            account,
                        });

                        // Set block number
                        providerStore.setCurrentBlockNumber(blockNumber);

                        // Get global blockchain data
                        multicallService.addCall({
                            contractType: ContractType.ERC20,
                            address: configStore.activeDatAddress,
                            method: 'totalSupply',
                            params: [],
                        });

                        // Get user-specific blockchain data
                        if (account) {
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

                        multicallService
                            .executeActiveCalls()
                            .then((response) => {
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
                                blockchainStore.updateStore(updates);
                                multicallService.resetActiveCalls();
                            })
                            .catch((e) => {
                                console.warn(e);
                                multicallService.resetActiveCalls();
                            });

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
                            datStore.fetchStaticParams(
                                configStore.activeDatAddress
                            );
                        }

                        datStore
                            .fetchState(configStore.activeDatAddress)
                            .then((state) =>
                                datStore.setDatInfo(
                                    configStore.activeDatAddress,
                                    {
                                        state: {
                                            value: state,
                                            blockNumber,
                                        },
                                    }
                                )
                            );

                        datStore
                            .fetchReserveBalance(configStore.activeDatAddress)
                            .then((reserveBalance) =>
                                datStore.setDatInfo(
                                    configStore.activeDatAddress,
                                    {
                                        reserveBalance: {
                                            value: reserveBalance,
                                            blockNumber,
                                        },
                                    }
                                )
                            );

                        datStore
                            .fetchMinInvestment(configStore.activeDatAddress)
                            .then((minInvestment) => {
                                datStore.setMinInvestment(
                                    configStore.activeDatAddress,
                                    minInvestment
                                );
                            })
                            .then(async () => {
                                const minValue = normalizeBalance(
                                    datStore.getMinInvestment(
                                        configStore.activeDatAddress
                                    )
                                );

                                if (
                                    validateTokenValue(tradingStore.buyAmount, {
                                        minValue,
                                    }) === ValidationStatus.VALID
                                ) {
                                    const weiValue = denormalizeBalance(
                                        tradingStore.buyAmount
                                    );

                                    const buyReturn = await datStore.fetchBuyReturn(
                                        configStore.activeDatAddress,
                                        weiValue
                                    );

                                    tradingStore.handleBuyReturn(buyReturn);
                                }
                            });

                        // Get user-specific blockchain data
                        if (account) {
                            tokenStore.fetchAccountApprovals(
                                web3React,
                                [configStore.getDXDTokenAddress()],
                                account,
                                configStore.activeDatAddress
                            );
                        }
                    }
                })
                .catch((error) => {
                    console.error('[Fetch Loop Failure]', {
                        web3React,
                        providerStore,
                        forceFetch,
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
