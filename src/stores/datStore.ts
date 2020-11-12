import RootStore from 'stores/Root';
import { BigNumber } from '../utils/bignumber';
import { ContractType } from './Provider';
import { action, observable } from 'mobx';
import { bnum } from '../utils/helpers';
import PromiEvent from 'promievent';
import { BigNumberCached } from '../services/blockchainReader';
import { Call } from '../services/multicall/MulticallService';
import { getEtherscanLink } from 'utils/etherscan';

export enum EventType {
    Buy = 'Buy',
    Sell = 'Sell',
}

export interface BuyEvent {
    price: BigNumber;
    amount: BigNumber;
    totalPaid: BigNumber;
    blockNumber: number;
    blockTime: string;
    type: EventType;
    hash: string;
}

export interface SellEvent {
    price: BigNumber;
    amount: BigNumber;
    totalReceived: BigNumber;
    blockNumber: number;
    blockTime: string;
    type: EventType;
    hash: string;
}

export enum DatState {
    STATE_INIT,
    STATE_RUN,
    STATE_CLOSE,
    STATE_CANCEL,
}

interface DatStateCached {
    value: DatState;
    blockNumber: number;
}

interface DatInfo {
    minInvestment?: BigNumber;
    currentPrice?: BigNumberCached;
    initReserve?: BigNumberCached;
    initGoal?: BigNumberCached;
    reserveBalance?: BigNumberCached;
    buySlopeNum?: BigNumberCached;
    buySlopeDen?: BigNumberCached;
    state?: DatStateCached;
}

interface DatInfoMap {
    [index: string]: DatInfo;
}

export interface BuyReturnCached {
    value: BuyReturn;
    blockNumber: number;
}

export interface SellReturnCached {
    value: SellReturn;
    blockNumber: number;
}

export interface BuyReturn {
    tokensIssued: BigNumber;
    totalPaid: BigNumber;
    pricePerToken: BigNumber;
}

export interface SellReturn {
    tokensSold: BigNumber;
    currencyReturned: BigNumber;
    returnPerToken: BigNumber;
}

export type TradeEvent = BuyEvent | SellEvent;

export const BLOCKS_PER_TRADES_FETCH = 100000;

export default class DatStore {
    @observable datParams: DatInfoMap;
    rootStore: RootStore;

    constructor(rootStore) {
        this.rootStore = rootStore;
        this.datParams = {} as DatInfoMap;
    }

    private getDatContract() {
        const { providerStore, configStore } = this.rootStore;
        return providerStore.getContract(
            providerStore.getActiveWeb3React(),
            ContractType.DecentralizedAutonomousTrust,
            configStore.getTokenAddress()
        );
    }

    areAllStaticParamsLoaded(): boolean {
        return (
            !!this.getMinInvestment() &&
            !!this.getBuySlopeNum() &&
            !!this.getBuySlopeDen() &&
            !!this.getInitGoal() &&
            !!this.getPreMintedTokens() &&
            !!this.getBurnedSupply() &&
            !!this.getInvestmentReserveBasisPoints()
        );
    }

    isInitPhase() {
        return this.getState() === DatState.STATE_INIT;
    }
    isRunPhase() {
        return this.getState() === DatState.STATE_RUN;
    }
    isCancelled() {
        return this.getState() === DatState.STATE_CANCEL;
    }
    isClosed() {
        return this.getState() === DatState.STATE_CLOSE;
    }

    getState(): DatState | undefined {
        const { configStore } = this.rootStore;
        const value = this.rootStore.blockchainStore.getCachedValue({
            contractType: ContractType.DecentralizedAutonomousTrust,
            address: configStore.getTokenAddress(),
            method: 'state',
        });
        return value ? (bnum(value).toNumber() as DatState) : undefined;
    }

    getMinInvestment(): BigNumber | undefined {
        const { configStore } = this.rootStore;
        const value = this.rootStore.blockchainStore.getCachedValue({
            contractType: ContractType.DecentralizedAutonomousTrust,
            address: configStore.getTokenAddress(),
            method: 'minInvestment',
        });
        return value ? bnum(value) : undefined;
    }

    getBuySlopeNum() {
        const { configStore } = this.rootStore;
        const value = this.rootStore.blockchainStore.getCachedValue({
            contractType: ContractType.DecentralizedAutonomousTrust,
            address: configStore.getTokenAddress(),
            method: 'buySlopeNum',
        });
        return value ? bnum(value) : undefined;
    }

    getBuySlopeDen() {
        const { configStore } = this.rootStore;
        const value = this.rootStore.blockchainStore.getCachedValue({
            contractType: ContractType.DecentralizedAutonomousTrust,
            address: configStore.getTokenAddress(),
            method: 'buySlopeDen',
        });
        return value ? bnum(value) : undefined;
    }

    getInitGoal() {
        const { configStore } = this.rootStore;
        const value = this.rootStore.blockchainStore.getCachedValue({
            contractType: ContractType.DecentralizedAutonomousTrust,
            address: configStore.getTokenAddress(),
            method: 'initGoal',
        });
        return value ? bnum(value) : undefined;
    }

    getReserveBalance(): BigNumber | undefined {
        const { configStore } = this.rootStore;
        const value = this.rootStore.blockchainStore.getCachedValue({
            contractType: ContractType.DecentralizedAutonomousTrust,
            address: configStore.getTokenAddress(),
            method: 'buybackReserve',
        });
        return value ? bnum(value) : undefined;
    }

    getPreMintedTokens() {
        const { configStore } = this.rootStore;
        const value = this.rootStore.blockchainStore.getCachedValue({
            contractType: ContractType.DecentralizedAutonomousTrust,
            address: configStore.getTokenAddress(),
            method: 'initReserve',
        });
        return value ? bnum(value) : undefined;
    }
    
    getBurnedSupply() {
        const { configStore } = this.rootStore;
        const value = this.rootStore.blockchainStore.getCachedValue({
            contractType: ContractType.DecentralizedAutonomousTrust,
            address: configStore.getTokenAddress(),
            method: 'burnedSupply',
        });
        return value ? bnum(value) : undefined;
    }
    
    getKickstarterPrice() {
      const buySlopeNum = this.getBuySlopeNum(),
      buySlopeDen = this.getBuySlopeDen(),
      initGoal = this.getInitGoal();
      return initGoal.div(2).times(buySlopeNum).div(buySlopeDen);
    }
    
    getInvestmentReserveBasisPoints() {
        const { configStore } = this.rootStore;
        const value = this.rootStore.blockchainStore.getCachedValue({
            contractType: ContractType.DecentralizedAutonomousTrust,
            address: configStore.getTokenAddress(),
            method: 'investmentReserveBasisPoints',
        });
        return value ? bnum(value) : undefined;
    }

    genStaticParamCalls(): Call[] {
        const { configStore } = this.rootStore;
        const baseCall = {
            contractType: ContractType.DecentralizedAutonomousTrust,
            address: configStore.getTokenAddress(),
        };

        const calls: Call[] = [
            {
                ...baseCall,
                method: 'initReserve',
            },
            {
                ...baseCall,
                method: 'initGoal',
            },
            {
                ...baseCall,
                method: 'buySlopeNum',
            },
            {
                ...baseCall,
                method: 'buySlopeDen',
            },
            {
                ...baseCall,
                method: 'investmentReserveBasisPoints',
            },
        ];

        return calls;
    }

    async estimateBuyValue(currencyValue: BigNumber): Promise<BigNumber> {
        const dat = this.getDatContract();
        return bnum(
            await dat.methods.estimateBuyValue(currencyValue.toString()).call()
        );
    }

    async estimateSellValue(quantityToSell: BigNumber): Promise<BigNumber> {
        const dat = this.getDatContract();
        return bnum(
            await dat.methods
                .estimateSellValue(quantityToSell.toString())
                .call()
        );
    }

    async fetchBuyEvents(numToGet: number, fromBlock: number, toBlock: number = 0): Promise<TradeEvent[]> {
        const dat = this.getDatContract();
        let buyEvents = await dat.getPastEvents('Buy', {
            fromBlock: fromBlock,
            toBlock: toBlock === 0 ? 'latest' : toBlock
        });

        buyEvents.reverse();
        buyEvents = buyEvents.slice(0, numToGet);

        return Promise.all(
            buyEvents.map((buyEvent) => {
                if (this.isBuyEventValid(buyEvent)) {
                    return this.parseBuyEvent(buyEvent);
                } else {
                  return null;
                }
            })
        );
    }

    async fetchSellEvents(numToGet: number, fromBlock: number, toBlock: number = 0): Promise<TradeEvent[]> {
        const dat = this.getDatContract();
        let sellEvents = await dat.getPastEvents('Sell', {
            fromBlock: fromBlock,
            toBlock: toBlock === 0 ? 'latest' : toBlock
        });

        sellEvents.reverse();
        sellEvents = sellEvents.slice(0, numToGet);

        return Promise.all(
            sellEvents.map((sellEvent) => {
                if (this.isSellEventValid(sellEvent)) {
                    return this.parseSellEvent(sellEvent);
                } else {
                  return null;
                }
            })
        );
    }

    async parseBuyEvent(buyEvent) {
        const amount = bnum(buyEvent.returnValues._fairValue);
        const totalPrice = bnum(buyEvent.returnValues._currencyValue);

        const blockTime = await this.rootStore.providerStore.getBlockTime(
            buyEvent.blockNumber
        );

        const chainId = this.rootStore.providerStore.getActiveWeb3React().chainId;

      const event: BuyEvent = {
            price: totalPrice.div(amount),
            amount: amount,
            totalPaid: totalPrice,
            blockNumber: buyEvent.blockNumber,
            blockTime: blockTime,
            type: EventType.Buy,
            hash: getEtherscanLink(chainId, buyEvent.transactionHash, 'transaction' ),
        };

        return event;
    }

    // format sell event
    async parseSellEvent(sellEvent) {
        const amount = bnum(sellEvent.returnValues._fairValue);
        const totalReceived = bnum(sellEvent.returnValues._currencyValue);

        const blockTime = await this.rootStore.providerStore.getBlockTime(
            sellEvent.blockNumber
        );
        
        const chainId = this.rootStore.providerStore.getActiveWeb3React().chainId;

        const event: SellEvent = {
            price: totalReceived.div(amount),
            amount: amount,
            totalReceived: totalReceived,
            blockNumber: sellEvent.blockNumber,
            blockTime: blockTime,
            type: EventType.Sell,
            hash: getEtherscanLink(chainId, sellEvent.transactionHash, 'transaction' ),
        };

        return event;
    }

    isBuyEventValid(buyEvent) {
        return (
            !!buyEvent.returnValues &&
            buyEvent.returnValues._fairValue &&
            !!buyEvent.returnValues._currencyValue
        );
    }

    isSellEventValid(sellEvent) {
        return (
            !!sellEvent.returnValues &&
            sellEvent.returnValues._fairValue &&
            !!sellEvent.returnValues._currencyValue
        );
    }
    
    getSellPriceAtSupplyWithReserve(tokenSupply: BigNumber, reserveBalance: BigNumber) {
        const initGoal = this.getInitGoal(),
        burnedSupply = this.getBurnedSupply(),
        preMintedTokens  = this.getPreMintedTokens();

        if (initGoal.gt(0) && tokenSupply.lte(initGoal)) {
            return this.getKickstarterPrice();
        }
        return reserveBalance.times(2).div(tokenSupply.plus(preMintedTokens).minus(burnedSupply));
    }
    
    getSellPriceAtSupply(tokenSupply: BigNumber) {
        const reserveBalance = this.getReserveBalance();
        return this.getSellPriceAtSupplyWithReserve(tokenSupply, reserveBalance);
    }
    
    getSellPrice() {
        const { tokenStore, configStore } = this.rootStore;
        const totalSupply = tokenStore.getTotalSupply(configStore.getTokenAddress());
        const preMintedTokens  = this.getPreMintedTokens();
        return this.getSellPriceAtSupply(totalSupply.minus(preMintedTokens));
    }
    
    getBuyPriceAtSupply(supply: BigNumber) {
        const initGoal = this.getInitGoal(),
        buySlopeNum = this.getBuySlopeNum(),
        buySlopeDen  = this.getBuySlopeDen();

        if (initGoal.gt(0) && supply.lte(initGoal)) {
            return initGoal.div(2).times(buySlopeNum).div(buySlopeDen);
        }

        return supply.times(buySlopeNum).div(buySlopeDen);
    }
    
    getBuyPrice() {
        const { tokenStore, configStore } = this.rootStore;
        const totalSupply = tokenStore.getTotalSupply(configStore.getTokenAddress());
        const preMintedTokens  = this.getPreMintedTokens();
        const burnedSupply  = this.getBurnedSupply();
        return this.getBuyPriceAtSupply(totalSupply.minus(preMintedTokens).plus(burnedSupply));
    }

    fetchBuyReturn(totalPaid: BigNumber): BuyReturnCached { const blockNumber = this.rootStore.providerStore.getCurrentBlockNumber();
        
        const { tokenStore, configStore } = this.rootStore;
        const initGoal = this.getInitGoal();
        const buySlopeDen = this.getBuySlopeDen();
        const buySlopeNum = this.getBuySlopeNum();
        const totalSupply = tokenStore.getTotalSupply(configStore.getTokenAddress());
        const preMintedTokens  = this.getPreMintedTokens();
        const burnedSupply = this.getBurnedSupply();
        const tokensSold = totalSupply.minus(preMintedTokens).plus(burnedSupply);
        let tokensIssued = bnum(0), pricePerToken = bnum(0);
        if (this.getState() === 0) {
          pricePerToken = this.getKickstarterPrice();
          tokensIssued = totalPaid.div(pricePerToken);
          
          const tokensLeftInKickstarter = initGoal.minus(totalSupply.minus(preMintedTokens))
          if (tokensIssued.gt(tokensLeftInKickstarter)) {
            tokensIssued = tokensLeftInKickstarter;
            const valueAfterKickstarterEnds = totalPaid
              .minus(tokensLeftInKickstarter.times(this.getKickstarterPrice()));

            const tokensAfterKickstarterEnds = valueAfterKickstarterEnds.times(2).times(buySlopeDen).div(buySlopeNum)
              .plus(initGoal.times(initGoal))
              .sqrt()
              .minus(initGoal);
              
            tokensIssued = tokensIssued.plus(tokensAfterKickstarterEnds);
          }
        } else {
          tokensIssued = totalPaid.times(2).times(buySlopeDen).div(buySlopeNum)
            .plus(tokensSold.times(tokensSold))
            .sqrt()
            .minus(tokensSold);
        }
        pricePerToken = totalPaid.div(tokensIssued);
        
        // What was used to get the on chain values
        // const tokensIssued = await this.estimateBuyValue(totalPaid);
        // const pricePerToken = totalPaid.div(tokensIssued);

        return {
            value: {
                totalPaid,
                tokensIssued,
                pricePerToken,
            },
            blockNumber,
        };
    }

    fetchSellReturn(tokensToSell: BigNumber): SellReturnCached {

      const { tokenStore, configStore } = this.rootStore;
      const totalSupply = tokenStore.getTotalSupply(configStore.getTokenAddress());
      const preMintedTokens  = this.getPreMintedTokens();
      const reserve  = this.getReserveBalance();
      const burnedSupply = this.getBurnedSupply();
      let currencyReturned = bnum(0), returnPerToken = bnum(0);

      if(this.getState() === 1) {
        const supply = totalSupply.plus(burnedSupply);

        currencyReturned = tokensToSell.times(reserve).times(burnedSupply.times(burnedSupply))
          .div(totalSupply.times(supply.times(supply)));
      
        currencyReturned = currencyReturned.plus(
          tokensToSell.times(2).times(reserve).div(supply)
        );

        currencyReturned = currencyReturned.minus(
          tokensToSell.times(tokensToSell).times(reserve)
          .div(supply.times(supply))
        );
        
      } else if(this.getState() === 2) {
        currencyReturned = tokensToSell.times(reserve).div(totalSupply)
      } else {
        currencyReturned = tokensToSell.times(reserve).div(totalSupply.minus(preMintedTokens))
      }
      
        const blockNumber = this.rootStore.providerStore.getCurrentBlockNumber();
        returnPerToken = currencyReturned.div(tokensToSell);

        // Uncomment thsi to get value on chain
        // currencyReturned = await this.estimateSellValue(tokensToSell);
        return {
            value: {
                tokensSold: tokensToSell,
                currencyReturned,
                returnPerToken,
            },
            blockNumber,
        };
    }

    async fetchSpotPrice(): Promise<BigNumber> {
        const minInvestment = this.getMinInvestment();
        const spotTokens = await this.estimateBuyValue(minInvestment);
        const price = minInvestment.div(spotTokens);
        return price;
    }

    // getRecentTrades(numberOfTrades)
    async fetchRecentTrades(numToGet: number): Promise<TradeEvent[]> { const { library } = this.rootStore.providerStore.getActiveWeb3React();
        let latestBlock = await library.eth.getBlockNumber();
        let startBlock = (this.rootStore.configStore.getDATinfo()).fromBlock;
        let tradesToReturn = [];
        
        const self = this;
        async function getEventsBetweenBlocks(fromBlock, toBlock) {
          const buyEvents = await self.fetchBuyEvents(numToGet, fromBlock, toBlock);
          const sellEvents = await self.fetchSellEvents(numToGet, fromBlock, toBlock);
          let combinedTrades: any[] = buyEvents.concat(sellEvents);
        
          tradesToReturn = tradesToReturn.concat(combinedTrades);

          console.debug('Getting events between blocks', fromBlock, toBlock, tradesToReturn.length);

          if (tradesToReturn.length < numToGet && toBlock > fromBlock)
            await getEventsBetweenBlocks(
              fromBlock - BLOCKS_PER_TRADES_FETCH > startBlock
                ? fromBlock - BLOCKS_PER_TRADES_FETCH
                : startBlock,
              fromBlock
            );
        }
        
        await getEventsBetweenBlocks(
          latestBlock - BLOCKS_PER_TRADES_FETCH > startBlock
            ? latestBlock - BLOCKS_PER_TRADES_FETCH
            : startBlock,
          latestBlock
        );
        
        if (tradesToReturn.length >= numToGet) 
          tradesToReturn.slice(0, numToGet);
        
        tradesToReturn = tradesToReturn.sort(function (a, b) {
          return b.blockNumber - a.blockNumber;
        });
        
        return tradesToReturn;
    }

    // TODO: Return status on failure
    @action buy(
        to: string,
        currencyValue: BigNumber,
        minTokensBought: BigNumber
    ): PromiEvent<any> {
        const { providerStore, configStore } = this.rootStore;

        return providerStore.sendTransaction(
            providerStore.getActiveWeb3React(),
            ContractType.DecentralizedAutonomousTrust,
            configStore.getTokenAddress(),
            'buy',
            [to, currencyValue.toString(), minTokensBought.toString()],
            { value: currencyValue.toString() }
        );
    }

    //TODO: Return status on failure
    @action sell(to: string, quantityToSell: BigNumber, minCurrencyReturned: BigNumber) {
        const { providerStore, configStore } = this.rootStore;

        return providerStore.sendTransaction(
            providerStore.getActiveWeb3React(),
            ContractType.DecentralizedAutonomousTrust,
            configStore.getTokenAddress(),
            'sell',
            [to, quantityToSell.toString(), minCurrencyReturned.toString()]
        );
    }
}
