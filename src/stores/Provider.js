import { observable } from 'mobx'
import Web3 from 'web3';

class ProviderStore {
	@observable address: ''
	@observable isConnected: false
	@observable chainId: ''
}

export default ProviderStore