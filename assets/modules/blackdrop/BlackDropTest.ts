import { _decorator, Button, Component, EditBox, Node } from "cc";
import { Blackdrop } from "./Blackdrop";
const { ccclass, property } = _decorator;

@ccclass("BlackDropTest")
export class BlackDropTest extends Component {
    @property(Blackdrop)
    blackdrop: Blackdrop = null;

    @property(Button)
    btShow: Button = null;

    @property(Button)
    btHide: Button = null;

    @property(EditBox)
    editSpinSpeed: EditBox = null;

    @property(EditBox)
    editFadeTime: EditBox = null;

    start() {}

    toNumber(str: string) {
        return parseFloat(str);
    }

    showClick() {
        this.blackdrop.setSpinSpeed(this.toNumber(this.editSpinSpeed.string));
        this.blackdrop.setFadeTime(this.toNumber(this.editFadeTime.string));
        this.blackdrop.show();
    }

    hideClick() {
        this.blackdrop.setSpinSpeed(this.toNumber(this.editSpinSpeed.string));
        this.blackdrop.setFadeTime(this.toNumber(this.editFadeTime.string));
        this.blackdrop.hide();
    }
}
