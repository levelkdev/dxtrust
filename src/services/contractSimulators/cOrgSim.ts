import { BigNumber } from '../../utils/bignumber';
import BigDivSim from './bigDivSim';
import { DatState } from '../../stores/datStore';

export interface COrgSimParams {
    buySlopeNum?: BigNumber;
    buySlopeDen?: BigNumber;
    initGoal?: BigNumber;
    initReserve?: BigNumber;
    reservePercentage?: BigNumber;
    state: DatState;
}

export default class COrgSim {
    params: COrgSimParams;
    BigDiv: BigDivSim;

    constructor(params: COrgSimParams) {
        this.params = params;
    }

    getPriceAtSupply(supply: BigNumber) {
        const {buySlopeNum, buySlopeDen, initGoal, state} = this.params;

        if (initGoal.gt(0) && supply.lte(initGoal) && state == DatState.STATE_INIT) {
            return initGoal.div(2).times(buySlopeNum).div(buySlopeDen);
        }

        return supply.times(buySlopeNum).div(buySlopeDen);
    }

}