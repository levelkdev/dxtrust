import { observable, action } from 'mobx'
import Web3 from 'web3';
import store from './Root'

const schema = {
    BondedToken: require('../abi/BondedToken'),
    BondingCurve: require('../abi/BondingCurve'),
    RewardsDistributor: require('../abi/RewardsDistributor'),
    CollateralToken: require('../abi/ERC20')
}

const objects = {}

class ProviderStore {
    @observable web3: Web3
    @observable context: any
    @observable defaultAccount = '';
    @observable isProviderSet = false;
    @observable isAccountSet = false;
    // @observable state: ProviderState = ProviderState.LOADING

// TODO reconcile these provider values with those above
	@observable address: ''
	@observable isConnected: false
	@observable chainId: ''

    @observable ETHBalance: 0


    loadObject = (type, address, label?) => {
    	// TODO what to do about web3
    	// TODO what function to use for the from field below?
        const object = new this.web3.eth.Contract(schema[type].abi, address, { from: this.getSelectedAddress() });
        if (label) {
            objects[label] = object;
        }
        return object;
    }

    getSelectedAddress = () => {
        // return this.web3.eth.defaultAccount as string;
        return this.web3.eth.accounts.givenProvider.selectedAddress;
    }

    // Get ETH balance for account
    setETHBalance = async () => {
        const balance = await this.web3.eth.getBalance(this.address)
        this.ETHBalance = balance
    }

    // Check for confirmation
    checkConfirmation = (txHash, checkBool) => {
        console.log("checking whether transaction was confirmed with any confirmations")
        const self = this
        this.web3.eth.getTransaction(txHash).then(
            function(result) {
                console.log(result)
                if (result.blockHash == null) {
                    console.log("transaction not mined yet")
                    console.log("blockhash: " + result.blockHash)
                    console.log("tx hash: " + txHash)
                    return setTimeout( self.checkConfirmation(txHash, checkBool), 0.1*1000)
                } else {
                    console.log("transaction confirmed!")
                    return store.tradingStore.setStateConfirmed(checkBool)
                }
            }
        )
    }
}

export default ProviderStore