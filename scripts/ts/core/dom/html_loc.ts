import { DebugLevelEnum, log } from '../utils/console_wrapper';
import { Elements } from './../dom/elements';
log('html loc loaded.', DebugLevelEnum.BASIC);
export enum AppEnum {
    INFORMATION_FORAGING = 'information-foraging',
    COGNITIVE_LOAD = 'cognitive-load',
    GENDER_MAG = 'gender-mag',
    ERROR = 'error',
}

export enum ModeEnum {
    REAL = 'real',
    SANDBOX = 'sandbox',
    TEST = 'test',
    ERROR = 'error',
}

export class HTMLLoc {
    public static elem = Elements.htmlLoc;
    public static app: AppEnum;
    public static mode: ModeEnum;
    public static scenario: string;

    public static setup() {
        HTMLLoc.app = (HTMLLoc.elem.dataset.app as AppEnum) || AppEnum.ERROR;
        HTMLLoc.mode =
            (HTMLLoc.elem.dataset.mode as ModeEnum) || ModeEnum.ERROR;
        HTMLLoc.scenario = HTMLLoc.elem.dataset.scenario || 'error';
    }
}
