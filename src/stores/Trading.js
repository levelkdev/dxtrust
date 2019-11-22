import { observable, action } from 'mobx'
import { deployed } from '../config.json'
import store from './Root'

class TradingStore {
	@observable reserveBalance = ''
	@observable priceToBuy = ''
	@observable rewardForSell = ''

	// priceToBuy(uint256 numTokens)
	async getPriceToBuy(numTokens) {
		const contract = this.loadBondingCurveContract()
		const priceToBuy = await contract.methods.priceToBuy(numTokens).call()
		this.priceToBuy = priceToBuy
	}

	// rewardForSell(uint256 numTokens)
	async getRewardForSell(numTokens) {
		const contract = this.loadBondingCurveContract()
		const rewardForSell = await contract.methods.rewardForSell(numTokens).call()
		this.rewardForSell = rewardForSell
	}

	async getReserveBalance() {
		const contract = this.loadBondingCurveContract()
		const reserveBalance = await contract.methods.reserveBalance().call()
		this.reserveBalance = reserveBalance
	}

	// buy(uint256 numTokens, uint256 maxPrice, address recipient)
	@action buy = async (numTokens, maxPrice) => {
		const contract = this.loadBondingCurveContract()
		const recipient = store.providerStore.address

		try {
			await contract.methods.buy(numTokens, maxPrice, recipient).send()
			console.log('buy executed for ' + numTokens)
			this.getReserveBalance()
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
}

export default TradingStore