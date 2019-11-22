import { observable, action } from 'mobx'
import Web3 from 'web3';

const schema = {
    BondedToken: require('../abi/BondedToken'),
    BondingCurve: require('../abi/BondingCurve'),
    RewardsDistributor: require('../abi/RewardsDistributor'),
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
}

export default ProviderStore