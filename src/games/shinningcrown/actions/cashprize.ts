import { IRandom } from "../../../libs/engine/generic/rng/random";
import { SlotFeaturesState, SlotSpinState } from "../../../libs/engine/slots/models/slot_state_model";
import { Cloner } from "../../../libs/engine/slots/utils/cloner";
import { RandomHelper } from "../../../libs/engine/slots/utils/random";
import { ShinningCrownMath } from "../models/shinningcrown_math";
import { ShinningCrownState } from "../models/shinningcrown_state";

export class CashPrize {

    static updateCoinPrizeMath( state :ShinningCrownState, math :ShinningCrownMath ){
        state.cashPrizesMath = Cloner.CloneObject( math.cashMath);
        state.cashPrizes = [];
    }

    static CalculateMultiplier( state: ShinningCrownState, spin: SlotSpinState) {
        spin.multiplier = 0;
        state.cashPrizes.forEach( prize => {
            spin.multiplier += prize.multiplier;
        })
    }

    static FullHouse( state: ShinningCrownState) {
        state.cashPrizes.forEach( prize => {
            if ( prize.id.includes("XBET") ) {
                prize.multiplier *= 2;
            }
        })
    }

    static CoinsMultiplier( rng :IRandom, coins :SlotFeaturesState,  state :ShinningCrownState ) {

        coins.offsets.forEach( offset => {
            const isPresent :boolean = state.cashPrizes.some( prize => prize.offset === offset );
            if (isPresent) {
                return;
            }

            let awardedprize :any = RandomHelper.GetRandomFromList( rng, state.cashPrizesMath );
            while( state.awardedJackpots.includes( awardedprize.id ) ){
                awardedprize = RandomHelper.GetRandomFromList( rng, state.cashPrizesMath );
            }
            if ( awardedprize.repeat === false ) {
                // state.cashPrizesMath = state.cashPrizesMath.filter( prize => prize.id !== awardedprize.id );
                state.awardedJackpots.push( awardedprize.id);
            }
            if ( isNaN(Number( awardedprize.multiplier)) ){
                awardedprize = RandomHelper.GetRandomFromList( rng, awardedprize.multiplier);
            } 
    
            state.cashPrizes.push( { offset: offset, id: awardedprize.id, multiplier: awardedprize.multiplier} );
        } )

    }

}
