import { PlatformMath } from "../../../libs/platform/base/platform_math";
import { PlayResponseV2Model } from "../../../libs/platform/slots/responses_v2";
import { ShinningCrownState } from "./shinningcrown_state";

export class ShinningCrownResponseModel extends PlayResponseV2Model {

    constructor( version:string, name:string, math:PlatformMath, state:ShinningCrownState ) {
        super( version, name, math, state);
    }
}
