import RootStore from 'stores/Root';
import { StringMap } from '../types';
import { contracts } from '../config/contracts.json';
import { ETH_NETWORK } from '../provider/connectors';

export default class ConfigStore {
    rootStore: RootStore;
    tokens: StringMap;
    multicall: string;
    activeDatAddress: string;
    network: string;
    DAIinfo: object;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.tokens = {} as StringMap;
        this.parseMetadataFromJson();
    }
    
    getTokenAddress(tokenType) {
        return this.tokens[tokenType];
    }

    getMulticallAddress() {
        return this.multicall;
    }

    getDXDTokenAddress() {
        return this.tokens['DXD'];
    }

    getCollateralTokenAddress() {
        return this.tokens['Collateral'];
    }
    
    getCollateralType() {
        return contracts[ETH_NETWORK].DATinfo.collateralType;
    }
    
    getDATinfo() {
        return contracts[ETH_NETWORK].DATinfo;
    }

    parseMetadataFromJson() {
        this.tokens['DXD'] = contracts[ETH_NETWORK].DAT;
        this.tokens['Collateral'] = contracts[ETH_NETWORK].collateral;
        this.multicall = contracts[ETH_NETWORK].multicall;
        this.activeDatAddress = contracts[ETH_NETWORK].DAT;
    }
}
