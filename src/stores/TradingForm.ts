import { action, observable } from 'mobx';
import { buyStartState } from '../config.json';
import RootStore from './Root';
import { BuyReturnCached, TradeEvent } from './datStore';
import { BigNumber } from '../utils/bignumber';
import { bnum } from '../utils/helpers';
import { denormalizeBalance } from '../utils/token';

const ConfirmationFlags = {
    ENABLE_TKN: 'enable_TKN',
    DEPOSIT_TKN: 'deposit_TKN',
    ENABLE_DXD: 'enabled_DXD',
    SELL_DXD: 'sell_dxd',
};

export enum TransactionState {
    NONE,
    SIGNING_TX,
    UNCONFIRMED,
    CONFIRMED,
}

class TradingFormStore {
    @observable reserveBalance = '';
    @observable price: BigNumber = bnum(0);

    @observable enableTKNState = buyStartState;
    @observable buyingState = TransactionState.NONE;
    @observable buyAmount = '';
    @observable priceToBuy: BigNumber = bnum(0);

    @observable enableDXDState = TransactionState.NONE;
    @observable sellingState = TransactionState.NONE;
    @observable sellAmount = 0;
    @observable rewardForSell = 0;

    @observable bondedTokenBalance = 0;
    @observable bondedTokenPrice = 0;

    @observable payAmount: BigNumber = bnum(0);

    @observable recentTrades = [];
    @observable recentTradesSet = false;
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    setPayAmount(amount: BigNumber) {
        this.payAmount = amount;
    }

    // setPrice()
    setPrice(price: BigNumber) {
        this.price = price;
    }

    handleBuyReturn(buyReturn: BuyReturnCached) {
        const weiValue = denormalizeBalance(this.buyAmount);
        const inputValueFresh = buyReturn.value.totalPaid.eq(weiValue);
        if (
            this.rootStore.providerStore.isFresh(buyReturn.blockNumber) &&
            inputValueFresh
        ) {
            this.setPrice(buyReturn.value.pricePerToken);
            this.setPayAmount(buyReturn.value.tokensIssued);
        }
    }

    @action resetBuyForm() {
        this.buyAmount = '';
        this.buyingState = TransactionState.NONE;
        this.price = bnum(0);
        this.priceToBuy = bnum(0);
        this.payAmount = bnum(0);
    }

    @action setBuyingState(state: TransactionState) {
         this.buyingState = state;
    }

    // setBuyAmount()
    @action setBuyAmount(buyAmount) {
        this.buyAmount = buyAmount;
    }

    // setSellAmount()
    @action setSellAmount(sellAmount) {
        this.sellAmount = sellAmount;
    }

    formatNumber(number) {
        return Number(number).toFixed(3);
    }

    formatPrice() {
        return this.formatNumber(this.price);
    }

    formatPriceToBuy() {
        return this.formatNumber(this.priceToBuy);
    }

    formatRewardForSell() {
        return this.formatNumber(this.rewardForSell);
    }

    formatBuyAmount() {
        return this.formatNumber(this.buyAmount);
    }

    formatSellAmount() {
        return this.formatNumber(this.sellAmount);
    }

    // TODO look into how to pass this as a callback??
    // setEnableTKNStateConfirmed()
    setStateConfirmed(confirmationFlag) {
        if (confirmationFlag === ConfirmationFlags.ENABLE_TKN) {
            return (this.enableTKNState = 3);
        } else if (confirmationFlag === ConfirmationFlags.DEPOSIT_TKN) {
            return (this.buyingState = 3);
        } else if (confirmationFlag === ConfirmationFlags.ENABLE_DXD) {
            return (this.enableDXDState = 3);
        } else if (confirmationFlag === ConfirmationFlags.SELL_DXD) {
            return (this.sellingState = 3);
        }
    }

    @action setRecentTrades(trades: TradeEvent[]) {
        this.recentTrades = trades;
        this.recentTradesSet = true;
    }
}

export default TradingFormStore;
