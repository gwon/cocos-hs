import { _decorator, Button, Component, Label } from "cc";
import { SlotController } from "./SlotController";
import { SymbolManager } from "../symbol-manager/SymbolManager";
import { getRandomFromArray } from "../utils/utils";
import { loginData } from "../mockdatas/login";
import { getDataFrom as genDataFrom } from "../mockdatas/mockdata";
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
                orderDelay: 1,
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

    randomSSlot(extIds: string[]) {
        const ids = this.allId();
        ids.push(...extIds);
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

        this.lbIds.string = slot.map((row) => row.join(",")).join("\n");
        const data = genDataFrom(slot);
        return data;
    }

    fill() {
        const data = this.randomSSlot([]);
        this.slotController.fillLogin(data);
    }

    spin() {
        this.slotController.spins();
    }

    stop() {
        const normalData = this.randomSSlot([]);
        this.slotController.stops(normalData);
    }

    fillError() {
        const fakeIds = ["123", "356", "453", "444", "234"];
        const data = this.randomSSlot(fakeIds);
        this.slotController.fillLogin(data);
    }

    fillLogin() {
        console.log("fillLogin");
        const login = loginData;
        this.slotController.fillLogin(login);
    }
}
