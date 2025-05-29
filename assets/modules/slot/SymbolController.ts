import { _decorator, Component, easing, Label, sp, Tween, tween, Vec3, Node, RichText } from "cc";
import { AnimationType, SymbolData } from "../symbol-manager/SymbolData";
const { ccclass, property } = _decorator;

export enum SYMBOL_ANIMATION {
    TRIGGER = "trigger",
    LANDING = "landing",
    LOOPING = "looping",
}

@ccclass("SymbolController")
export class SymbolController extends Component {
    private symbolData: SymbolData;
    private label: Label;
    private tweening: Tween<Node> | null;
    private id: string = "";
    private title: string = "";

    protected onLoad(): void {
        this.setup();
    }

    setInfo(id: string, title: string) {
        this.node.name = title;
        this.id = id;
        this.title = title;
        if (!this.label) {
            this.label = this.node.getComponentInChildren(Label);
        }
        if (this.label) {
            this.label.string = title + "\n" + id;
        }
    }

    hidden() {}

    show() {
        this.setup();
        this.stopAnimation();
    }

    get Id() {
        return this.id;
    }

    get Title() {
        return this.title;
    }

    private setup() {
        if (!this.symbolData) {
            this.symbolData = this.node.getComponent(SymbolData);
            if (!this.symbolData) {
                console.warn("SymbolData not found", this.node.name);
            }
        }
        if (!this.label) {
            this.label = this.node.getComponentInChildren(Label);
        }
    }

    private playTextAnimation() {
        if (this.label.string.length > 0) {
            this.stopTextAnimation();
            this.tweening = tween(this.label.node)
                .to(0.5, { scale: new Vec3(1.7, 1.7, 1.7) }, { easing: easing.quadOut })
                .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: easing.quadIn })
                .union()
                .repeatForever()
                .start();
        } else if (this.label.string.length == 0) {
            this.stopTextAnimation();
        }
    }

    private stopTextAnimation() {
        if (this.tweening) {
            this.tweening.stop();
            this.label.node.scale = new Vec3(1, 1, 1);
            this.tweening = null;
        }
    }

    playLanding(timeScale: number = 1, looping: boolean = true) {
        this.symbolData.play(AnimationType.LANDING, looping, timeScale);
    }

    playTrigger() {
        this.symbolData.play(AnimationType.TRIGGER, true);
    }

    playLooping() {
        this.symbolData.play(AnimationType.LOOPING, true);
    }

    stopAnimation() {
        this.symbolData.stop();
        this.stopTextAnimation();
    }

    copyFrom(src: SymbolData) {
        this.symbolData.copyFrom(src);
        this.symbolData.setInfo(src.Id, src.Title);
        this.symbolData.stop();
        this.symbolData.setColor(src.Color);
    }

    showDebug(isDebug: boolean) {
        if (this.label) {
            this.label.enabled = isDebug;
        }
    }
}
