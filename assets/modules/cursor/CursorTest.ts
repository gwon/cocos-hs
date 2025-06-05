import { _decorator, Component, Label, Node } from "cc";
import { ButtonEx } from "../button-ex/ButtonEx";
import { findCanvasRoot } from "../utils/utils";
const { ccclass, property } = _decorator;

@ccclass("CursorTest")
export class CursorTest extends Component {
    private count: number = 0;

    @property(Label)
    private label: Label = null;

    start() {
        if (this.label) {
            this.label.string = this.count.toString();
        }
    }

    countUp() {
        this.count++;
        if (this.label) {
            this.label.string = this.count.toString();
        }
    }
}
