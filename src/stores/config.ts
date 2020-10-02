import RootStore from 'stores/Root';
import { StringMap } from '../types';
import { getConfig } from '../config/contracts';
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
      return CHAIN_NAME_BY_ID[(activeWeb3 && activeWeb3.chainId) ? activeWeb3.chainId : DEFAULT_ETH_CHAIN_ID];
    }
    
    getNetworkConfig() {
      return getConfig(this.getActiveChainName());
    }
    
    getTokenAddress() {
      return getConfig(this.getActiveChainName()).DAT;
    }

    getMulticallAddress() {
      return getConfig(this.getActiveChainName()).multicall;
    }
    
    getDATinfo() {
      return getConfig(this.getActiveChainName()).DATinfo;
    }
}
