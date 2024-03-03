import BigNumber from "bignumber.js";
import { PlatformMath } from "../../../libs/platform/base/platform_math";

export class ShinningCrownMath extends PlatformMath {

    xBetMath = [];
    cashMath = [];

    constructor(){
        super();

        this.defaultgrid = [
            [8, 12, 9],
            [6, 4, 2],
            [7, 7, 5],
            [4, 7, 2],
            [12, 11, 4]
        ];
        this.info = {
            betMultiplier: BigNumber(10),
            gridLayout:[3, 3, 3, 3, 3],
            wildSymbols:[0],
            skipEval:[9, 10, 11],
            payLines:[
                [1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0],
                [2, 2, 2, 2, 2],
                [0, 1, 2, 1, 0],
                [2, 1, 0, 1, 2],
                [1, 0, 0, 0, 1],
                [1, 2, 2, 2, 1],
                [0, 0, 1, 2, 2],
                [2, 2, 1, 0, 0],
                [1, 2, 1, 0, 1]
            ],
            symbols:[
                { name:"wild", key:"WILD", id:0, payout:[] },
                { name:"HV1", key:"HIGH", id:1, payout:[ this.bd(0), this.bd(0), this.bd(10), this.bd(50), this.bd(200), this.bd(3000)] },
                { name:"HV2", key:"HIGH", id:2, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(40), this.bd(100), this.bd(500)] },
                { name:"HV3", key:"HIGH", id:3, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(40), this.bd(100), this.bd(500)] },
                { name:"HV4", key:"HIGH", id:4, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(20), this.bd(50), this.bd(200)] },
                { name:"LV1", key:"LOW", id:5, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(10), this.bd(30), this.bd(100)] },
                { name:"LV2", key:"LOW", id:6, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(10), this.bd(30), this.bd(100)] },
                { name:"LV3", key:"LOW", id:7, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(10), this.bd(30), this.bd(100)] },
                { name:"LV4", key:"LOW", id:8, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(10), this.bd(30), this.bd(100)] },
                { name:"Scatter", key:"SCATTER", id:9, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(30), this.bd(200), this.bd(1000)] },
                { name:"Bonus", key:"SCATTER", id:10, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(200)] },
                { name:"Cash", key:"SCATTER", id:11, payout:[] },
            ]
        };

        this.buyBonus = [ { "id" : "buybonus", "cost" : 50 }];

        this.paidReels = [{
            id:"b1", weight:4,
            reels: [
                [ 1, 7, 5, 9, 6, 7, 4, 5, 3, 6, 2, 8, 7, 4, 5, 5, 5, 11, 11, 2, 6, 4, 7, 7, 7, 2, 4, 9, 6, 6, 10, 7, 8, 4, 5, 5, 5, 11, 11, 8, 5, 7, 11, 11, 6, 6, 6, 4, 8, 2, 9, 3, 8, 8, 8, 5, 1, 6, 6, 6, 4, 7, 7, 7, 3, 4, 11, 11, 8, 5, 6, 10, 8, 5, 6, 10, 8, 7, 4, 11, 11, 7, 7, 1, 3, 4, 8, 5, 8, 8, 8, 3, 2],
                [ 1, 7, 8, 9, 8, 8, 8, 5, 11, 11, 8, 6, 6, 6, 11, 11, 8, 4, 2, 9, 4, 1, 8, 8, 7, 0, 8, 7, 1, 4, 3, 4, 11, 11, 5, 5, 6, 7, 7, 6, 7, 4, 5, 5, 5, 11, 11, 7, 1, 6, 3, 7, 4, 4, 2, 0, 4, 2, 1, 5, 5, 5, 6, 5, 3, 0, 5, 3, 8, 6, 6, 11, 11, 4, 2, 3, 9, 6, 6, 4, 7, 7, 7, 2, 4, 8, 4],
                [ 3, 6, 6, 6, 11, 11, 2, 3, 4, 9, 8, 7, 5, 5, 7, 2, 3, 10, 2, 3, 11, 11, 7, 7, 7, 4, 2, 0, 4, 2, 6, 1, 5, 3, 8, 8, 5, 0, 8, 5, 5, 1, 6, 6, 6, 11, 11, 4, 3, 2, 10, 3, 2, 8, 8, 8, 7, 11, 11, 3, 6, 2, 7, 5, 2, 5, 10, 2, 7, 7, 7, 8, 6, 3, 0, 6, 3, 8, 4, 3, 2, 5, 5, 9, 3, 2, 1, 8, 11, 11],
                [ 8, 7, 4, 0, 7, 4, 6, 6, 11, 11, 4, 1, 5, 5, 5, 11, 11, 4, 1, 3, 7, 7, 2, 3, 0, 2, 3, 1, 7, 7, 1, 5, 5, 8, 0, 5, 8, 8, 6, 2, 5, 4, 11, 11, 7, 6, 6, 6, 4, 2, 3, 7, 7, 7, 4, 11, 11, 6, 5, 6, 2, 8, 8, 8, 11, 11, 2, 8, 8, 3, 9, 5, 3, 6, 6, 3, 4, 2, 5, 8, 4],
                [ 1, 7, 3, 4, 7, 5, 5, 5, 2, 3, 6, 6, 6, 10, 3, 4, 2, 11, 11, 5, 5, 5, 3, 11, 11, 5, 8, 8, 8, 2, 8, 4, 6, 11, 11, 3, 2, 7, 4, 6, 3, 8, 4, 10, 5, 6, 6, 6, 4, 3, 9, 3, 7, 7, 7, 11, 11, 3, 1, 8, 4, 10, 3, 5, 7, 7, 7, 9, 8, 8, 8, 2, 6, 10]
            ]
        }, {
            id:"b2", weight:6,
            reels:[
                [ 1, 7, 5, 9, 6, 7, 4, 5, 3, 6, 2, 8, 7, 4, 5, 5, 5, 2, 6, 4, 7, 7, 7, 2, 4, 9, 6, 6, 10, 7, 8, 4, 5, 5, 5, 8, 7, 5, 6, 6, 6, 4, 8, 2, 9, 3, 8, 8, 8, 5, 1, 6, 6, 6, 4, 7, 7, 7, 3, 4, 8, 5, 6, 10, 8, 5, 6, 10, 8, 4, 7, 7, 7, 1, 3, 4, 8, 5, 8, 8, 8, 3, 2],
                [ 1, 7, 9, 8, 8, 8, 5, 6, 6, 6, 8, 8, 4, 2, 9, 4, 1, 8, 8, 8, 7, 7, 1, 3, 4, 5, 5, 6, 4, 7, 7, 6, 7, 4, 5, 5, 5, 7, 1, 6, 3, 7, 4, 4, 4, 2, 2, 1, 5, 5, 5, 4, 6, 5, 5, 3, 3, 8, 8, 6, 6, 4, 2, 3, 9, 6, 6, 4, 7, 7, 7, 2, 8, 4],
                [ 3, 6, 6, 6, 2, 3, 4, 9, 8, 7, 7, 5, 5, 2, 3, 10, 2, 3, 7, 7, 7, 4, 4, 2, 2, 6, 1, 5, 3, 8, 8, 8, 5, 5, 5, 1, 6, 6, 6, 4, 3, 2, 10, 3, 2, 8, 8, 8, 7, 3, 6, 2, 7, 5, 2, 5, 10, 2, 7, 7, 7, 8, 6, 6, 3, 3, 8, 4, 3, 2, 5, 5, 9, 3, 2, 1, 8],
                [ 8, 7, 4, 4, 7, 6, 6, 4, 1, 5, 5, 5, 4, 1, 3, 7, 7, 2, 2, 3, 3, 1, 7, 7, 1, 5, 5, 5, 8, 8, 8, 6, 2, 5, 4, 7, 6, 6, 6, 4, 2, 3, 7, 7, 7, 4, 6, 5, 6, 2, 8, 8, 8, 2, 8, 8, 3, 9, 5, 6, 6, 3, 3, 4, 2, 5, 8, 4],
                [ 1, 7, 3, 4, 7, 5, 5, 5, 2, 3, 6, 6, 6, 10, 3, 4, 2, 5, 5, 5, 3, 5, 8, 8, 8, 2, 8, 4, 6, 3, 2, 7, 4, 6, 3, 8, 4, 10, 5, 6, 6, 6, 4, 3, 9, 3, 7, 7, 7, 3, 1, 8, 4, 10, 3, 5, 7, 7, 7, 9, 8, 8, 8, 2, 6, 10]
            ]
        }];

        this.reSpinReels = [{
            id:"c1", weight:0,
            symbols : [ 
                {symbol: 11, weight: 2 }, 
                {symbol: -1, weight: 21 }
            ]
        }];

        this.conditions["ScatterWin"] = { id:"scatter", symbol:9, minCount:3 };
        this.conditions["BonusWin"] = { id:"bonus", symbol:10, minCount:3 };
        this.conditions["HoldSpin"] = { id:"holdspin", symbol:11, minCount:5 };

        this.actions["respin"] = { triggers: ["respin"], id: "respin", spins: 3 };

        this.xBetMath = [
            { id:"XBET 1", weight:1000, multiplier:1 },
            { id:"XBET 2", weight:1000, multiplier:2 },
            { id:"XBET 3", weight:1000, multiplier:3 },
            { id:"XBET 4", weight:500, multiplier:4 },
            { id:"XBET 5", weight:500, multiplier:5 },
            { id:"XBET 6", weight:500, multiplier:6 },
            { id:"XBET 7", weight:200, multiplier:7 },
            { id:"XBET 8", weight:200, multiplier:8 },
            { id:"XBET 9", weight:200, multiplier:9 },
            { id:"XBET 10", weight:100, multiplier:10 },
            { id:"XBET 12", weight:100, multiplier:12 },
            { id:"Mini", weight:50, multiplier:25 },
            { id:"Major", weight:10, multiplier:50 },
        ],

        this.cashMath = [
            { id:"XBET", weight: 99988, multiplier: this.xBetMath, repeat: true },
            { id:"Big", weight: 10, multiplier: 1000, repeat: false } ,
            { id:"Grand", weight: 2, multiplier: 5000, repeat: false } 
        ]

    }

}
