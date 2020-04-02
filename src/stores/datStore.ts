import RootStore from 'stores/Root';
import { BigNumber } from '../utils/bignumber';
import { ContractTypes } from './Provider';
import { action, observable } from 'mobx';
import { bnum } from '../utils/helpers';
import PromiEvent from 'promievent';

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

export type TradeEvent = BuyEvent | SellEvent;

export default class DatStore {
    @observable datParams;
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    /*
    We'll get the relevant stuff every block
    - reserve balance
    - fair supply

    We'll get certain things on-demand
    price to buy X tokens
    reward to sell X tokens

    (These are like the preview actions)

    // Set input value
    // Set loading
    // Fetch result
    // Set result (IF the input value is the same as it was - aka, not stale
    // Set not loading

    ## Data Fetching
    fetchPriceToBuy()
    fetchRewardToSell()
    fetchReserveBalance()
    fetchFAIRBalance()
    fetchFAIRSupply()
    fetchRecentTrades()

    ## Actions
    buy()
    sell()

    ## Data Access
    getPricePerToken()
    getReserveBalance()
    getFAIRBalance()
    getFAIRSupply()
    getRecentTrades()
     */

    async estimateBuyValue(
        datAddress: string,
        currencyValue: BigNumber
    ): Promise<BigNumber> {
        const { providerStore } = this.rootStore;
        const dat = providerStore.getContract(
            providerStore.getActiveWeb3React(),
            ContractTypes.DecentralizedAutonomousTrust,
            datAddress
        );
        return bnum(await dat.estimateBuyValue(currencyValue.toString()));
    }

    async estimateSellValue(
        datAddress: string,
        quantityToSell: BigNumber
    ): Promise<BigNumber> {
        const { providerStore } = this.rootStore;
        const dat = providerStore.getContract(
            providerStore.getActiveWeb3React(),
            ContractTypes.DecentralizedAutonomousTrust,
            datAddress
        );
        return bnum(await dat.estimateSellValue(quantityToSell.toString()));
    }

    async fetchBuyEvents(
        datAddress: string,
        numToGet: number
    ): Promise<TradeEvent[]> {
        const { providerStore } = this.rootStore;
        const contract = providerStore.getContract(
            providerStore.getActiveWeb3React(),
            ContractTypes.DecentralizedAutonomousTrust,
            datAddress
        );

        let buyEvents = await contract.getPastEvents('Buy', {
            fromBlock: 0,
            toBlock: 'latest',
        });

        buyEvents.reverse();
        buyEvents = buyEvents.slice(0, numToGet);

        return Promise.all(
            buyEvents.map((buyEvent) => this.parseBuyEvent(buyEvent))
        );
    }

    async fetchSellEvents(
        datAddress: string,
        numToGet: number
    ): Promise<TradeEvent[]> {
        const { providerStore } = this.rootStore;
        const contract = providerStore.getContract(
            providerStore.getActiveWeb3React(),
            ContractTypes.DecentralizedAutonomousTrust,
            datAddress
        );

        let sellEvents = await contract.getPastEvents('Sell', {
            fromBlock: 0,
            toBlock: 'latest',
        });

        sellEvents.reverse();
        sellEvents = sellEvents.slice(0, numToGet);

        return Promise.all(
            sellEvents.map((sellEvent) => this.parseSellEvent(sellEvent))
        );
    }

    async parseBuyEvent(buyEvent) {
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
    @action async sell(
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
