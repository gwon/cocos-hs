import { _decorator, Component, Label, Node } from "cc";
import { strLike } from "../../modules/utils/utils";
import { formatMoney } from "../../modules/utils/utils";
const { ccclass, property } = _decorator;

@ccclass("TotalWin")
export class TotalWin extends Component {
    private title: Label = null;
    private label: Label = null;

    protected onLoad(): void {
        const labels: Label[] = this.node.getComponentsInChildren(Label);
        this.title = labels.find((label) => strLike(label.name, "title"));
        this.label = labels.find((label) => strLike(label.name, "label"));
    }

    setTotalWin(totalWin: number) {
        this.label.string = formatMoney(totalWin);
    }

    setTitle(title: string) {
        this.title.string = title;
    }
}
