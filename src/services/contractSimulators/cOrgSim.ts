import { BigNumber } from '../../utils/bignumber';
import { DatState } from '../../stores/datStore';

export interface COrgSimParams {
    buySlopeNum?: BigNumber;
    buySlopeDen?: BigNumber;
    initGoal?: BigNumber;
    preMintedTokens?: BigNumber;
    reservePercentage?: BigNumber;
    reserveBalance?: BigNumber;
    burnedSupply?: BigNumber;
    state: DatState;
}

export default class COrgSim {
    params: COrgSimParams;

    constructor(params: COrgSimParams) {
        this.params = params;
    }

    getBuyPriceAtSupply(supply: BigNumber) {
        const {buySlopeNum, buySlopeDen, initGoal, state} = this.params;

        if (initGoal.gt(0) && supply.lte(initGoal) && state === DatState.STATE_INIT) {
            return initGoal.div(2).times(buySlopeNum).div(buySlopeDen);
        }

        return supply.times(buySlopeNum).div(buySlopeDen);
    }

    getSellPriceAtSupply(tokenSupply: BigNumber) {
        const {buySlopeNum, buySlopeDen, initGoal, reserveBalance, burnedSupply, preMintedTokens, state} = this.params;

        if (initGoal.gt(0) && tokenSupply.lte(initGoal) && state === DatState.STATE_INIT) {
            return initGoal.div(2).times(buySlopeNum).div(buySlopeDen);
        }
        return reserveBalance.times(2).div(tokenSupply.plus(preMintedTokens).minus(burnedSupply));
    }
    
    getSellPriceAt(tokenSupply: BigNumber, reserveBalance: BigNumber) {
        const {burnedSupply, preMintedTokens} = this.params;

        return reserveBalance.times(2).div(tokenSupply.plus(preMintedTokens).minus(burnedSupply));
    }
}
