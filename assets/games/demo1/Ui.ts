import { _decorator, Button, Component, Node } from "cc";
import { Score } from "./Score";
import { strLike } from "../../modules/utils/utils";
import { TotalWin } from "./TotalWin";
const { ccclass, property } = _decorator;

@ccclass("Ui")
export class Ui extends Component {
    private scoreWallet: Score = null;
    private scoreBet: Score = null;
    private scoreWin: Score = null;
    private totalWin: TotalWin = null;
    private spinButton: Button = null;
    private turboButton: Button = null;
    private minusButton: Button = null;
    private plusButton: Button = null;
    private autoButton: Button = null;

    protected onLoad(): void {
        const scores: Score[] = this.node.getComponentsInChildren(Score);
        this.scoreWallet = scores.find((score) => strLike(score.name, "wallet"));
        this.scoreBet = scores.find((score) => strLike(score.name, "bet"));
        this.scoreWin = scores.find((score) => strLike(score.name, "win"));

        const buttons: Button[] = this.node.getComponentsInChildren(Button);
        this.spinButton = buttons.find((button) => strLike(button.name, "spin"));
        this.turboButton = buttons.find((button) => strLike(button.name, "turbo"));
        this.minusButton = buttons.find((button) => strLike(button.name, "minus"));
        this.plusButton = buttons.find((button) => strLike(button.name, "plus"));
        this.autoButton = buttons.find((button) => strLike(button.name, "auto"));
        this.totalWin = this.node.getComponentInChildren(TotalWin);
    }

    start() {}

    setScoreWallet(score: number) {
        this.scoreWallet.setScore(score);
    }

    setScoreBet(score: number) {
        this.scoreBet.setScore(score);
    }

    setScoreWin(score: number) {
        this.scoreWin.setScore(score);
    }

    activeSpinButton(isActive: boolean) {
        this.spinButton.interactable = isActive;
    }

    setTotalWin(totalWin: number) {
        this.totalWin.setTotalWin(totalWin);
    }

    setTitleTotalWin(title: string) {
        this.totalWin.setTitle(title);
    }
}
