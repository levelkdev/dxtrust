import { BigNumber } from '../../utils/bignumber';
import { bnum } from '../../utils/helpers';
import BigDivSim from './bigDivSim';

export interface COrgSimParams {
    buySlopeNum?: BigNumber;
    buySlopeDen?: BigNumber;
    initGoal?: BigNumber;
    initReserve?: BigNumber;
    reservePercentage?: BigNumber;
}

export default class COrgSim {
    params: COrgSimParams;
    BigDiv: BigDivSim;

    constructor(params: COrgSimParams) {
        this.params = params;
    }

    getPriceAtSupply(supply: BigNumber) {
        const {buySlopeNum, buySlopeDen, initGoal} = this.params;

        if (initGoal.gt(0) && supply.lte(initGoal)) {
            return initGoal.div(2).times(buySlopeNum).div(buySlopeDen);
        }

        return supply.times(buySlopeNum).div(buySlopeDen);
    }
}