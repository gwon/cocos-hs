import { SlotControllerSettings } from "./SlotController";
import { _decorator, Component, Node } from "cc";
import { DIRECTION, STATE, ReelController } from "./ReelController";
import { WinResultItem, ApiResponse } from "../rg-api/apidata";
import { SymbolManager } from "../symbol-manager/SymbolManager";
import { extractStrWheels, extractWinResult, randomMinMax } from "../utils/utils";
const { ccclass, property } = _decorator;

const SPIN_TIME = 1;

enum SPIN_STATE {
    SPINNING,
    STOPING,
    STOPED,
}

export class SlotStopDelay {
    delay: number;
}

export class SlotStopDelayOrder {
    orderDelay: number;
}

export class SlotStopRandom {
    min: number;
    max: number;
}

export interface SlotControllerSettings {
    symbolManager: SymbolManager;
    spinTime: number;
    playWinDelay: number;
    stopOptions: SlotStopDelay | SlotStopRandom | SlotStopDelayOrder;
    debug: boolean;
}

// เพิ่ม Type Guard functions
function isSlotStopDelay(option: any): option is SlotStopDelay {
    return "delay" in option;
}

function isSlotStopRandom(option: any): option is SlotStopRandom {
    return "min" in option && "max" in option;
}

function isSlotStopDelayOrder(option: any): option is SlotStopDelayOrder {
    return "orderDelay" in option;
}

@ccclass("SlotController")
export class SlotController extends Component {
    private spinState: SPIN_STATE = SPIN_STATE.STOPED;
    private spinTime = 0;
    private spinTimeMax = 0;
    private reelControllers: ReelController[] = [];
    private sWheels: string[][] = [];
    private winResult: WinResultItem[] = [];

    private settings: SlotControllerSettings = {
        symbolManager: null,
        spinTime: SPIN_TIME,
        playWinDelay: 0.5,
        stopOptions: null,
        debug: false,
    };

    protected onLoad(): void {}

    get RowCount() {
        return this.reelControllers[0].DisplaySize;
    }

    get ColCount() {
        return this.reelControllers.length;
    }

    private completeCallback: () => void = () => {};

    start() {}

    setup(settings: SlotControllerSettings) {
        this.settings = settings;
        this.reelControllers = this.getComponentsInChildren(ReelController);
        this.spinTimeMax = settings.spinTime;
        this.spinState = SPIN_STATE.STOPED;
        for (let i = 0; i < this.reelControllers.length; i++) {
            const reel = this.reelControllers[i];
            reel.setup(i, this.settings.symbolManager);
            reel.onComplete((self: ReelController) => {
                let idleCount = 0;
                for (const reel of this.reelControllers) {
                    if (reel.State == STATE.IDLE) {
                        idleCount++;
                    }
                }
                if (idleCount == this.reelControllers.length) {
                    for (const reel of this.reelControllers) {
                        reel.playWin(this.settings.playWinDelay);
                    }
                    this.completeCallback();
                }
            });
            this.scheduleOnce(() => {
                reel.showDebug(this.settings.debug);
            }, 0);
        }
    }

    onComplete(callback: () => void) {
        this.completeCallback = callback;
    }

    fillLogin(apiResponse: ApiResponse) {
        const sWheels: string[][] = extractStrWheels(apiResponse);
        if (sWheels == null) {
            return;
        }

        if (sWheels.length != this.reelControllers.length) {
            console.warn(
                `sWheels.length(${sWheels.length}) != this.reelControllers.length(${this.reelControllers.length}) `
            );
        }

        const minLoop = Math.min(sWheels.length, this.reelControllers.length);
        for (let i = 0; i < minLoop; i++) {
            const reelController = this.reelControllers[i];
            const symbols = sWheels[i];
            reelController.fillSymbols(symbols);
        }
    }

    stopAnimation() {
        for (const reel of this.reelControllers) {
            reel.stopAnimation();
        }
    }

    spins(direction: DIRECTION = DIRECTION.DOWN) {
        this.spinState = SPIN_STATE.SPINNING;
        this.spinTime = this.spinTimeMax;
        for (const reel of this.reelControllers) {
            this.scheduleOnce(() => {
                reel.spin(direction);
            }, 0.5);
        }
    }

    stops(apiResponse: ApiResponse) {
        const sWheels: string[][] = extractStrWheels(apiResponse);
        const winResult: WinResultItem[] = extractWinResult(apiResponse);
        this.spinState = SPIN_STATE.STOPING;
        this.sWheels = sWheels;
        this.winResult = winResult;

        if (sWheels.length != this.reelControllers.length) {
            console.error(
                `sWheels.length(${sWheels.length}) != this.reelControllers.length(${this.reelControllers.length}) `
            );
            return null;
        }
    }

    private getStopDelay(at: number) {
        const stopOptions = this.settings.stopOptions;
        if (isSlotStopDelay(stopOptions)) {
            const delay = stopOptions.delay;
            return delay;
        } else if (isSlotStopRandom(stopOptions)) {
            const delay = randomMinMax(stopOptions.min, stopOptions.max);
            return delay;
        } else if (isSlotStopDelayOrder(stopOptions)) {
            const delay = stopOptions.orderDelay * at;
            return delay;
        }
        console.warn("Unknown stopOptions", stopOptions);
        return 0; // เพิ่ม default return
    }

    private doStop() {
        this.spinState = SPIN_STATE.STOPED;
        this.spinTime = 0;
        for (let i = 0; i < this.sWheels.length; i++) {
            const delay = this.getStopDelay(i);
            const reel = this.reelControllers[i];
            if (reel == undefined) {
                return;
            }
            const sSymbols = this.sWheels[i];
            this.scheduleOnce(() => {
                reel.stopByIds(3, sSymbols);
                for (const win of this.winResult) {
                    const vals = win.AWP[i];
                    if (vals != undefined) {
                        reel.win(vals);
                    }
                }
            }, delay);
        }
    }

    update(deltaTime: number) {
        if (this.spinState == SPIN_STATE.SPINNING) {
            this.spinTime -= deltaTime;
        } else if (this.spinState == SPIN_STATE.STOPING) {
            this.spinTime -= deltaTime;
            if (this.spinTime <= 0) {
                this.doStop();
            }
        }
    }
}
