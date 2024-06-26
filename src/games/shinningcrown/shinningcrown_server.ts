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
import { ShinningCrownConfigResponseV2Model, ShinningCrownResponseModel } from "./models/shinningcrown_response";
import { ShinningCrownState } from "./models/shinningcrown_state";
import { CashPrize } from "./actions/cashprize";

export class GameServer extends BaseSlotGame {

    constructor(){
        super("Shinning Crown", "0.6");
        this.math = new ShinningCrownMath();
    }

    protected executeBaseSpin() {
        let state:SlotSpinState = new SlotSpinState(); 

        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.paidReels );
        state.reelId = selectedSet.id;
        state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout );
        state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
        state.finalGrid = Grid.ExpandSymbolInReels( this.math.info.wildSymbols[0], state.initialGrid);

        state.wins = EvaluateWins.LineWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue );
        state.win = CalculateWins.AddPays( state.wins );

        const scatter:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["ScatterWin"], state);
        if (scatter.isActive) {
            EvaluateWins.FeatureWins( this.math.info, scatter, this.state.gameStatus.stakeValue)
        } 

        const bonus:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["BonusWin"], state);
        if (bonus.isActive) {
            EvaluateWins.FeatureWins( this.math.info, bonus, this.state.gameStatus.stakeValue)
        }

        const coins:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["HoldSpin"], state);
        CashPrize.updateCoinPrizeMath( this.state as ShinningCrownState, this.math as ShinningCrownMath );
        CashPrize.CoinsMultiplier( this.rng, coins, this.state as ShinningCrownState );

        if (coins.isActive) {
            Triggerer.UpdateFeature(this.state, coins, this.math.actions["respin"]); 
            Triggerer.UpdateNextAction( this.state, this.math.actions["respin"]);
        }

        state.features = [coins, scatter, bonus ];
        state.win = CalculateWins.AddPays( state.features ).plus( state.win ) ;

        this.state.gameStatus.currentWin = state.win;
        this.state.gameStatus.totalWin = state.win;

        this.state.paidSpin = [state];
    }

    protected executeBuyBonus() {
        let state:SlotSpinState = new SlotSpinState(); 
        const bbAward:any = RandomHelper.GetRandomFromList( this.rng, this.math.collection["BuyBonusAward"]);
        
        const condition:SlotConditionMath = new SlotConditionMath();
        condition.oak = [bbAward.count];
        condition.symbol = 11;

        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.paidReels );
        state.reelId = selectedSet.id;
        state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout );
        state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
        state.finalGrid = Grid.ExpandSymbolInReels( this.math.info.wildSymbols[0], state.initialGrid);
        state.wins = EvaluateWins.LineWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue );
        state.win = CalculateWins.AddPays( state.wins );

        let coins:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["HoldSpin"], state);

        while( !coins.isActive || state.win.isGreaterThan(0) ){
            state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, this.math.info.gridLayout );
            state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
            state.finalGrid = Grid.ExpandSymbolInReels( this.math.info.wildSymbols[0], state.initialGrid);
            state.wins = EvaluateWins.LineWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue );

            state.wins = EvaluateWins.LineWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue );
            state.win = CalculateWins.AddPays( state.wins );

            coins = ScatterSymbolCount.checkCondition( this.math.conditions["HoldSpin"], state);
        }

        state.features = [coins ];

        CashPrize.updateCoinPrizeMath( this.state as ShinningCrownState, this.math as ShinningCrownMath );
        CashPrize.CoinsMultiplier( this.rng, coins, this.state as ShinningCrownState );

        Triggerer.UpdateFeature(this.state, coins, this.math.actions["respin"]); 
        Triggerer.UpdateNextAction( this.state, this.math.actions["respin"]);

        this.state.paidSpin = [state];
    }

    protected executeReSpin() {
        const prevState :SlotSpinState = this.state.respins.length === 0 ? this.state.paidSpin[0] : this.state.respins[this.state.respins.length-1][0]
        let state:SlotSpinState = new SlotSpinState();

        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.reSpinReels );
        state.reelId = selectedSet.id;
        state.initialGrid = CreateGrid.WeightedSymbolGrid( this.rng, selectedSet.symbols, this.math.info.gridLayout);
        state.finalGrid = Grid.UpdateSymbolsInOffsetsWithPrevGrid(prevState.features[0].offsets, state.initialGrid,  prevState.finalGrid)
        state.wins = [];
        state.win = BigNumber(0);

        const coins:SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["HoldSpin"], state);
        CashPrize.CoinsMultiplier( this.rng, coins, this.state as ShinningCrownState );

        coins.isActive = (coins.offsets.length > prevState.features[0].offsets.length ) && coins.offsets.length < 15;
        if (coins.isActive) {
            Triggerer.UpdateFeature(this.state, coins, this.math.actions["respin"]); 
        } else {
            UpdateFeature.updateReSpinCount( this.state);
            if ( this.state.respin.left === 0 || coins.offsets.length === 15) {
                this.state.respin.left = 0;
                this.state.gameStatus.nextAction = ["spin"];
                if (coins.offsets.length === 15) {
                    CashPrize.FullHouse( this.state as ShinningCrownState); 
                }
                CashPrize.CalculateMultiplier( this.state as ShinningCrownState, state);
                state.win = BigNumber(state.multiplier).multipliedBy( this.state.gameStatus.totalBet);
            }
        }
        

        this.state.gameStatus.currentWin = state.win;
        this.state.gameStatus.totalWin = BigNumber(this.state.gameStatus.totalWin).plus( state.win);
        coins.isActive = true;

        state.features = [coins ];
        this.state.respins.push( [state] );
    }

    protected getPlayResponse():ResponseModel {
        return new ShinningCrownResponseModel( this.version, this.name, this.math, this.state as ShinningCrownState);
    }

    protected getConfigResponse( response:PlayResponseModel):ResponseModel {
        return new ShinningCrownConfigResponseV2Model( this.version, this.name, this.math, this.state as ShinningCrownState);
    }

    protected defaultEmptyState():ShinningCrownState{
        return new ShinningCrownState()
    }

}
