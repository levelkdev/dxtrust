import { action, observable } from 'mobx';
import RootStore from 'stores/Root';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { supportedChainId } from '../provider/connectors';

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
                        datStore
                            .fetchRecentTrades(configStore.activeDatAddress, 10)
                            .then((trades) => {
                                tradingStore.setRecentTrades(trades);
                            });

                        datStore
                            .fetchMinInvestment(configStore.activeDatAddress)
                            .then((minInvestment) => {
                                datStore.setMinInvestment(
                                    configStore.activeDatAddress,
                                    minInvestment
                                );
                            })
                            .then(() => {
                                datStore
                                    .fetchPrice(configStore.activeDatAddress)
                                    .then((price) => {
                                        tradingStore.setPrice(price);
                                    });
                            });

                        // Get user-specific blockchain data
                        if (account) {
                            tokenStore.fetchTokenBalances(web3React, account, [
                                'ether',
                                configStore.getDXDTokenAddress(),
                            ]);

                            tokenStore.fetchAccountApprovals(
                                web3React,
                                ['ether', configStore.getDXDTokenAddress()],
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
