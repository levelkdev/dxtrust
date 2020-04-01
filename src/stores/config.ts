import RootStore from 'stores/Root';
import { StringMap } from '../types';
import * as config from 'config.json';

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
        this.tokens['DXD'] = config.deployed.DXD;
        this.tokens['Collateral'] = config.deployed.Collateral;
        this.activeDatAddress = config.deployed.DAT;
    }
}
