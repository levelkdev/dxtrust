import RootStore from 'stores/Root';

export default class DatStore {
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
}
