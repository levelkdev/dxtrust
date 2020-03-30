import { observable, action } from 'mobx';
import { deployed, collateralType, buyStartState } from '../config.json';
import store from './Root';
import Web3 from 'web3';
import RootStore from './Root';

const ConfirmationFlags = {
    ENABLE_TKN: 'enable_TKN',
    DEPOSIT_TKN: 'deposit_TKN',
    ENABLE_DXD: 'enabled_DXD',
    SELL_DXD: 'sell_dxd',
};

class TradingStore {
    @observable reserveBalance = '';
    @observable price = 0;

    @observable enableTKNState = buyStartState;
    @observable buyingState = 0;
    @observable buyAmount = 0;
    @observable priceToBuy = 0;

    @observable enableDXDState = 0;
    @observable sellingState = 0;
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

    // getPriceToBuy(uint256 numTokens)
    async getPriceToBuy(numTokens) {
        const contract = this.loadBondingCurveContract();
        const weiInput = Web3.utils.toWei(numTokens);
        const weiPriceToBuy = await contract.methods
            .priceToBuy(weiInput)
            .call();
        const priceToBuy = Web3.utils.fromWei(weiPriceToBuy);
        return priceToBuy;
    }

    // getRewardForSell(uint256 numTokens)
    async getRewardForSell(numTokens) {
        const contract = this.loadBondingCurveContract();
        const weiInput = Web3.utils.toWei(numTokens);
        const weiRewardForSell = await contract.methods
            .rewardForSell(weiInput)
            .call();
        const rewardForSell = Web3.utils.fromWei(weiRewardForSell);
        return rewardForSell;
    }

    // setPriceToBuy(uint256 numTokens)
    async setPriceToBuy(numTokens) {
        const priceToBuy = await this.getPriceToBuy(numTokens);
        this.priceToBuy = priceToBuy;
    }

    // setRewardForSell(uint256 numTokens)
    async setRewardForSell(numTokens) {
        const rewardForSell = await this.getRewardForSell(numTokens);
        this.rewardForSell = rewardForSell;
    }

    // setPrice()
    async setPrice() {
        const price = await this.getPriceToBuy('1');
        this.price = price;
    }

    // getReserveBalance()
    async getReserveBalance() {
        const contract = this.loadBondingCurveContract();
        const reserveBalance = await contract.methods.reserveBalance().call();
        this.reserveBalance = reserveBalance;
    }

    // setBondedTokenBalance()
    async setBondedTokenBalance() {
        const contract = this.loadBondedTokenContract();
        const tokenBalance = await contract.methods
            .balanceOf(this.rootStore.providerStore.address)
            .call();
        this.bondedTokenBalance = tokenBalance;
    }

    // setBuyAmount()
    setBuyAmount(buyAmount) {
        this.setPriceToBuy(buyAmount);
        this.buyAmount = buyAmount;
    }

    // setSellAmount()
    setSellAmount(sellAmount) {
        this.setRewardForSell(sellAmount);
        this.sellAmount = sellAmount;
    }

    formatNumber(number) {
        return Number(number).toFixed(3);
    }

    formatBondedTokenBalance() {
        return this.formatNumber(
            Web3.utils.fromWei(this.bondedTokenBalance.toString())
        );
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

    async setRecentTrades(numToGet) {
        const trades = await this.getRecentTrades(numToGet);
        this.recentTrades = trades;
        this.recentTradesSet = true;
    }

    async setDappTradeData() {
        await this.setPrice();
        await this.rootStore.providerStore.setETHBalance();
        await this.setBondedTokenBalance();
        await this.getReserveBalance();
        this.setRecentTrades();
    }

    enableToken(tokenType) {
        if (tokenType === 'TKN') {
            this.enableCollateral();
        } else if (tokenType === 'DXD') {
            this.enableDXD();
        }
    }

    async checkCollateralAllowance() {
        const contract = this.loadCollateralTokenContract();
        const spender = deployed.BondingCurve;
        const allowance = await contract.methods
            .allowance(this.rootStore.providerStore.address, spender)
            .call();
        // TODO Think about what threshold to check
        if (allowance > 40000) {
            this.enableTKNState = 4;
        }
    }

    async checkBondedTokenAllowance() {
        const contract = this.loadBondedTokenContract();
        const spender = deployed.BondingCurve;
        const allowance = await contract.methods
            .allowance(this.rootStore.providerStore.address, spender)
            .call();
        // TODO Think about what threshold to check
        if (allowance > 40000) {
            this.enableDXDState = 4;
        }
    }

    // getSellEvents
    async getSellEvents(numToGet) {
        const contract = this.loadBondingCurveContract();
        var sellEvents = await contract.getPastEvents('Sell', {
            fromBlock: 0,
            toBlock: 'latest',
        });
        sellEvents = sellEvents.slice(0, numToGet);
        const parsedSellEvents = Promise.all(
            sellEvents.map((sellEvent) => this.formatSellEvent(sellEvent))
        );
        return parsedSellEvents;
    }

    // format sell event
    async formatSellEvent(sellEvent) {
        const container = {};
        const amount = Web3.utils.fromWei(sellEvent.returnValues.amount);
        const totalReceived = Web3.utils.fromWei(sellEvent.returnValues.reward);
        container.amount = this.formatNumber(amount);
        container.price = this.formatNumber(totalReceived / amount);
        container.totalReceived = this.formatNumber(totalReceived);
        container.blockNumber = sellEvent.blockNumber;
        container.blockTime = await this.rootStore.providerStore.getBlockTime(
            sellEvent.blockNumber
        );
        container.type = 'Sell';
        container.hash =
            'https://kovan.etherscan.io/tx/' + sellEvent.transactionHash;
        return container;
    }

    // getBuyEvents
    async getBuyEvents(numToGet) {
        const contract = this.loadBondingCurveContract();
        var buyEvents = await contract.getPastEvents('Buy', {
            fromBlock: 0,
            toBlock: 'latest',
        });
        buyEvents = buyEvents.slice(0, numToGet);
        return Promise.all(
            buyEvents.map((buyEvent) => this.formatBuyEvent(buyEvent))
        );
    }

    // format buy event
    async formatBuyEvent(buyEvent) {
        const container = {};
        const amount = Web3.utils.fromWei(buyEvent.returnValues.amount);
        const totalPrice = Web3.utils.fromWei(buyEvent.returnValues.price);
        container.price = this.formatNumber(totalPrice / amount);
        container.amount = this.formatNumber(amount);
        container.totalPaid = this.formatNumber(totalPrice);
        container.blockNumber = buyEvent.blockNumber;
        container.blockTime = await this.rootStore.providerStore.getBlockTime(
            buyEvent.blockNumber
        );
        container.type = 'Buy';
        container.hash =
            'https://kovan.etherscan.io/tx/' + buyEvent.transactionHash;
        return container;
    }

    // getRecentTrades(numberOfTrades)
    async getRecentTrades(numberOfTrades) {
        const buyEvents = await this.getBuyEvents(numberOfTrades);
        const sellEvents = await this.getSellEvents(numberOfTrades);
        var combinedTrades = buyEvents.concat(sellEvents);
        combinedTrades = combinedTrades.sort(function (a, b) {
            return b.blockNumber - a.blockNumber;
        });
        const sortedRecentTrades = combinedTrades.slice(0, numberOfTrades);
        return sortedRecentTrades;
    }

    // TODO Separate ERC20 version from ETH version
    // Enable Collateral Token (ERC20 Version)
    @action enableCollateral = async () => {
        this.enableTKNState = 1;
        const contract = this.loadCollateralTokenContract();
        const spender = deployed.BondingCurve;

        try {
            // TODO Revisit what number to approve
            await contract.methods
                .approve(spender, 4000000)
                .send()
                .on('transactionHash', function (hash) {
                    this.rootStore.providerStore.checkConfirmation(
                        hash,
                        ConfirmationFlags.ENABLE_TKN
                    );
                });

            // Debugging; TODO remove debugging
            const x = await contract.methods
                .allowance(this.rootStore.providerStore.address, spender)
                .call();
            console.log(
                'approve initiated; allowance is ' +
                    x.toString() +
                    ' enable state: ' +
                    this.enableTKNState
            );

            this.enableTKNState = 2;
        } catch (e) {
            // TODO set up logging
            console.log(e);
        }
    };

    // Enable DXD
    // @action enable = async
    @action enableDXD = async () => {
        this.enableDXDState = 1;
        const contract = this.loadBondedTokenContract();
        const spender = deployed.BondingCurve;

        try {
            // TODO Revisit what number to approve
            await contract.methods
                .approve(spender, 4000000)
                .send()
                .on('transactionHash', function (hash) {
                    this.rootStore.providerStore.checkConfirmation(
                        hash,
                        ConfirmationFlags.ENABLE_DXD
                    );
                });

            this.enableDXDState = 2;
        } catch (e) {
            // TODO set up logging
            console.log(e);
        }
    };

    @action buy = () => {
        if (collateralType === 'ETH') {
            this.ETHBuy();
        } else {
            this.ERC20Buy();
        }
    };

    @action sell = () => {
        if (collateralType === 'ETH') {
            this.ETHSell();
        } else {
            this.ERC20Sell();
        }
    };

    // buy(uint256 numTokens, uint256 maxPrice, address recipient)
    @action ERC20Buy = async () => {
        const contract = this.loadBondingCurveContract();
        const recipient = this.rootStore.providerStore.address;
        // TODO figure out how to set maxPrice
        const maxPrice = 1000;

        try {
            await contract.methods
                .buy(this.buyAmount, maxPrice, recipient)
                .send()
                .on('transactionHash', function (hash) {
                    this.rootStore.providerStore.checkConfirmation(
                        hash,
                        ConfirmationFlags.DEPOSIT_TKN
                    );
                });
            console.log('buy executed for ' + this.buyAmount);
            this.getReserveBalance();
            this.buyingState = 2;
        } catch (e) {
            // TODO set up logging
            console.log(e);
        }
    };

    // sell(uint256 numTokens, uint256 minPrice, address recipient)
    @action ERC20Sell = async () => {
        const contract = this.loadBondingCurveContract();
        const recipient = this.rootStore.providerStore.address;
        // TODO figure out how to set minPrice
        const minPrice = 0;

        try {
            await contract.methods
                .sell(this.sellAmount, minPrice, recipient)
                .send()
                .on('transactionHash', function (hash) {
                    this.rootStore.providerStore.checkConfirmation(
                        hash,
                        ConfirmationFlags.SELL_DXD
                    );
                });
            console.log('sell executed for ' + this.sellAmount);
            // TODO figure out how to be polling for updates to displayed values
            this.getReserveBalance();
            this.sellingState = 2;
        } catch (e) {
            // TODO set up logging
            console.log(e);
        }
    };

    // buy(uint256 numTokens, uint256 maxPrice, address recipient)
    @action ETHBuy = async () => {
        const contract = this.loadBondingCurveEtherContract();
        const recipient = this.rootStore.providerStore.address;
        try {
            const weiPriceToBuy = Web3.utils.toWei(this.priceToBuy);
            const weiBuyAmount = Web3.utils.toWei(this.buyAmount);
            console.log('weiPriceToBuy is: ' + weiPriceToBuy);
            console.log('weiBuyAmount is: ' + weiBuyAmount);
            await contract.methods
                .buy(weiBuyAmount, weiPriceToBuy, recipient)
                .send({ from: recipient, value: weiPriceToBuy })
                .on('transactionHash', function (hash) {
                    this.rootStore.providerStore.checkConfirmation(
                        hash,
                        ConfirmationFlags.DEPOSIT_TKN
                    );
                });
            console.log('buy executed for ' + this.buyAmount);
            // TODO Don't think this reserve balance update is required?
            // this.getReserveBalance()
            this.buyingState = 2;
        } catch (e) {
            // TODO set up logging
            console.log(e);
        }
    };

    // sell(uint256 numTokens, uint256 minReturn, address recipient)
    @action ETHSell = async () => {
        const contract = this.loadBondingCurveContract();
        const recipient = this.rootStore.providerStore.address;
        try {
            const weiRewardForSell = Web3.utils.toWei(this.rewardForSell);
            const weiSellAmount = Web3.utils.toWei(this.sellAmount);
            await contract.methods
                .sell(weiSellAmount, weiRewardForSell, recipient)
                .send()
                .on('transactionHash', function (hash) {
                    this.rootStore.providerStore.checkConfirmation(
                        hash,
                        ConfirmationFlags.SELL_DXD
                    );
                });
            console.log('sell executed for ' + this.sellAmount);
            // TODO Don't think this reserve balance update is required?
            // this.getReserveBalance()
            this.sellingState = 2;
        } catch (e) {
            // TODO set up logging
            console.log(e);
        }
    };

    loadBondedTokenContract() {
        return this.rootStore.providerStore.loadObject(
            'BondedToken',
            deployed.BondedToken,
            'BondedToken'
        );
    }

    loadBondingCurveContract() {
        return this.rootStore.providerStore.loadObject(
            'BondingCurve',
            deployed.BondingCurve,
            'BondingCurve'
        );
    }

    loadBondingCurveEtherContract() {
        return this.rootStore.providerStore.loadObject(
            'BondingCurveEther',
            deployed.BondingCurveEther,
            'BondingCurveEther'
        );
    }

    // loadCollateralTokenContract (ERC20 Version)
    loadCollateralTokenContract() {
        return this.rootStore.providerStore.loadObject(
            'CollateralToken',
            deployed.CollateralToken,
            'CollateralToken'
        );
    }
}

export default TradingStore;
