import { PlatformMath } from "../../../libs/platform/base/platform_math";
import { ConfigResponseV2Model, PlayResponseV2Model } from "../../../libs/platform/slots/responses_v2";
import { ShinningCrownState } from "./shinningcrown_state";

export class ShinningCrownResponseModel extends PlayResponseV2Model {

    public coinPrize = [];

    constructor( version:string, name:string, math:PlatformMath, state:ShinningCrownState ) {
        super( version, name, math, state);
        this.coinPrize = [];
        state.cashPrizes.forEach( prize => {
            this.coinPrize.push( {offset:prize.offset, id:prize.id, multiplier:prize.multiplier} )
        })
    }
}

export class ShinningCrownConfigResponseV2Model extends ConfigResponseV2Model {
    
    public coinPrize = [];

    constructor( version:string, name:string, math:PlatformMath, state:ShinningCrownState ) {
        super( version, name, math, state);

        this.coinPrize = [];
        state.cashPrizes.forEach( prize => {
            this.coinPrize.push( {offset:prize.offset, id:prize.id, multiplier:prize.multiplier} )
        })
    }
}
