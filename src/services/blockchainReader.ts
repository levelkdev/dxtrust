import { BigNumber } from '../utils/bignumber';

export interface BlockchainData {
    value: any;
    blockNumber: number;
}

export interface BigNumberCached {
    value: BigNumber;
    blockNumber: number;
}

export interface StringCached {
    value: string;
    blockNumber: number;
}
