import { observable, action } from 'mobx'
import { deployed } from '../config.json'
import store from './Root'

const ConfirmationFlags = {
  ENABLE_TKN: 'enable_TKN',
  DEPOSIT_TKN: 'deposit_TKN'
}

class TradingStore {
	@observable reserveBalance = ''
	@observable priceToBuy = 0
	@observable price = 0
	@observable rewardForSell = ''

	@observable enableState = 0
	@observable buyingState = 0
	@observable buyAmount = 0

	@observable bondedTokenBalance = 0
	@observable bondedTokenPrice = 0

	// priceToBuy(uint256 numTokens)
	async getPriceToBuy(numTokens) {
		const contract = this.loadBondingCurveContract()
		const priceToBuy = await contract.methods.priceToBuy(numTokens).call()
		return priceToBuy
	}

	// priceToBuy(uint256 numTokens)
	async setPriceToBuy(numTokens) {
		const priceToBuy = await this.getPriceToBuy(numTokens)
		this.priceToBuy = priceToBuy
	}

	// setPrice()
	async setPrice() {
		console.log('in setPrice')
		const price = await this.getPriceToBuy(1000000)
		this.price = price
		console.log('price in setPrice: ' + price)
	}

	// rewardForSell(uint256 numTokens)
	async getRewardForSell(numTokens) {
		const contract = this.loadBondingCurveContract()
		const rewardForSell = await contract.methods.rewardForSell(numTokens).call()
		this.rewardForSell = rewardForSell
	}

	// getReserveBalance()
	async getReserveBalance() {
		const contract = this.loadBondingCurveContract()
		const reserveBalance = await contract.methods.reserveBalance().call()
		this.reserveBalance = reserveBalance
	}

	// setBondedTokenBalance()
	async setBondedTokenBalance() {
		const contract = this.loadBondedTokenContract()
		const tokenBalance = await contract.methods.balanceOf(store.providerStore.address).call()
		this.bondedTokenBalance = tokenBalance
	}

	// setBuyAmount()
	setBuyAmount(buyAmount) {
		const precisionBuyAmount = buyAmount*1000000
		this.setPriceToBuy(precisionBuyAmount)
		this.buyAmount = precisionBuyAmount
	}

	// TODO look into how to pass this as a callback??
	// setEnableStateConfirmed()
	setStateConfirmed(confirmationFlag) {
		if (confirmationFlag === ConfirmationFlags.ENABLE_TKN) {
			return this.enableState = 3
		} else if (confirmationFlag === ConfirmationFlags.DEPOSIT_TKN) {
			return this.buyingState = 3
		}
	}

	// TODO Separate ERC20 version from ETH version
	// Enable Collateral Token (ERC20 Version)
	@action enableCollateral = async () => {
		this.enableState = 1
		const contract = this.loadCollateralTokenContract()
		const spender = deployed.BondingCurve

		try {
			// TODO figure out how to set amount to approve
			await contract.methods.approve(spender, 40000).send()
			.on('transactionHash', function(hash){
				store.providerStore.checkConfirmation(hash, ConfirmationFlags.ENABLE_TKN)
			})
			const x = await contract.methods.allowance(store.providerStore.address, spender).call()
			console.log("approve initiated; allowance is " + x.toString() + ' enable state: ' + this.enableState)
			this.enableState = 2
		} catch (e) {
			// TODO set up logging
			console.log(e)
		}
	}

	// Enable DXD
	// @action enable = async 

	// buy(uint256 numTokens, uint256 maxPrice, address recipient)
	@action buy = async () => {
		const contract = this.loadBondingCurveContract()
		const recipient = store.providerStore.address
		// TODO figure out how to set maxPrice
		const maxPrice = 1000

		try {
			await contract.methods.buy(this.buyAmount, maxPrice, recipient).send()
			.on('transactionHash', function(hash){
				store.providerStore.checkConfirmation(hash, ConfirmationFlags.DEPOSIT_TKN)
			})
			console.log('buy executed for ' + this.buyAmount)
			this.getReserveBalance()
			this.buyingState = 2
		} catch (e) {
			// TODO set up logging
			console.log(e)
		}
	}

	// sell(uint256 numTokens, uint256 minPrice, address recipient)

    loadBondedTokenContract() {
        return store.providerStore.loadObject('BondedToken', deployed.BondedToken, 'BondedToken')
    }

    loadBondingCurveContract() {
        return store.providerStore.loadObject('BondingCurve', deployed.BondingCurve, 'BondingCurve')
    }

    loadRewardsDistributorContract() {
        return store.providerStore.loadObject('RewardsDistributor', deployed.RewardsDistributor, 'RewardsDistributor')
    }

    // loadCollateralTokenContract (ERC20 Version)
    loadCollateralTokenContract() {
    	return store.providerStore.loadObject('CollateralToken', deployed.CollateralToken, 'CollateralToken')
    }
}

export default TradingStore