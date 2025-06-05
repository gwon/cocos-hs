import {
    _decorator,
    Camera,
    Canvas,
    Component,
    Enum,
    EventMouse,
    Input,
    Sprite,
    UITransform,
    Vec3,
    sys,
} from "cc";
import { findCanvasRoot } from "../utils/utils";
const { ccclass, property } = _decorator;

export enum CursorType {
    DEFAULT = 0,
    POINTER = 1,
}

@ccclass("CursorData")
export class CursorData {
    @property(Sprite)
    cursor: Sprite = null;

    @property({ type: Enum(CursorType) })
    cursorType: CursorType = CursorType.DEFAULT;
}

@ccclass("CursorManager")
export class CursorManager extends Component {
    static instance: CursorManager = null;

    @property(Camera)
    targetCamera: Camera = null;

    @property(Sprite)
    defaultCursor: Sprite = null;

    @property({ type: [CursorData] })
    cursorDatas: CursorData[] = [];

    private cursorDataMap: Map<CursorType, CursorData> = new Map();
    private canvas: Canvas = null;

    private isMouse: boolean = false;

    protected onLoad(): void {
        this.canvas = findCanvasRoot(this.node);
        if (!this.targetCamera) {
            this.targetCamera = this.canvas.getComponentInChildren(Camera);
        }
        this.cursorDataMap.clear();
        for (const cursorData of this.cursorDatas) {
            this.cursorDataMap.set(cursorData.cursorType, cursorData);
        }
        CursorManager.instance = this;
        this.canvas.node.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.hideCursor();
    }

    start() {}

    onMouseMove(event: EventMouse) {
        if (!this.isMouse) {
            this.isMouse = true;
            this.setCursor(CursorType.DEFAULT);

            if (
                sys.platform === sys.Platform.DESKTOP_BROWSER ||
                sys.platform === sys.Platform.MOBILE_BROWSER
            ) {
                // ซ่อน cursor ด้วย CSS
                const canvas = document.querySelector("canvas");
                if (canvas) {
                    canvas.style.cursor = "none";
                }

                // หรือใช้วิธีนี้
                document.body.style.cursor = "none";
            }
        }
        const canvasTransform = this.canvas.getComponent(UITransform);
        const mousePos = event.getLocation();
        const worldPos = new Vec3();
        this.targetCamera.screenToWorld(new Vec3(mousePos.x, mousePos.y, 0), worldPos);
        worldPos.x -= canvasTransform.width / 2;
        worldPos.y -= canvasTransform.height / 2;
        this.node.setPosition(worldPos);
    }

    private hideCursor() {
        for (const [key, value] of this.cursorDataMap) {
            value.cursor.node.active = false;
        }
    }

    private setCursor(cursorType: CursorType) {
        if (this.isMouse) {
            this.hideCursor();
            const cursor = this.cursorDataMap.get(cursorType);
            if (cursor) {
                cursor.cursor.node.active = true;
            }
        }
    }

    public static setCursor(cursorType: CursorType) {
        CursorManager.instance.setCursor(cursorType);
    }
}
