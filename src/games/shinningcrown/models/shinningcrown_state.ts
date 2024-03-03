import { SlotState } from "../../../libs/engine/slots/models/slot_state_model";

export class ShinningCrownState extends SlotState {

    public cashPrizes :{offset:number, id:string, multiplier:number}[] = [];
    public cashPrizesMath = [] ; 
    public awardedJackpots = [];

}
