import { _decorator, Button, Component, Node } from "cc";
import { AnimationType, SymbolData } from "./SymbolData";
import { SymbolManager } from "./SymbolManager";
const { ccclass, property } = _decorator;

@ccclass("SymbolManagerTest")
export class SymbolManagerTest extends Component {
    symbolDatas: SymbolData[] = [];
    symbolManager: SymbolManager = null;
    symbolTestDatas: SymbolData[] = [];

    start() {
        this.symbolDatas = this.node.parent.getComponentsInChildren(SymbolData);
        this.symbolManager = this.node.parent.getComponentInChildren(SymbolManager);
        this.symbolTestDatas = this.node.getComponentsInChildren(SymbolData);

        const buttons = this.node.getComponentsInChildren(Button);
        for (const button of buttons) {
            if (button.node.name.toLocaleLowerCase().indexOf("trigger") >= 0) {
                button.node.on(Button.EventType.CLICK, () => {
                    this.playTrigger();
                });
            } else if (button.node.name.toLocaleLowerCase().indexOf("landing") >= 0) {
                button.node.on(Button.EventType.CLICK, () => {
                    this.playLanding();
                });
            } else if (button.node.name.toLocaleLowerCase().indexOf("looping") >= 0) {
                button.node.on(Button.EventType.CLICK, () => {
                    this.playLooping();
                });
            } else if (button.node.name.toLocaleLowerCase().indexOf("random") >= 0) {
                button.node.on(Button.EventType.CLICK, () => {
                    this.setRandom();
                });
            } else if (button.node.name.toLocaleLowerCase().indexOf("continuestop") >= 0) {
                button.node.on(Button.EventType.CLICK, () => {
                    this.continueStop();
                });
            } else if (button.node.name.toLocaleLowerCase().indexOf("stop") >= 0) {
                button.node.on(Button.EventType.CLICK, () => {
                    this.stopAll();
                });
            } else if (button.node.name.toLocaleLowerCase().indexOf("last1") >= 0) {
                button.node.on(Button.EventType.CLICK, () => {
                    this.playLast1();
                });
            } else if (button.node.name.toLocaleLowerCase().indexOf("setdic") >= 0) {
                button.node.on(Button.EventType.CLICK, () => {
                    this.setDic();
                });
            } else {
                console.warn("button", button.node.name, " not found event");
            }
        }
    }

    stopAll() {
        for (const symbolData of this.symbolDatas) {
            symbolData.stop();
        }

        for (const symbolData of this.symbolTestDatas) {
            symbolData.stop();
        }
    }

    playTrigger() {
        this.stopAll();
        for (const symbolData of this.symbolDatas) {
            symbolData.play(AnimationType.TRIGGER, true);
        }

        for (const symbolData of this.symbolTestDatas) {
            symbolData.play(AnimationType.TRIGGER, true);
        }
    }

    playLanding() {
        this.stopAll();
        for (const symbolData of this.symbolDatas) {
            symbolData.play(AnimationType.LANDING, true);
        }

        for (const symbolData of this.symbolTestDatas) {
            symbolData.play(AnimationType.LANDING, true);
        }
    }

    playLooping() {
        this.stopAll();
        for (const symbolData of this.symbolDatas) {
            symbolData.play(AnimationType.LOOPING, true);
        }

        for (const symbolData of this.symbolTestDatas) {
            symbolData.play(AnimationType.LOOPING, true);
        }
    }

    playLast1() {
        for (const symbolData of this.symbolDatas) {
            symbolData.playLast1();
        }

        for (const symbolData of this.symbolTestDatas) {
            symbolData.playLast1();
        }
    }

    continueStop() {
        console.log("continueStop");
        for (const symbolData of this.symbolDatas) {
            console.log("continueStop", symbolData.node.name);
            symbolData.continueStop();
        }

        for (const symbolData of this.symbolTestDatas) {
            console.log("continueStop", symbolData.node.name);
            symbolData.continueStop();
        }
    }

    setRandom() {
        this.stopAll();
        for (const symbolData of this.symbolTestDatas) {
            const randomSymbol = this.symbolManager.getRandomSymbol();
            symbolData.copyFrom(randomSymbol);
        }
    }

    setDic() {
        const dic = new Map<string, string>();
        dic.set("101", "L1");
        dic.set("102", "L2");
        dic.set("103", "L3");
        dic.set("104", "L4");
        dic.set("201", "H1");
        dic.set("202", "H2");
        dic.set("203", "H3");
        dic.set("204", "H4");
        dic.set("1", "Wild");
        dic.set("25", "Scatter");
        this.symbolManager.setup(dic);
    }
}
