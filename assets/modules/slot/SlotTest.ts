import { _decorator, Button, Component, Label } from "cc";
import { SlotController } from "./SlotController";
import { SymbolManager } from "../symbol-manager/SymbolManager";
import { extractStrWheels, getRandomFromArray } from "../utils/utils";
import { loginData } from "../mockdatas/login";
const { ccclass, property } = _decorator;

@ccclass("SlotTest")
export class SlotTest extends Component {
    @property(Label)
    private lbIds: Label;
    @property(Label)
    private lbNames: Label;

    @property(Button)
    private btnFill: Button;
    @property(Button)
    private btnSpin: Button;
    @property(Button)
    private btnStop: Button;
    @property(Button)
    private btnFillError: Button;
    @property(Button)
    private btnFillLogin: Button;

    private slotController: SlotController;
    private symbolManager: SymbolManager;
    private dic: Map<string, string> = new Map();

    start() {
        this.btnFill.node.on(Button.EventType.CLICK, () => {
            this.fill();
        });
        this.btnSpin.node.on(Button.EventType.CLICK, () => {
            this.spin();
        });
        this.btnStop.node.on(Button.EventType.CLICK, () => {
            this.stop();
        });
        this.btnFillError.node.on(Button.EventType.CLICK, () => {
            this.fillError();
        });
        this.btnFillLogin.node.on(Button.EventType.CLICK, () => {
            this.fillLogin();
        });
        this.slotController = this.node.parent.getComponentInChildren(SlotController);
        this.symbolManager = this.node.parent.getComponentInChildren(SymbolManager);
        this.slotController.setup({
            symbolManager: this.symbolManager,
            spinTime: 1,
            playWinDelay: 1,
            stopOptions: {
                delay: 1,
            },
            debug: true,
        });

        this.dic.set("101", "L1");
        this.dic.set("102", "L2");
        this.dic.set("103", "L3");
        this.dic.set("104", "L4");
        this.dic.set("201", "H1");
        this.dic.set("202", "H2");
        this.dic.set("203", "H3");
        this.dic.set("204", "H4");
        this.dic.set("1", "Wild");
        this.dic.set("25", "Scatter");
        this.symbolManager.setup(this.dic);
        this.lbIds.string = "";
        this.lbNames.string = "";
    }

    allId() {
        const ids = Array.from(this.dic.keys());
        return ids;
    }

    randomSSlot(ids: string[]) {
        const maxRow = this.slotController.RowCount;
        const maxCol = this.slotController.ColCount;
        const slot: string[][] = [];
        for (let row = 0; row < maxRow; row++) {
            const reel: string[] = [];
            for (let col = 0; col < maxCol; col++) {
                reel.push(getRandomFromArray(ids));
            }
            slot.push(reel);
        }
        return slot;
    }

    fill() {
        const ids = this.allId();
        const slot = this.randomSSlot(ids);
        this.slotController.fillLogin(slot);
    }

    spin() {
        this.slotController.spins();
    }

    stop() {
        const ids = this.allId();
        const slot = this.randomSSlot(ids);
        const sWheels: string[][] = extractStrWheels(loginData);

        this.lbIds.string = sWheels.map((row) => row.join(",")).join("\n");

        this.slotController.stops(loginData);
    }

    fillError() {
        const fakeIds = ["123", "356", "453", "444", "234"];
        const ids = this.allId();
        ids.push(...fakeIds);
        const slot = this.randomSSlot(ids);
        this.slotController.fillLogin(slot);
    }

    fillLogin() {
        console.log("fillLogin");
        const login = loginData;
        this.slotController.fillLogin(login);
    }
}
