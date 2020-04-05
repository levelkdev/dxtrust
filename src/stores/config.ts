import RootStore from 'stores/Root';
import { StringMap } from '../types';
import * as config from '../blockchainInfo.json';

export default class ConfigStore {
    rootStore: RootStore;
    tokens: StringMap;
    activeDatAddress: string;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.tokens = {} as StringMap;
        this.parseMetadataFromJson();
    }

    getTokenAddress(tokenType) {
        return this.tokens[tokenType];
    }

    getDXDTokenAddress() {
        return this.tokens['DXD'];
    }

    getCollateralTokenAddress() {
        return this.tokens['Collateral'];
    }

    parseMetadataFromJson() {
        this.tokens['DXD'] = config.DAT;
        this.tokens['Collateral'] = config.collateral;
        this.activeDatAddress = config.DAT;
    }
}
