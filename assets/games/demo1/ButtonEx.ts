import {
    _decorator,
    Component,
    Node,
    EventTouch,
    Input,
    UITransform,
    Vec3,
    Camera,
    find,
    SpriteFrame,
    Sprite,
    Color,
    Enum,
    EventHandler,
} from "cc";

const { ccclass, property } = _decorator;

enum ClickEffectState {
    Normal = 0,
    Hover,
    Down,
    Click,
}

@ccclass("ClickEffectData")
export class ClickEffectData {
    @property({ type: Enum(ClickEffectState) })
    state: ClickEffectState = ClickEffectState.Normal;

    @property
    zoomScale: number = 1;
    @property
    zoomDuration: number = 0;
    @property(SpriteFrame)
    public sprite: SpriteFrame = null;
    @property
    public color: Color = new Color(255, 255, 255, 255);
}

@ccclass("ButtonEx")
export class ButtonEx extends Component {
    @property({ tooltip: "เปลี่ยน cursor เป็นแบบไหนเมื่อ hover" })
    public hoverCursor: string = "pointer";

    @property({ tooltip: "cursor ปกติ" })
    public normalCursor: string = "default";

    @property({ type: [ClickEffectData], tooltip: "ClickEffect data สำหรับแสดงเอฟเฟกต์เมื่อคลิก" })
    public clickEffects: ClickEffectData[] = [];

    @property([EventHandler])
    clickEvents: EventHandler[] = [];

    private isMouseOver: boolean = false;
    private uiTransform: UITransform = null;

    start() {
        this.uiTransform = this.node.getComponent(UITransform);
        // เปิดใช้งาน touch events
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    onDestroy() {
        // ลบ event listeners เมื่อ component ถูกทำลาย
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        // คืน cursor เป็นปกติเมื่อ component ถูกทำลาย
        this.setCursor(this.normalCursor);
    }

    // ตรวจสอบว่า mouse อยู่เหนือ node หรือไม่
    private isPointInNode(event: EventTouch): boolean {
        if (!this.uiTransform) return false;

        const location = event.getUILocation();
        const nodePos = this.node.getPosition();
        const size = this.uiTransform.contentSize;

        // ตรวจสอบว่า mouse อยู่ในขอบเขตของ node หรือไม่
        const halfWidth = size.width / 2;
        const halfHeight = size.height / 2;

        // ใช้ local position สำหรับการเปรียบเทียบ
        return (
            location.x >= nodePos.x - halfWidth &&
            location.x <= nodePos.x + halfWidth &&
            location.y >= nodePos.y - halfHeight &&
            location.y <= nodePos.y + halfHeight
        );
    }

    // Mouse Events
    private onMouseMove(event: EventTouch) {
        const isInside = this.isPointInNode(event);
        console.log("Mouse move on button", isInside);
        if (isInside && !this.isMouseOver) {
            // Mouse เข้ามาใน node
            this.onMouseEnter();
        } else if (!isInside && this.isMouseOver) {
            // Mouse ออกจาก node
            this.onMouseLeave();
        }
    }

    private onMouseEnter() {
        console.log("Mouse entered button");
        this.isMouseOver = true;
        this.setCursor(this.hoverCursor);

        // เพิ่ม visual feedback เมื่อ hover
        this.node.setScale(1.05, 1.05, 1.05);

        // ใช้ ClickEffect สำหรับ hover state
        this.applyClickEffects("hover");
    }

    private onMouseLeave() {
        console.log("Mouse left button");
        this.isMouseOver = false;
        this.setCursor(this.normalCursor);

        // คืนขนาดปกติ
        this.node.setScale(1.0, 1.0, 1.0);

        // คืนสถานะปกติ
        this.applyClickEffects("normal");
    }

    private onMouseDown(event: EventTouch) {
        if (!this.isPointInNode(event)) return;

        console.log("Mouse down on button");

        // เพิ่ม visual feedback เมื่อกด
        this.node.setScale(0.95, 0.95, 0.95);

        // ใช้ ClickEffect สำหรับ down state
        this.applyClickEffects("down");
    }

    private onMouseUp(event: EventTouch) {
        if (!this.isPointInNode(event)) return;

        console.log("Mouse up on button");
        // คืนขนาดเมื่อปล่อย
        if (this.isMouseOver) {
            this.node.setScale(1.05, 1.05, 1.05);
        } else {
            this.node.setScale(1.0, 1.0, 1.0);
        }
        this.onButtonClick();
    }

    // Touch Events (สำหรับ mobile)
    private onTouchStart(event: EventTouch) {
        console.log("Touch start on button");
        this.node.setScale(0.95, 0.95, 0.95);
    }

    private onTouchEnd(event: EventTouch) {
        console.log("Touch end on button");
        this.node.setScale(1.0, 1.0, 1.0);
        this.onButtonClick();
    }

    private onTouchCancel(event: EventTouch) {
        console.log("Touch cancelled on button");
        this.node.setScale(1.0, 1.0, 1.0);
    }

    // เปลี่ยน cursor style
    private setCursor(cursorType: string) {
        if (typeof document !== "undefined" && document.body) {
            document.body.style.cursor = cursorType;
        }
    }

    // Function ที่จะถูกเรียกเมื่อกดปุ่ม
    private onButtonClick() {
        console.log("Button clicked!");

        // เรียกใช้ ClickEffect ทั้งหมด
        this.applyClickEffects("click");

        // เพิ่ม logic การทำงานของปุ่มที่นี่
        this.onCustomButtonClick();
    }

    // Method สำหรับใช้งาน ClickEffectData
    private applyClickEffects(state: "normal" | "hover" | "down" | "click") {}

    // Override method นี้ใน subclass หรือเรียกใช้จากภายนอก
    protected onCustomButtonClick() {
        // สำหรับ custom logic ของปุ่มแต่ละตัว
    }

    update(deltaTime: number) {}
}
