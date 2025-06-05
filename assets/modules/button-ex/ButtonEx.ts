import {
    _decorator,
    Component,
    Input,
    Vec3,
    SpriteFrame,
    Sprite,
    Color,
    EventHandler,
    NodeEventType,
    Tween,
    tween,
    easing,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("ClickEffectData")
export class ClickEffectData {
    @property
    enabled: boolean = true;
    @property({
        visible: function () {
            return this.enabled;
        },
    })
    zoomScale: number = 1;
    @property({
        type: SpriteFrame,
        visible: function () {
            return this.enabled;
        },
    })
    public sprite: SpriteFrame = null;
    @property({
        visible: function () {
            return this.enabled;
        },
    })
    public color: Color = new Color(255, 255, 255, 255);
    @property({
        visible: function () {
            return this.enabled;
        },
    })
    duration: number = 0;
}

@ccclass("ButtonEx")
export class ButtonEx extends Component {
    @property
    private interactable: boolean = true;

    @property({ type: [ClickEffectData] })
    public normalEffect: ClickEffectData = new ClickEffectData();

    @property({ type: [ClickEffectData] })
    public hoverEffect: ClickEffectData = new ClickEffectData();

    @property({ type: [ClickEffectData] })
    public clickEffect: ClickEffectData = new ClickEffectData();

    @property({ type: [ClickEffectData] })
    public disabledEffect: ClickEffectData = new ClickEffectData();

    @property([EventHandler])
    clickEvents: EventHandler[] = [];

    private isHover: boolean = false;
    private fPointerDowning: number = 0;
    private targetSprite: Sprite = null;

    private tweenColor: Tween<Color> = null;
    private tweenScale: Tween<Vec3> = null;
    private targetScale: Vec3 = new Vec3(1, 1, 1);

    onLoad() {
        this.targetSprite = this.node.getComponent(Sprite);

        if (this.normalEffect.sprite == null) {
            this.normalEffect.sprite = this.targetSprite.spriteFrame;
        }

        if (this.hoverEffect.sprite == null) {
            this.hoverEffect.sprite = this.targetSprite.spriteFrame;
        }

        if (this.clickEffect.sprite == null) {
            this.clickEffect.sprite = this.targetSprite.spriteFrame;
        }

        if (this.disabledEffect.sprite == null) {
            this.disabledEffect.sprite = this.targetSprite.spriteFrame;
        }

        this.effectNormal();
        this.targetScale = this.node.scale.clone();
    }

    start() {
        this.updateInteractable();
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.onPointerDown, this);
        this.node.off(Input.EventType.TOUCH_END, this.onPointerUp, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onPointerUp, this);
        this.node.off(NodeEventType.MOUSE_ENTER, this.onPointerEnter, this);
        this.node.off(NodeEventType.MOUSE_LEAVE, this.onPointerLeave, this);
    }

    public setInteractable(interactable: boolean) {
        this.interactable = interactable;
        this.updateInteractable();
        if (!this.interactable) {
            this.effectDisabled();
        } else {
            this.effectNormal();
        }
    }

    get Interactable() {
        return this.interactable;
    }

    private updateInteractable() {
        if (this.interactable) {
            this.node.on(Input.EventType.TOUCH_START, this.onPointerDown, this);
            this.node.on(Input.EventType.TOUCH_END, this.onPointerUp, this);
            this.node.on(NodeEventType.MOUSE_ENTER, this.onPointerEnter, this);
            this.node.on(NodeEventType.MOUSE_LEAVE, this.onPointerLeave, this);
            this.effectNormal();
        } else {
            this.node.off(Input.EventType.TOUCH_START, this.onPointerDown, this);
            this.node.off(Input.EventType.TOUCH_END, this.onPointerUp, this);
            this.node.off(NodeEventType.MOUSE_ENTER, this.onPointerEnter, this);
            this.node.off(NodeEventType.MOUSE_LEAVE, this.onPointerLeave, this);
            this.effectDisabled();
        }
    }

    private effectDisabled() {
        if (!this.disabledEffect.enabled) {
            return;
        }

        const targetScale = new Vec3(
            this.disabledEffect.zoomScale,
            this.disabledEffect.zoomScale,
            this.disabledEffect.zoomScale
        );

        const duration = this.disabledEffect.duration;
        if (duration > 0) {
            this.animateEffect(duration, targetScale, this.disabledEffect.color);
        } else {
            this.node.setScale(targetScale);
        }
        this.targetSprite.spriteFrame = this.disabledEffect.sprite;
    }

    private effectHover() {
        if (!this.hoverEffect.enabled) {
            return;
        }

        if (!this.interactable) {
            return;
        }

        const targetScale = new Vec3(
            this.hoverEffect.zoomScale,
            this.hoverEffect.zoomScale,
            this.hoverEffect.zoomScale
        );
        this.animateEffect(this.hoverEffect.duration, targetScale, this.hoverEffect.color);
        this.targetSprite.spriteFrame = this.hoverEffect.sprite;
    }

    private effectNormal() {
        if (!this.interactable) {
            return;
        }

        this.animateEffect(this.normalEffect.duration, this.targetScale, this.normalEffect.color);
        this.targetSprite.spriteFrame = this.normalEffect.sprite;
    }

    private effectPointerDown() {
        if (!this.interactable) {
            return;
        }
        const targetScale = new Vec3(
            this.clickEffect.zoomScale,
            this.clickEffect.zoomScale,
            this.clickEffect.zoomScale
        );
        this.fPointerDowning = this.clickEffect.duration;
        this.animateEffect(this.clickEffect.duration, targetScale, this.clickEffect.color);
        this.targetSprite.spriteFrame = this.clickEffect.sprite;
    }

    private animateEffect(
        duration: number,
        targetScale: Readonly<Vec3>,
        targetColor: Readonly<Color>
    ) {
        if (this.tweenColor != null) {
            this.tweenColor.stop();
            this.tweenColor = null;
        }

        if (this.tweenScale != null) {
            this.tweenScale.stop();
            this.tweenScale = null;
        }

        let scale0 = this.node.scale.clone();

        this.tweenScale = tween(scale0)
            .to(
                duration,
                { x: targetScale.x, y: targetScale.y, z: targetScale.z },
                {
                    easing: easing.backInOut,
                    onUpdate: (target: Vec3, ratio) => {
                        this.node.setScale(target);
                    },
                }
            )
            .start();

        let color0 = this.targetSprite.color.clone();

        this.tweenColor = tween(color0)
            .to(
                duration,
                {
                    r: targetColor.r,
                    g: targetColor.g,
                    b: targetColor.b,
                    a: targetColor.a,
                },
                {
                    easing: easing.backInOut,
                    onUpdate: (target: Color, ratio) => {
                        this.targetSprite.color = target;
                        this.fPointerDowning = duration - duration * ratio;
                    },
                }
            )
            .start();
    }

    private onPointerEnter() {
        this.isHover = true;
        this.effectHover();
    }

    private onPointerLeave() {
        this.isHover = false;
        this.effectNormal();
    }

    private onPointerDown() {
        EventHandler.emitEvents(this.clickEvents);
        this.effectPointerDown();
    }

    private onPointerUp() {
        this.scheduleOnce(() => {
            if (this.isHover) {
                this.effectHover();
            } else {
                this.effectNormal();
            }
        }, this.fPointerDowning);
    }
}
