// Stores
import ProviderStore from "./Provider"
import TradingStore from "./Trading"

class Rootstore {
	providerStore: ProviderStore
	tradingStore: TradingStore

	constructor() {
		this.providerStore = new ProviderStore()
		this.tradingStore = new TradingStore()
	}
}

const store = new Rootstore()
export default store