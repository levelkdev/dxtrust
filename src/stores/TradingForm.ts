import { action, observable } from 'mobx';
import { buyStartState } from '../config.json';
import RootStore from './Root';
import Web3 from 'web3';
import { TradeEvent } from './datStore';

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
    CONFIRMED
}

class TradingFormStore {
    @observable reserveBalance = '';
    @observable price = 0;

    @observable enableTKNState = buyStartState;
    @observable buyingState = TransactionState.NONE;
    @observable buyAmount = 0;
    @observable priceToBuy = 0;

    @observable enableDXDState = TransactionState.NONE;
    @observable sellingState = TransactionState.NONE;
    @observable sellAmount = 0;
    @observable rewardForSell = 0;

    @observable bondedTokenBalance = 0;
    @observable bondedTokenPrice = 0;

    @observable recentTrades = [];
    @observable recentTradesSet = false;
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    // setPrice()
    async setPrice() {
        // const price = await this.getPriceToBuy('1');
        this.price = 0;
    }

    // setBuyAmount()
    setBuyAmount(buyAmount) {
        // TODO: Async get the price to buy
        // this.setPriceToBuy(buyAmount);
        this.buyAmount = buyAmount;
    }

    // setSellAmount()
    setSellAmount(sellAmount) {
        // TODO: Async get the reward to sell
        // this.setRewardForSell(sellAmount);
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

    async validateCollateralAllowance(allowance) {
        if (allowance > 40000) {
            this.enableTKNState = 4;
        }
    }

    async validateBondedTokenAllowance(allowance) {
        if (allowance > 40000) {
            this.enableDXDState = 4;
        }
    }

    // // TODO Separate ERC20 version from ETH version
    // // Enable Collateral Token (ERC20 Version)
    // @action enableCollateral = async () => {
    //     this.enableTKNState = 1;
    //     const contract = this.loadCollateralTokenContract();
    //     const spender = deployed.BondingCurve;
    //
    //     try {
    //         // TODO Revisit what number to approve
    //         await contract.methods
    //             .approve(spender, 4000000)
    //             .send()
    //             .on('transactionHash', function (hash) {
    //                 this.rootStore.providerStore.checkConfirmation(
    //                     hash,
    //                     ConfirmationFlags.ENABLE_TKN
    //                 );
    //             });
    //
    //         // Debugging; TODO remove debugging
    //         const x = await contract.methods
    //             .allowance(this.rootStore.providerStore.address, spender)
    //             .call();
    //         console.log(
    //             'approve initiated; allowance is ' +
    //                 x.toString() +
    //                 ' enable state: ' +
    //                 this.enableTKNState
    //         );
    //
    //         this.enableTKNState = 2;
    //     } catch (e) {
    //         // TODO set up logging
    //         console.log(e);
    //     }
    // };
    //
    // // Enable DXD
    // // @action enable = async
    // @action enableDXD = async () => {
    //     this.enableDXDState = 1;
    //     const contract = this.loadBondedTokenContract();
    //     const spender = deployed.BondingCurve;
    //
    //     try {
    //         // TODO Revisit what number to approve
    //         await contract.methods
    //             .approve(spender, 4000000)
    //             .send()
    //             .on('transactionHash', function (hash) {
    //                 this.rootStore.providerStore.checkConfirmation(
    //                     hash,
    //                     ConfirmationFlags.ENABLE_DXD
    //                 );
    //             });
    //
    //         this.enableDXDState = 2;
    //     } catch (e) {
    //         // TODO set up logging
    //         console.log(e);
    //     }
    // };
    //
    // @action buy = () => {
    //     if (collateralType === 'ETH') {
    //         this.ETHBuy();
    //     } else {
    //         this.ERC20Buy();
    //     }
    // };
    //
    // @action sell = () => {
    //     if (collateralType === 'ETH') {
    //         this.ETHSell();
    //     } else {
    //         this.ERC20Sell();
    //     }
    // };
    //
    // // buy(uint256 numTokens, uint256 maxPrice, address recipient)
    // @action ERC20Buy = async () => {
    //     const contract = this.loadBondingCurveContract();
    //     const recipient = this.rootStore.providerStore.address;
    //     // TODO figure out how to set maxPrice
    //     const maxPrice = 1000;
    //
    //     try {
    //         await contract.methods
    //             .buy(this.buyAmount, maxPrice, recipient)
    //             .send()
    //             .on('transactionHash', function (hash) {
    //                 this.rootStore.providerStore.checkConfirmation(
    //                     hash,
    //                     ConfirmationFlags.DEPOSIT_TKN
    //                 );
    //             });
    //         console.log('buy executed for ' + this.buyAmount);
    //         this.getReserveBalance();
    //         this.buyingState = 2;
    //     } catch (e) {
    //         // TODO set up logging
    //         console.log(e);
    //     }
    // };
    //
    // // sell(uint256 numTokens, uint256 minPrice, address recipient)
    // @action ERC20Sell = async () => {
    //     const contract = this.loadBondingCurveContract();
    //     const recipient = this.rootStore.providerStore.address;
    //     // TODO figure out how to set minPrice
    //     const minPrice = 0;
    //
    //     try {
    //         await contract.methods
    //             .sell(this.sellAmount, minPrice, recipient)
    //             .send()
    //             .on('transactionHash', function (hash) {
    //                 this.rootStore.providerStore.checkConfirmation(
    //                     hash,
    //                     ConfirmationFlags.SELL_DXD
    //                 );
    //             });
    //         console.log('sell executed for ' + this.sellAmount);
    //         // TODO figure out how to be polling for updates to displayed values
    //         this.getReserveBalance();
    //         this.sellingState = 2;
    //     } catch (e) {
    //         // TODO set up logging
    //         console.log(e);
    //     }
    // };
    //
    // // buy(uint256 numTokens, uint256 maxPrice, address recipient)
    // @action ETHBuy = async () => {
    //     const contract = this.loadBondingCurveEtherContract();
    //     const recipient = this.rootStore.providerStore.address;
    //     try {
    //         const weiPriceToBuy = Web3.utils.toWei(this.priceToBuy);
    //         const weiBuyAmount = Web3.utils.toWei(this.buyAmount);
    //         console.log('weiPriceToBuy is: ' + weiPriceToBuy);
    //         console.log('weiBuyAmount is: ' + weiBuyAmount);
    //         await contract.methods
    //             .buy(weiBuyAmount, weiPriceToBuy, recipient)
    //             .send({ from: recipient, value: weiPriceToBuy })
    //             .on('transactionHash', function (hash) {
    //                 this.rootStore.providerStore.checkConfirmation(
    //                     hash,
    //                     ConfirmationFlags.DEPOSIT_TKN
    //                 );
    //             });
    //         console.log('buy executed for ' + this.buyAmount);
    //         // TODO Don't think this reserve balance update is required?
    //         // this.getReserveBalance()
    //         this.buyingState = 2;
    //     } catch (e) {
    //         // TODO set up logging
    //         console.log(e);
    //     }
    // };
    //
    // // sell(uint256 numTokens, uint256 minReturn, address recipient)
    // @action ETHSell = async () => {
    //     const contract = this.loadBondingCurveContract();
    //     const recipient = this.rootStore.providerStore.address;
    //     try {
    //         const weiRewardForSell = Web3.utils.toWei(this.rewardForSell);
    //         const weiSellAmount = Web3.utils.toWei(this.sellAmount);
    //         await contract.methods
    //             .sell(weiSellAmount, weiRewardForSell, recipient)
    //             .send()
    //             .on('transactionHash', function (hash) {
    //                 this.rootStore.providerStore.checkConfirmation(
    //                     hash,
    //                     ConfirmationFlags.SELL_DXD
    //                 );
    //             });
    //         console.log('sell executed for ' + this.sellAmount);
    //         // TODO Don't think this reserve balance update is required?
    //         // this.getReserveBalance()
    //         this.sellingState = 2;
    //     } catch (e) {
    //         // TODO set up logging
    //         console.log(e);
    //     }
    // };
}

export default TradingFormStore;
