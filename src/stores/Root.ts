// Stores
import ProviderStore from 'stores/Provider';
import BlockchainFetchStore from 'stores/BlockchainFetch';
import TokenStore from 'stores/Token';
import TransactionStore from './Transaction';
import AppSettingsStore from './AppSettings';
import ModalStore from './Modal';
import TradingFormStore from './TradingForm';
import DatStore from './datStore';
import ConfigStore from './config';

export default class RootStore {
    providerStore: ProviderStore;
    blockchainFetchStore: BlockchainFetchStore;
    tokenStore: TokenStore;
    transactionStore: TransactionStore;
    appSettingsStore: AppSettingsStore;
    modalStore: ModalStore;
    tradingStore: TradingFormStore;
    datStore: DatStore;
    configStore: ConfigStore;

    constructor() {
        this.providerStore = new ProviderStore(this);
        this.blockchainFetchStore = new BlockchainFetchStore(this);
        this.tokenStore = new TokenStore(this);
        this.transactionStore = new TransactionStore(this);
        this.appSettingsStore = new AppSettingsStore(this);
        this.modalStore = new ModalStore(this);
        this.tradingStore = new TradingFormStore(this);
        this.datStore = new DatStore(this);
        this.configStore = new ConfigStore(this);

        this.asyncSetup().catch((e) => {
            //TODO: Add retry on these fetches
            throw new Error('Async Setup Failed ' + e);
        });
    }

    async asyncSetup() {
        // One time async operations on load
    }
}
