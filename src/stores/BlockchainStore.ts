import RootStore from 'stores/Root';
import { Call } from '../services/multicall/MulticallService';
import { action, observable } from 'mobx';

export interface StoreEntry {
    contractType: string;
    address: string;
    method: string;
    params?: any[];
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
        return calls.map((call, index) => {
            const value = multicallService.decodeCall(call, results[index]);
            return {
                contractType: call.contractType,
                address: call.address,
                method: call.method,
                params: call.params,
                value: value,
                lastFetched: blockNumber,
            };
        });
    }

    has(entry: StoreEntry): boolean {
        const params = entry.params ? entry.params : [];

        return (
            !!this.store[entry.contractType] &&
            !!this.store[entry.contractType][entry.address] &&
            !!this.store[entry.contractType][entry.address][entry.method] &&
            !!this.store[entry.contractType][entry.address][entry.method][
                params.toString()
            ]
        );
    }

    getCachedValue(entry: StoreEntry) {
        if (this.has(entry)) {
            return this.get(entry).value;
        } else {
            return undefined;
        }
    }

    get(entry: StoreEntry): Entry | undefined {
        if (this.has(entry)) {

            const params = entry.params ? entry.params : [];
            return this.store[entry.contractType][entry.address][entry.method][
                params.toString()
            ];
        } else {
            return undefined;
        }
    }

    // updateStore(entries: Entry[]) {
    //     const updated = {};
    //
    //     entries.forEach((entry) => {
    //         const params = entry.params ? entry.params : [];
    //         if (!updated[entry.contractType]) {
    //             updated[entry.contractType] = {};
    //         }
    //
    //         if (!updated[entry.contractType][entry.address]) {
    //             updated[entry.contractType][entry.address] = {};
    //         }
    //
    //         if (!updated[entry.contractType][entry.address][entry.method]) {
    //             updated[entry.contractType][entry.address][entry.method] = {};
    //         }
    //
    //         if (
    //             !updated[entry.contractType][entry.address][entry.method][
    //                 params.toString()
    //                 ]
    //         ) {
    //             updated[entry.contractType][entry.address][entry.method][
    //                 params.toString()
    //                 ] = {};
    //         }
    //
    //         updated[entry.contractType][entry.address][entry.method][
    //             params.toString()
    //             ] = {
    //             value: entry.value,
    //             lastFetched: entry.lastFetched,
    //         };
    //     });
    //
    //     console.log('prepare for update', {...this.store}, updated);
    //
    //     this.store = {
    //         ...this.store,
    //         ...updated
    //     };
    // }

    @action updateStore(entries: Entry[]) {
        entries.forEach((entry) => {
            const params = entry.params ? entry.params : [];
            if (!this.store[entry.contractType]) {
                this.store[entry.contractType] = {};
            }

            if (!this.store[entry.contractType][entry.address]) {
                this.store[entry.contractType][entry.address] = {};
            }

            if (!this.store[entry.contractType][entry.address][entry.method]) {
                this.store[entry.contractType][entry.address][entry.method] = {};
            }

            if (
                !this.store[entry.contractType][entry.address][entry.method][
                    params.toString()
                ]
            ) {
                this.store[entry.contractType][entry.address][entry.method][
                    params.toString()
                ] = {};
            }

            this.store[entry.contractType][entry.address][entry.method][
                params.toString()
            ] = {
                value: entry.value,
                lastFetched: entry.lastFetched,
            };
        });
    }
}
