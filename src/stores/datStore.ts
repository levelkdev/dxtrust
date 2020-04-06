import RootStore from 'stores/Root';
import { BigNumber } from '../utils/bignumber';
import { ContractTypes } from './Provider';
import { action, observable } from 'mobx';
import { bnum } from '../utils/helpers';
import PromiEvent from 'promievent';
import { BigNumberCached } from '../services/blockchainReader';

export enum EventType {
    Buy = 'Buy',
    Sell = 'Sell',
}

export interface BuyEvent {
    price: BigNumber;
    amount: BigNumber;
    totalPaid: BigNumber;
    blockNumber: number;
    blockTime: string;
    type: EventType;
    hash: string;
}

export interface SellEvent {
    price: BigNumber;
    amount: BigNumber;
    totalReceived: BigNumber;
    blockNumber: number;
    blockTime: string;
    type: EventType;
    hash: string;
}

interface DatInfo {
    minInvestment?: BigNumber;
    currentPrice?: BigNumberCached;
    initReserve?: BigNumberCached;
    initGoal?: BigNumberCached;
    buySlopeNum?: BigNumberCached;
    buySlopeDen?: BigNumberCached;
}

interface DatInfoMap {
    [index: string]: DatInfo;
}

export interface BuyReturnCached {
    value: BuyReturn;
    blockNumber: number;
}

export interface SellReturnCached {
    value: SellReturn;
    blockNumber: number;
}

export interface BuyReturn {
    tokensIssued: BigNumber;
    totalPaid: BigNumber;
    pricePerToken: BigNumber;
}

export interface SellReturn {
    tokensSold: BigNumber;
    currencyReturned: BigNumber;
    returnPerToken: BigNumber;
}

export type TradeEvent = BuyEvent | SellEvent;

export default class DatStore {
    @observable datParams: DatInfoMap;
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.datParams = {} as DatInfoMap;
    }
    @action setDatParams(datAddress: string, updated: DatInfo) {
        if (!this.datParams[datAddress]) {
            this.datParams[datAddress] = {};
        }

        this.datParams[datAddress] = {
            ...this.datParams[datAddress],
            ...updated,
        };
    }

    @action updatePrice(datAddress: string, newPrice: BigNumberCached) {
        const { providerStore } = this.rootStore;
        const hasExistingValue =
            this.datParams[datAddress] &&
            this.datParams[datAddress].currentPrice;

        // Don't update if stale
        if (
            hasExistingValue &&
            providerStore.isFresher(
                newPrice.blockNumber,
                this.datParams[datAddress].currentPrice.blockNumber
            )
        ) {
            this.setDatParams(datAddress, {
                currentPrice: newPrice,
            });
        } else if (!hasExistingValue) {
            this.setDatParams(datAddress, {
                currentPrice: newPrice,
            });
        }
    }

    private getDatContract(datAddress: string) {
        const { providerStore } = this.rootStore;
        return providerStore.getContract(
            providerStore.getActiveWeb3React(),
            ContractTypes.DecentralizedAutonomousTrust,
            datAddress
        );
    }

    getMinInvestment(datAddress: string): BigNumber | undefined {
        if (
            this.datParams[datAddress] &&
            this.datParams[datAddress].minInvestment
        ) {
            return this.datParams[datAddress].minInvestment;
        } else {
            return undefined;
        }
    }

    areAllStaticParamsLoaded(datAddress: string): boolean {
        return (
            !!this.datParams[datAddress] &&
            !!this.datParams[datAddress].minInvestment &&
            !!this.datParams[datAddress].initGoal &&
            !!this.datParams[datAddress].initReserve &&
            !!this.datParams[datAddress].buySlopeNum &&
            !!this.datParams[datAddress].buySlopeDen
        );
    }

    getBuySlopeNum(datAddress: string) {
        return this.datParams[datAddress].buySlopeNum.value;
    }

    getBuySlopeDen(datAddress: string) {
        return this.datParams[datAddress].buySlopeDen.value;
    }

    getInitGoal(datAddress: string) {
        return this.datParams[datAddress].initGoal.value;
    }

    getInitReserve(datAddress: string) {
        return this.datParams[datAddress].initReserve.value;
    }

    async fetchStaticParams(datAddress: string) {
        const { providerStore } = this.rootStore;

        const fetchBlock = providerStore.getCurrentBlockNumber();
        this.fetchInitReserve(datAddress).then((initReserve) => {
            console.log('initReserve', initReserve.toString());
            this.setDatParams(datAddress, {
                initReserve: {
                    value: initReserve,
                    blockNumber: fetchBlock,
                },
            });
        });
        this.fetchInitGoal(datAddress).then((initGoal) => {
            console.log('initGoal', initGoal.toString());
            this.setDatParams(datAddress, {
                initGoal: {
                    value: initGoal,
                    blockNumber: fetchBlock,
                },
            });
        });
        this.fetchBuySlopeNum(datAddress).then((buySlopeNum) => {
            console.log('buySlopeNum', buySlopeNum.toString());
            this.setDatParams(datAddress, {
                buySlopeNum: {
                    value: buySlopeNum,
                    blockNumber: fetchBlock,
                },
            });
        });
        this.fetchBuySlopeDen(datAddress).then((buySlopeDen) => {
            console.log('buySlopeDen', buySlopeDen.toString());
            this.setDatParams(datAddress, {
                buySlopeDen: {
                    value: buySlopeDen,
                    blockNumber: fetchBlock,
                },
            });
        });
    }

    async fetchInitReserve(datAddress: string): Promise<BigNumber> {
        const dat = this.getDatContract(datAddress);
        return bnum(await dat.methods.initReserve().call());
    }

    async fetchInitGoal(datAddress: string): Promise<BigNumber> {
        const dat = this.getDatContract(datAddress);
        return bnum(await dat.methods.initGoal().call());
    }

    async fetchBuySlopeNum(datAddress: string): Promise<BigNumber> {
        const dat = this.getDatContract(datAddress);
        return bnum(await dat.methods.buySlopeNum().call());
    }

    async fetchBuySlopeDen(datAddress: string): Promise<BigNumber> {
        const dat = this.getDatContract(datAddress);
        return bnum(await dat.methods.buySlopeDen().call());
    }

    async fetchMinInvestment(datAddress: string): Promise<BigNumber> {
        const dat = this.getDatContract(datAddress);
        return bnum(await dat.methods.minInvestment().call());
    }

    @action setMinInvestment(datAddress: string, minInvestment: BigNumber) {
        if (this.datParams[datAddress]) {
            this.datParams[datAddress].minInvestment = minInvestment;
        } else {
            this.datParams[datAddress] = {
                minInvestment: minInvestment,
            };
        }
    }

    async estimateBuyValue(
        datAddress: string,
        currencyValue: BigNumber
    ): Promise<BigNumber> {
        const dat = this.getDatContract(datAddress);
        return bnum(
            await dat.methods.estimateBuyValue(currencyValue.toString()).call()
        );
    }

    async estimateSellValue(
        datAddress: string,
        quantityToSell: BigNumber
    ): Promise<BigNumber> {
        const dat = this.getDatContract(datAddress);
        return bnum(
            await dat.methods
                .estimateSellValue(quantityToSell.toString())
                .call()
        );
    }

    async fetchBuyEvents(
        datAddress: string,
        numToGet: number
    ): Promise<TradeEvent[]> {
        const dat = this.getDatContract(datAddress);

        let buyEvents = await dat.getPastEvents('Buy', {
            fromBlock: 0,
            toBlock: 'latest',
        });

        buyEvents.reverse();
        buyEvents = buyEvents.slice(0, numToGet);

        return Promise.all(
            buyEvents.map((buyEvent) => {
                if (this.isBuyEventValid(buyEvent)) {
                    return this.parseBuyEvent(buyEvent);
                }
            })
        );
    }

    async fetchSellEvents(
        datAddress: string,
        numToGet: number
    ): Promise<TradeEvent[]> {
        const dat = this.getDatContract(datAddress);

        let sellEvents = await dat.getPastEvents('Sell', {
            fromBlock: 0,
            toBlock: 'latest',
        });

        sellEvents.reverse();
        sellEvents = sellEvents.slice(0, numToGet);

        return Promise.all(
            sellEvents.map((sellEvent) => {
                if (this.isSellEventValid(sellEvent)) {
                    return this.parseSellEvent(sellEvent);
                }
            })
        );
    }

    async parseBuyEvent(buyEvent) {
        console.log(buyEvent);
        const amount = bnum(buyEvent.returnValues._fairValue);
        const totalPrice = bnum(buyEvent.returnValues._currencyValue);

        const blockTime = await this.rootStore.providerStore.getBlockTime(
            buyEvent.blockNumber
        );

        const event: BuyEvent = {
            price: totalPrice.div(amount),
            amount: amount,
            totalPaid: totalPrice,
            blockNumber: buyEvent.blockNumber,
            blockTime: blockTime,
            type: EventType.Buy,
            hash: 'https://kovan.etherscan.io/tx/' + buyEvent.transactionHash,
        };

        return event;
    }

    // format sell event
    async parseSellEvent(sellEvent) {
        console.log(sellEvent);
        const amount = bnum(sellEvent.returnValues._fairValue);
        const totalReceived = bnum(sellEvent.returnValues._currencyValue);

        const blockTime = await this.rootStore.providerStore.getBlockTime(
            sellEvent.blockNumber
        );

        const event: SellEvent = {
            price: totalReceived.div(amount),
            amount: amount,
            totalReceived: totalReceived,
            blockNumber: sellEvent.blockNumber,
            blockTime: blockTime,
            type: EventType.Sell,
            hash: 'https://kovan.etherscan.io/tx/' + sellEvent.transactionHash,
        };

        return event;
    }

    isBuyEventValid(buyEvent) {
        return (
            !!buyEvent.returnValues &&
            buyEvent.returnValues._fairValue &&
            !!buyEvent.returnValues._currencyValue
        );
    }

    isSellEventValid(sellEvent) {
        return (
            !!sellEvent.returnValues &&
            sellEvent.returnValues._fairValue &&
            !!sellEvent.returnValues._currencyValue
        );
    }

    async fetchBuyReturn(
        datAddress: string,
        totalPaid: BigNumber
    ): Promise<BuyReturnCached> {
        const blockNumber = this.rootStore.providerStore.getCurrentBlockNumber();

        const tokensIssued = await this.estimateBuyValue(datAddress, totalPaid);
        const pricePerToken = totalPaid.div(tokensIssued);

        return {
            value: {
                totalPaid,
                tokensIssued,
                pricePerToken,
            },
            blockNumber,
        };
    }

    async fetchSellReturn(
        datAddress: string,
        tokensSold: BigNumber
    ): Promise<SellReturnCached> {
        const blockNumber = this.rootStore.providerStore.getCurrentBlockNumber();

        const currencyReturned = await this.estimateSellValue(
            datAddress,
            tokensSold
        );

        const returnPerToken = currencyReturned.div(tokensSold);

        return {
            value: {
                tokensSold,
                currencyReturned,
                returnPerToken,
            },
            blockNumber,
        };
    }

    async fetchSpotPrice(datAddress: string): Promise<BigNumber> {
        console.log('spotTokens');

        const minInvestment = this.getMinInvestment(datAddress);
        const spotTokens = await this.estimateBuyValue(
            datAddress,
            minInvestment
        );
        const price = minInvestment.div(spotTokens);
        console.log('spotTokens', spotTokens.toString());
        console.log('price', price.toString());
        return price;
    }

    // getRecentTrades(numberOfTrades)
    async fetchRecentTrades(
        datAddress: string,
        numToGet: number
    ): Promise<TradeEvent[]> {
        const buyEvents = await this.fetchBuyEvents(datAddress, numToGet);
        const sellEvents = await this.fetchSellEvents(datAddress, numToGet);

        let combinedTrades: any[] = buyEvents.concat(sellEvents);
        combinedTrades = combinedTrades.sort(function (a, b) {
            return b.blockNumber - a.blockNumber;
        });

        return combinedTrades.slice(0, numToGet);
    }

    // TODO: Return status on failure
    @action buy(
        datAddress: string,
        to: string,
        currencyValue: BigNumber,
        minTokensBought: BigNumber
    ): PromiEvent<any> {
        console.log('buyParams', {
            datAddress,
            to,
            currencyValue: currencyValue.toString(),
            minTokensBought: minTokensBought.toString(),
        });

        const { providerStore } = this.rootStore;

        return providerStore.sendTransaction(
            providerStore.getActiveWeb3React(),
            ContractTypes.DecentralizedAutonomousTrust,
            datAddress,
            'buy',
            [to, currencyValue.toString(), minTokensBought.toString()],
            { value: currencyValue.toString() }
        );
    }

    //TODO: Return status on failure
    @action sell(
        datAddress: string,
        to: string,
        quantityToSell: BigNumber,
        minCurrencyReturned: BigNumber
    ) {
        const { providerStore } = this.rootStore;

        return providerStore.sendTransaction(
            providerStore.getActiveWeb3React(),
            ContractTypes.DecentralizedAutonomousTrust,
            datAddress,
            'sell',
            [to, quantityToSell.toString(), minCurrencyReturned.toString()]
        );
    }
}
