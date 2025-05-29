import { _decorator, Component, easing, Label, sp, Tween, tween, Vec3, Node, RichText } from "cc";
const { ccclass, property } = _decorator;

export enum SYMBOL_ANIMATION {
    TRIGGER = "trigger",
    LANDING = "landing",
    LOOPING = "looping",
}

@ccclass("SymbolController")
export class SymbolController extends Component {
    private triggerAnimation: string = "";
    private landingAnimation: string = "";
    private loopingAnimation: string = "";
    private nameAnimation: string = "";
    private skeleton: sp.Skeleton;
    private richText: RichText;
    private tweening: Tween<Node> | null;
    private animatinoNames: string[] = [];
    private id: string = "";
    private title: string = "";

    protected onLoad(): void {
        this.setup();
    }

    setInfo(id: string, title: string) {
        this.node.name = title;
        this.id = id;
        this.title = title;
        if (!this.richText) {
            this.richText = this.node.getComponentInChildren(RichText);
        }
        if (this.richText) {
            this.richText.string = `<color=#ffffff>${title}</color>\n<color=#00ff00>${id}</color>`;
        }
    }

    hidden() {
        this.skeleton.enabled = false;
    }

    show() {
        this.skeleton.enabled = true;
        this.setup();
        this.stopAnimation();
    }

    get Id() {
        return this.id;
    }

    get Title() {
        return this.title;
    }

    private setup0() {
        if (!this.skeleton) {
            this.skeleton = this.node.getComponent(sp.Skeleton);
        }
    }

    private setup() {
        this.setup0();
        this.animatinoNames = Object.keys(this.skeleton.skeletonData.getAnimsEnum());

        this.triggerAnimation = "";
        this.landingAnimation = "";
        this.loopingAnimation = "";
        this.nameAnimation = "";
        for (const name of this.animatinoNames) {
            if (name.includes(SYMBOL_ANIMATION.TRIGGER)) {
                this.triggerAnimation = name;
            } else if (name.includes(SYMBOL_ANIMATION.LANDING)) {
                this.landingAnimation = name;
            } else if (name.includes(SYMBOL_ANIMATION.LOOPING)) {
                this.loopingAnimation = name;
            } else if (name == this.title) {
                this.nameAnimation = name;
            }
        }
    }

    private playTextAnimation() {
        if (this.richText.string.length > 0) {
            this.stopTextAnimation();
            this.tweening = tween(this.richText.node)
                .to(0.5, { scale: new Vec3(1.7, 1.7, 1.7) }, { easing: easing.quadOut })
                .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: easing.quadIn })
                .union()
                .repeatForever()
                .start();
        } else if (this.richText.string.length == 0) {
            this.stopTextAnimation();
        }
    }

    private stopTextAnimation() {
        if (this.tweening) {
            this.tweening.stop();
            this.richText.node.scale = new Vec3(1, 1, 1);
            this.tweening = null;
        }
    }

    playLanding(timeScale: number = 1, looping: boolean = true) {
        this.skeleton.paused = false;
        this.skeleton.timeScale = timeScale;
        if (this.landingAnimation) {
            this.skeleton.setAnimation(0, this.landingAnimation, looping);
        } else if (this.nameAnimation) {
            this.skeleton.setAnimation(0, this.nameAnimation, true);
            this.skeleton.paused = true;
        }
    }

    playTrigger() {
        this.skeleton.paused = false;
        this.skeleton.timeScale = 1;
        if (this.triggerAnimation) {
            this.skeleton.setAnimation(0, this.triggerAnimation, true);
        } else if (this.nameAnimation) {
            this.skeleton.setAnimation(0, this.nameAnimation, true);
        } else {
            this.stopAnimation();
        }
        this.playTextAnimation();
    }

    playLooping() {
        if (this.loopingAnimation) {
            this.skeleton.setAnimation(0, this.loopingAnimation, true);
        }
    }

    stopAnimation() {
        this.playLanding(1, false);
        this.stopTextAnimation();
    }

    copyFrom(src: SymbolController) {
        this.setup0();
        this.setInfo(src.Id, src.Title);
        this.node.name = src.Title;
        this.skeleton.skeletonData = src.skeleton.skeletonData;
        this.skeleton.color = src.skeleton.color;
    }
}
