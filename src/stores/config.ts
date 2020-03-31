import RootStore from 'stores/Root';
import { BigNumber } from '../utils/bignumber';
import { ContractTypes } from './Provider';
import { parseEther } from 'ethers/utils';
import { action } from 'mobx';
import { bnum } from '../utils/helpers';

export default class ConfigStore {
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

}
