import { Interface } from 'ethers/utils';
import RootStore from '../../stores/Root';
import { ContractType } from '../../stores/Provider';

export interface Call {
    contractType: string;
    address: string;
    method: string;
    params: any[];
}

// contractType-address-function(a,b)-[params]

export default class MulticallService {
    root: RootStore;

    activeCalls: Call[];
    activeCallsRaw: any[];

    constructor(root: RootStore) {
        this.root = root;
        this.resetActiveCalls();
    }

    // Add call additions and removals
    async executeActiveCalls() {
        const { abiService, providerStore, configStore } = this.root;
        const multi = providerStore.getContract(
            providerStore.getActiveWeb3React(),
            ContractType.Multicall,
            configStore.getMulticallAddress()
        );

        const response = await multi.methods
            .aggregate(this.activeCallsRaw)
            .call();
        return {
            calls: this.activeCalls,
            results: response.returnData,
            blockNumber: response.blockNumber,
        };
    }

    addCall(call: Call) {
            this.addContractCall(call);
    }

    private addContractCall(call: Call) {
        const { abiService } = this.root;
        const iface = new Interface(abiService.getAbi(call.contractType));
        const encoded = iface.functions[call.method].encode(call.params);
        this.activeCallsRaw.push([call.address, encoded]);
        this.activeCalls.push(call);
    }

    decodeCall(call: Call, result: any) {
        const { abiService } = this.root;
        const iface = new Interface(abiService.getAbi(call.contractType));
        return iface.functions[call.method].decode(result);
    }

    resetActiveCalls() {
        this.activeCalls = [] as Call[];
        this.activeCallsRaw = [] as any[];
    }
}
