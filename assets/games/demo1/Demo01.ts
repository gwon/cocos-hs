import { _decorator, Component, Node } from "cc";
import { API } from "../../modules/rg-api/api";
import { extractStrWheels } from "../../modules/utils/utils";
import { ApiResponse } from "../../modules/rg-api/apidata";
import { SlotController } from "../../modules/slot/SlotController";
import { SymbolManager } from "../../modules/symbol-manager/SymbolManager";
import { Ui } from "./Ui";
const { ccclass, property } = _decorator;

const DELAY_STOP = 1;

@ccclass("Demo01")
export class Demo01 extends Component {
    api: API;
    slotController: SlotController;
    response: ApiResponse | null = null;
    private currentType: number = 0;
    private delayStop: number = 0;
    private currentBalance: number = 0;
    private Currency: string = "";
    private symbolManager: SymbolManager;
    private url: string = "https://smdev1.back138.com/GameSeriesV54/api/";
    private gamecode: string = "40038";
    private token: string =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VybmFtZUB1c2VybmFtZTc3IiwianRpIjoiMGY4MmFiZDYtN2UyMy00YTExLTljMzAtZDIwNDIyYjQxNWFjIiwidWlkIjoiMzQwIiwib29pZCI6IjEiLCJwb2lkIjoiMiIsImN1cnIiOiJNWVIiLCJsYiI6IlswLjAxLDAuMDIsMC4wMywwLjA0LDAuMDUsMC4wNiwwLjA3LDAuMDgsMC4wOSwwLjEsMC4xMiwwLjE0LDAuMTYsMC4xOCwwLjIsMC4yNSwwLjMsMC4zNSwwLjQsMC40NSwwLjUsMC42LDAuNywwLjgsMC45LDEsMS4yLDEuNCwxLjYsMS44LDIsMi41LDMsMy41LDQsNSw2LDcsOCw5LDEwLDEyXSIsInIiOiIxIiwiaXNyZSI6IlRydWUiLCJyaHQiOiIxIiwiZXhwIjoxNzU1NDQwMDQ0LCJpc3MiOiI1NCIsImF1ZCI6IjQwMDM4In0.NSG59DH60mTxbUMBMG7-9MZ16A8jeBKYgzMvj7LM3Oo";
    private dic: Map<string, string> = new Map();
    private ui: Ui = null;
    start() {
        this.symbolManager = this.node.getComponentInChildren(SymbolManager);
        this.slotController = this.node.getComponentInChildren(SlotController);
        this.api = new API(this.url, this.token, this.gamecode);

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
        this.slotController.setup({
            symbolManager: this.symbolManager,
            spinTime: 1,
            playWinDelay: 1,
            stopOptions: {
                orderDelay: 1,
            },
            debug: true,
        });
        this.login();
        this.ui = this.node.getComponentInChildren(Ui);
        this.slotController.onComplete(() => {
            this.ui.activeSpinButton(true);
        });
    }

    login() {
        this.api.login((data: ApiResponse) => {
            console.log("### login result ###", data);
            this.updateResult(data);
            this.slotController.fillLogin(data);
        });
    }

    spin() {
        this.ui.activeSpinButton(false);
        this.response = null;
        this.slotController.spins();
        this.api.transact(this.currentType, (data: ApiResponse) => {
            console.log("### spin result ###", data);
            this.updateResult(data);
            this.slotController.stops(data);
            this.delayStop = DELAY_STOP;
        });
    }

    updateResult(data: ApiResponse) {
        const { Balance } = data.Player ? data.Player : { Balance: this.currentBalance };
        if (data.Player) {
            const { Balance, Currency } = data.Player;
            this.currentBalance = Balance;
            if (Currency) {
                this.Currency = Currency;
            }
        }

        const { Type, FreeSpin } = data.Current;

        const { Type: NextType } = data.Next;
        this.currentType = NextType;
        this.ui.setScoreWallet(this.currentBalance);
    }

    update(deltaTime: number) {
        if (this.delayStop > 0) {
            this.delayStop -= deltaTime;
        } else if (this.response) {
            this.slotController.stops(this.response);
            this.response = null;
        }
    }
}
