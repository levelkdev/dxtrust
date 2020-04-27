import RootStore from 'stores/Root';
import { StringMap } from '../types';
import { contracts } from '../config/contracts.json';
import { CHAIN_NAME_BY_ID, DEFAULT_ETH_CHAIN_ID } from '../provider/connectors';

export default class ConfigStore {
    rootStore: RootStore;
    multicall: string;
    activeDatAddress: string;
    network: string;
    DAIinfo: object;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }
    
    getActiveChainName() {
      const activeWeb3 = this.rootStore.providerStore.getActiveWeb3React();
      return CHAIN_NAME_BY_ID[(activeWeb3) ? activeWeb3.chainId : DEFAULT_ETH_CHAIN_ID];
    }
    
    getTokenAddress(tokenType) {
      return contracts[this.getActiveChainName()].DAT;
    }

    getMulticallAddress() {
      return contracts[this.getActiveChainName()].multicall;
    }

    getDXDTokenAddress() {
      return contracts[this.getActiveChainName()].DAT;
    }

    getCollateralTokenAddress() {
        return contracts[this.getActiveChainName()].DATinfo.collateralType;
    }
    
    getCollateralType() {
        return contracts[this.getActiveChainName()].DATinfo.collateralType;
    }
    
    getDATinfo() {
        return contracts[this.getActiveChainName()].DATinfo;
    }
}
