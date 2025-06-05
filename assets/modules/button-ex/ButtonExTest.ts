import { _decorator, Component, Node, Label } from "cc";
import { ButtonEx } from "./ButtonEx";
const { ccclass, property } = _decorator;

@ccclass("ButtonExTest")
export class ButtonExTest extends Component {
    @property(Label)
    label: Label = null;

    @property(ButtonEx)
    toggleTarget: ButtonEx = null;

    private counter: number = 0;
    start() {
        this.label = this.getComponentInChildren(Label);
    }

    echo() {
        this.counter++;
        this.label.string = `Button Ex test clicked ${this.counter}`;
    }

    toggle() {
        if (this.toggleTarget.Interactable) {
            this.toggleTarget.setInteractable(false);
        } else {
            this.toggleTarget.setInteractable(true);
        }
    }
}
