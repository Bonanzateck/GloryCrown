import { BaseSlotGame } from "../../libs/platform/slots/base_slot_game";
import { FeatureDetails, SlotFeaturesState, SlotSpinState, SlotSpinWinsState } from "../../libs/engine/slots/models/slot_state_model";
import { CreateGrid } from "../../libs/engine/slots/actions/create_grid";
import { Cloner } from "../../libs/engine/slots/utils/cloner";
import { CalculateWins } from "../../libs/engine/slots/actions/calculate_wins";
import { PlayResponseModel } from "../../libs/platform/slots/play_response_model";
import { CreateStops } from "../../libs/engine/slots/actions/create_stops";
import { EvaluateWins } from "../../libs/engine/slots/actions/evaluate_wins";
import { RandomHelper } from "../../libs/engine/slots/utils/random";
import { RandomCondition } from "../../libs/engine/slots/conditions/random_condition";
import { Grid } from "../../libs/engine/slots/utils/grid";
import { ResponseModel } from "../../libs/platform/base/response_model";
import { ConfigResponseV2Model } from "../../libs/platform/slots/responses_v2";
import { ScatterSymbolCount } from "../../libs/engine/slots/conditions/scatter_symbol_count";
import { Triggerer } from "../../libs/engine/slots/features/triggerer";
import BigNumber from "bignumber.js";
import { UpdateFeature } from "../../libs/engine/slots/features/update_feature";
import { RandomObj } from "../../libs/engine/generic/rng/random";
import { SlotConditionMath } from "../../libs/engine/slots/models/slot_math_model";
import { ShinningCrownMath } from "./models/shinningcrown_math";
import { ShinningCrownResponseModel } from "./models/shinningcrown_response";
import { ShinningCrownState } from "./models/shinningcrown_state";


export class GameServer extends BaseSlotGame {

    constructor(){
        super("Shinning Crown", "0.1");
        this.math = new ShinningCrownMath();
    }

    protected executeBaseSpin() {
        let state:SlotSpinState = new SlotSpinState(); 

        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.paidReels );
        state.reelId = selectedSet.id;
        state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout );
        state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
        state.finalGrid = Cloner.CloneGrid( state.initialGrid);

        state.wins = EvaluateWins.LineWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue );
        state.win = CalculateWins.AddPays( state.wins );

        const scatter:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["ScatterWin"], state);
        if (scatter.isActive) {
            EvaluateWins.FeatureWins( this.math.info, scatter, this.state.gameStatus.totalBet)
        } 

        const bonus:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["BonusWin"], state);
        if (bonus.isActive) {
            EvaluateWins.FeatureWins( this.math.info, bonus, this.state.gameStatus.totalBet)
        }

        const coins:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["Coins"], state);
        if (bonus.isActive) {
            
        }

        state.features = [scatter, bonus, coins];
        state.win = CalculateWins.AddPays( state.features ).plus( state.win ) ;

        this.state.gameStatus.currentWin = state.win;
        this.state.gameStatus.totalWin = state.win;

        this.state.paidSpin = [state];
    }

    protected executeBuyBonus() {
        let state:SlotSpinState = new SlotSpinState(); 
        this.state.paidSpin = [state];
    }

    protected executeReSpin() {
        let state:SlotSpinState = new SlotSpinState();
        this.state.respins.push( [state] );
    }

    protected getPlayResponse():ResponseModel {
        return new ShinningCrownResponseModel( this.version, this.name, this.math, this.state as ShinningCrownState);
    }

    protected getConfigResponse( response:PlayResponseModel):ResponseModel {
        return new ConfigResponseV2Model( this.version, this.name, this.math, this.state);
    }

    protected defaultEmptyState():ShinningCrownState{
        return new ShinningCrownState()
    }

}