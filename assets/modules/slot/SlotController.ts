import { _decorator, Component, Node } from "cc";
import { DIRECTION, STATE, WheelController } from "./WheelController";
import { WinResultItem } from "../rg-api/apidata";
import { SymbolManager } from "../symbol-manager/SymbolManager";
import { randomMinMax } from "../utils/utils";
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
    private wheelControllers: WheelController[] = [];
    private sWheels: string[][] = [];
    private winResult: WinResultItem[] = [];
    private settings: SlotControllerSettings = {
        symbolManager: null,
        spinTime: SPIN_TIME,
        playWinDelay: 0.5,
        stopOptions: null,
    };

    protected onLoad(): void {}

    start() {}

    setup(settings: SlotControllerSettings) {
        this.settings = settings;
        this.wheelControllers = this.getComponentsInChildren(WheelController);
        this.spinTimeMax = settings.spinTime;
        this.spinState = SPIN_STATE.STOPED;
        for (let i = 0; i < this.wheelControllers.length; i++) {
            const wheel = this.wheelControllers[i];
            wheel.setup(i, this.settings.symbolManager);
            wheel.onComplete((self: WheelController) => {
                let idleCount = 0;
                for (const wheel of this.wheelControllers) {
                    if (wheel.State == STATE.IDLE) {
                        idleCount++;
                    }
                }
                if (idleCount == this.wheelControllers.length) {
                    for (const wheel of this.wheelControllers) {
                        wheel.playWin(this.settings.playWinDelay);
                    }
                }
            });
        }
    }

    fillLogin(sWheels: string[][]) {
        if (sWheels == null) {
            return;
        }

        for (let i = 0; i < sWheels.length; i++) {
            const wheelController = this.wheelControllers[i];
            const symbols = sWheels[i];
            wheelController.fillSymbols(symbols);
        }
    }

    stopAnimation() {
        for (const wheel of this.wheelControllers) {
            wheel.stopAnimation();
        }
    }

    spins(direction: DIRECTION = DIRECTION.DOWN) {
        this.spinState = SPIN_STATE.SPINNING;
        this.spinTime = this.spinTimeMax;
        for (const wheel of this.wheelControllers) {
            this.scheduleOnce(() => {
                wheel.spin(direction);
            }, 0.5);
        }
    }

    stops(sWheels: string[][], winResult: WinResultItem[]) {
        this.spinState = SPIN_STATE.STOPING;
        this.sWheels = sWheels;
        this.winResult = winResult;

        if (sWheels.length != this.wheelControllers.length) {
            console.error(
                `sWheels.length(${sWheels.length}) != this.wheelControllers.length(${this.wheelControllers.length}) `
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
            const wheel = this.wheelControllers[i];
            if (wheel == undefined) {
                return;
            }
            const sSymbols = this.sWheels[i];
            this.scheduleOnce(() => {
                wheel.stopByIds(3, sSymbols);
                for (const win of this.winResult) {
                    const vals = win.AWP[i];
                    if (vals != undefined) {
                        wheel.win(vals);
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
