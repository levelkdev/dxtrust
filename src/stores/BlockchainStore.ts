import RootStore from 'stores/Root';
import { Call } from '../services/multicall/MulticallService';
import { observable } from 'mobx';

export interface StoreEntry {
    contractType: string;
    address: string;
    method: string;
    params: any[];
}

export interface Entry {
    contractType: string;
    address: string;
    method: string;
    params: any[];
    value: any;
    lastFetched: number;
}

export default class BlockchainStore {
    @observable store: object;
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.store = {};
    }

    reduceMulticall(calls: Call[], results: any, blockNumber: number): Entry[] {
        const { multicallService } = this.rootStore;
        console.log(calls, results, blockNumber);
        return calls.map((call, index) => {
            const value = results[index];
            return {
                contractType: call.contractType,
                address: call.address,
                method: call.method,
                params: call.params,
                value: multicallService.decodeCall(call, results[index]),
                lastFetched: blockNumber,
            };
        });
    }

    has(entry: StoreEntry): boolean {
        return (
            !!this.store[entry.contractType] &&
            !!this.store[entry.contractType][entry.address] &&
            !!this.store[entry.contractType][entry.address][entry.method] &&
            !!this.store[entry.contractType][entry.address][entry.method][
                entry.params.toString()
            ]
        );
    }

    get(entry: StoreEntry): Entry | undefined {
        if (this.has(entry)) {
            return this.store[entry.contractType][entry.address][entry.method][
                entry.params.toString()
            ];
        } else {
            return undefined;
        }
    }

    updateStore(entries: Entry[]) {
        const update = {};

        entries.forEach((entry) => {
            if (!update[entry.contractType]) {
                update[entry.contractType] = {};
            }

            if (!update[entry.contractType][entry.address]) {
                update[entry.contractType][entry.address] = {};
            }

            if (!update[entry.contractType][entry.address][entry.method]) {
                update[entry.contractType][entry.address][entry.method] = {};
            }

            if (
                !update[entry.contractType][entry.address][entry.method][
                    entry.params.toString()
                ]
            ) {
                update[entry.contractType][entry.address][entry.method][
                    entry.params.toString()
                ] = {};
            }

            update[entry.contractType][entry.address][entry.method][
                entry.params.toString()
            ] = {
                value: entry.value,
                lastFetched: entry.lastFetched,
            };
        });

        this.store = {
            ...this.store,
            ...update,
        };
    }
}
