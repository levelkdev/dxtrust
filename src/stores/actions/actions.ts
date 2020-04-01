import { Contract } from 'ethers';
import { TXEvents } from '../../types';
import { getErrorByCode, isKnownErrorCode } from './error';
import PromiEvent from 'promievent';

interface ActionRequest {
    contract: Contract;
    action: string;
    sender: string;
    data: any[];
    overrides: any;
}

export interface ActionResponse {
    contract: Contract;
    action: string;
    sender: string;
    data: object;
    txResponse: any | undefined;
    error: any | undefined;
}

const preLog = (params: ActionRequest) => {
    console.debug(`[@action start: ${params.action}]`, {
        contract: params.contract,
        action: params.action,
        sender: params.sender,
        data: params.data,
        overrides: params.overrides,
    });
};

const postLog = (result: ActionResponse) => {
    console.debug(`[@action end: ${result.action}]`, {
        contract: result.contract,
        action: result.action,
        sender: result.sender,
        data: result.data,
        result: result.txResponse,
        error: result.error,
    });
};

export const sendAction = (params: ActionRequest): PromiEvent<any> => {
    const { contract, action, sender, data, overrides } = params;
    preLog(params);

    const actionResponse: ActionResponse = {
        contract,
        action,
        sender,
        data,
        txResponse: undefined,
        error: undefined,
    };

    const promiEvent = new PromiEvent<any>((resolve, reject) => {
        contract.methods[action](...data)
            .send({ from: sender, ...overrides })
            .once('transactionHash', (hash) => {
                promiEvent.emit(TXEvents.TX_HASH, hash);
                console.log(TXEvents.TX_HASH, hash);
            })
            .once('receipt', (receipt) => {
                promiEvent.emit(TXEvents.RECEIPT, receipt);
                console.log(TXEvents.RECEIPT, receipt);
            })
            .once('confirmation', (confNumber, receipt) => {
                promiEvent.emit(TXEvents.CONFIRMATION, {
                    confNumber,
                    receipt,
                });
                console.log(TXEvents.CONFIRMATION, {
                    confNumber,
                    receipt,
                });
            })
            .on('error', (error) => {
                console.log(error.code);
                if (error.code && isKnownErrorCode(error.code)) {
                    promiEvent.emit(
                        TXEvents.TX_ERROR,
                        getErrorByCode(error.code)
                    );
                    console.log(TXEvents.TX_ERROR, getErrorByCode(error.code));
                } else {
                    promiEvent.emit(TXEvents.INVARIANT, error);
                    console.log(TXEvents.INVARIANT, error);
                }
            })
            .then((receipt) => {
                promiEvent.emit(TXEvents.FINALLY, receipt);
                console.log(TXEvents.FINALLY, receipt);
            })
            .catch((e) => {
                console.log('rejected, e');
            });
    });

    return promiEvent;
};
