import { _decorator, Component, Sprite, Label, Color, tween, Tween } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Blackdrop")
export class Blackdrop extends Component {
    spin: Sprite = null;
    blackdrop: Sprite = null;
    label: Label = null;

    @property
    spinSpeed: number = 100;

    @property
    fadeTime: number = 1;

    lastTween: Tween<Color> = null;

    onLoad() {
        this.spin = this.getComponentInChildren(Sprite);
        this.blackdrop = this.getComponent(Sprite);
        this.label = this.getComponentInChildren(Label);
    }

    update(deltaTime: number) {
        if (this.node.active) {
            this.spin.node.angle += this.spinSpeed * deltaTime;
        }
    }

    setText(text: string) {
        this.label.string = text;
    }

    setSpinSpeed(speed: number) {
        this.spinSpeed = speed;
    }

    setFadeTime(time: number) {
        this.fadeTime = time;
    }

    hide() {
        if (this.lastTween) {
            this.lastTween.stop();
            this.lastTween = null;
        }
        this.node.active = true;
        let color = new Color(0, 0, 0, 255);
        this.blackdrop.color = color;
        this.lastTween = tween(color)
            .to(
                this.fadeTime,
                { a: 0 },
                {
                    onUpdate: (target: Color, ratio) => {
                        this.blackdrop.color = target;
                    },
                    onComplete: () => {
                        this.node.active = false;
                    },
                }
            )
            .start();
    }

    show() {
        if (this.lastTween) {
            this.lastTween.stop();
            this.lastTween = null;
        }
        this.node.active = true;
        let color = new Color(1, 0, 0, 0);
        this.blackdrop.color = color;
        this.lastTween = tween(color)
            .to(
                this.fadeTime,
                { a: 255 },
                {
                    onUpdate: (target: Color, ratio) => {
                        console.log("ffffffffffff", target.a);
                        this.blackdrop.color = target;
                    },
                    onComplete: () => {},
                }
            )
            .start();
    }
}
