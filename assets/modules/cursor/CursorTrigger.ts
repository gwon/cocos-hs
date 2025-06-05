import { _decorator, Component, Node, NodeEventType } from "cc";
import { CursorManager } from "./CursorManager";
import { CursorType } from "./CursorManager";
const { ccclass, property } = _decorator;

@ccclass("CursorTrigger")
export class CursorTrigger extends Component {
    start() {
        this.node.on(NodeEventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(NodeEventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }

    onMouseEnter() {
        CursorManager.setCursor(CursorType.POINTER);
    }

    onMouseLeave() {
        CursorManager.setCursor(CursorType.DEFAULT);
    }
}
