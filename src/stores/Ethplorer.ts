import { observable } from 'mobx';
import { TokenInfo, Holder } from '../types';

import RootStore from 'stores/Root';
import { getTokenInfo, getTopTokenHolders } from '../provider/ethplorer';

interface DefaultTokenInfo {
    holdersCount?: number;
}

export default class EthplorerStore {
    @observable tokenInfo: TokenInfo | DefaultTokenInfo = {};
    @observable holders: Holder[] = [];
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.getTokenInfo();
        this.getHolders(20);
    }

    private async getTokenInfo(): Promise<void> {
        this.tokenInfo = await getTokenInfo();
    }

    private async getHolders(limit: number): Promise<void> {
        this.holders = await getTopTokenHolders(limit);
    }
}
