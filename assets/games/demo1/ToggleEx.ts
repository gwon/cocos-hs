import { Sprite, Toggle, Color, SpriteFrame, EventTouch, Input } from "cc";
import { _decorator, Component, Node } from "cc";
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass("ToggleEx")
@executeInEditMode
export class ToggleEx extends Component {
    private targetSprite: Sprite = null;

    @property(SpriteFrame)
    private onSpriteFrame: SpriteFrame = null;

    @property(SpriteFrame)
    private offSpriteFrame: SpriteFrame = null;

    @property
    active: boolean = true;

    @property
    private _isOn: boolean = true;

    @property
    get isOn(): boolean {
        return this._isOn;
    }

    set isOn(value: boolean) {
        if (this._isOn !== value) {
            this._isOn = value;
            this.updateSprite();
            this.onToggleChanged(value);
        }
    }

    private setup0() {
        if (this.targetSprite == null) {
            this.targetSprite = this.node.getComponent(Sprite);
            if (this.targetSprite && this.targetSprite.spriteFrame) {
                if (this.onSpriteFrame == null) {
                    this.onSpriteFrame = this.targetSprite.spriteFrame;
                }
                if (this.offSpriteFrame == null) {
                    this.offSpriteFrame = this.targetSprite.spriteFrame;
                }
            }
        }
    }

    protected onLoad(): void {
        this.setup0();
    }

    start() {
        this.updateSprite();

        if (this.active) {
            this.node.on(Input.EventType.TOUCH_END, this.onToggleClick, this);
        }
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_END, this.onToggleClick, this);
    }

    private updateSprite(): void {
        this.setup0();
        if (!this.targetSprite) return;
        if (this._isOn && this.onSpriteFrame) {
            this.targetSprite.spriteFrame = this.onSpriteFrame;
        } else if (!this._isOn && this.offSpriteFrame) {
            this.targetSprite.spriteFrame = this.offSpriteFrame;
        }
    }

    private onToggleClick(event: EventTouch): void {
        if (!this.active) return;
        this.toggle();
    }

    public toggle(): void {
        this.isOn = !this._isOn;
    }

    public setToggleState(state: boolean): void {
        this.isOn = state;
    }

    private onToggleChanged(newState: boolean): void {
        this.setup0();
        console.log("Toggle state changed to:", newState);
        // this.node.emit("toggle-changed", newState);
    }

    public getToggleState(): boolean {
        return this._isOn;
    }

    public setActive(active: boolean): void {
        this.active = active;
        if (active) {
            this.node.on(Input.EventType.TOUCH_END, this.onToggleClick, this);
            this.node.on(Input.EventType.MOUSE_UP, this.onToggleClick, this);
        } else {
            this.node.off(Input.EventType.TOUCH_END, this.onToggleClick, this);
            this.node.off(Input.EventType.MOUSE_UP, this.onToggleClick, this);
        }
    }
}
