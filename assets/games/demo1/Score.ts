import { _decorator, Component, Label, Node } from "cc";
import { formatMoney } from "../../modules/utils/utils";
const { ccclass, property } = _decorator;

@ccclass("Score")
export class Score extends Component {
    private label: Label = null;

    protected onLoad(): void {
        this.label = this.node.getComponentInChildren(Label);
    }

    setScore(score: number) {
        const formattedScore = formatMoney(score);
        console.log("formattedScore", formattedScore);
        this.label.string = formattedScore;
    }
}
