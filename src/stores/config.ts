import RootStore from 'stores/Root';
import { StringMap } from '../types';
import { contracts } from '../config/contracts.json';

export default class ConfigStore {
    rootStore: RootStore;
    tokens: StringMap;
    activeDatAddress: string;
    network: string;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.tokens = {} as StringMap;
        const networks = {42: "kovan", 66: "develop"}
        this.network = networks[process.env.REACT_APP_SUPPORTED_NETWORK_ID];
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
    
    getCollateralType() {
        return contracts[this.network].DATinfo.collateralType;
    }

    parseMetadataFromJson() {
        this.tokens['DXD'] = contracts[this.network].DAT;
        this.tokens['Collateral'] = contracts[this.network].collateral;
        this.activeDatAddress = contracts[this.network].DAT;
    }
}
