import { _decorator, Component, EventHandle, EventHandler, Node } from "cc";
import { SymbolManager } from "../symbol-manager/SymbolManager";
import { SlotControllerSettings, SlotController } from "../slot/SlotController";
import { SlotStopDelay, SlotStopRandom, SlotStopDelayOrder } from "../slot/SlotController";
const { ccclass, property } = _decorator;

@ccclass("NocodeLogic")
export class NocodeLogic extends Component {
    @property(SymbolManager)
    symbolManager: SymbolManager = null;

    @property(SlotController)
    slotController: SlotController = null;

    @property
    spinTime: number = 0;

    @property
    playWinDelay: number = 0;

    @property
    stopOptions: SlotStopDelay | SlotStopRandom | SlotStopDelayOrder = null;

    @property
    debug: boolean = false;

    @property([EventHandler])
    startEvents: EventHandler[] = [];

    onLoad() {
        if (this.symbolManager == null) {
            this.symbolManager = this.node.parent.getComponentInChildren(SymbolManager);
        }

        if (this.symbolManager == null) {
            console.warn(
                "SymbolManager is not found please add SymbolManager to the parent node or set Symbol Manager property"
            );
            return;
        }

        if (this.slotController == null) {
            this.slotController = this.node.getComponentInChildren(SlotController);
        }

        if (this.slotController == null) {
            console.warn(
                "SlotController is not found please add SlotController to the parent node or set Slot Controller property"
            );
            return;
        }

        const settings: SlotControllerSettings = {
            symbolManager: this.symbolManager,
            spinTime: this.spinTime,
            playWinDelay: this.playWinDelay,
            stopOptions: this.stopOptions,
            debug: this.debug,
        };

        this.slotController.setup(settings);
    }

    start() {
        this.scheduleOnce(() => {
            EventHandler.emitEvents(this.startEvents);
        }, 0);
    }
}
