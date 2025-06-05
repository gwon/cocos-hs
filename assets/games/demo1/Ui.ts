import { _decorator, Button, Component, Node } from "cc";
import { Score } from "./Score";
import { strLike } from "../../modules/utils/utils";
import { TotalWin } from "./TotalWin";
import { ButtonEx } from "../../modules/button-ex/ButtonEx";
const { ccclass, property } = _decorator;

@ccclass("Ui")
export class Ui extends Component {
    private scoreWallet: Score = null;
    private scoreBet: Score = null;
    private scoreWin: Score = null;
    private totalWin: TotalWin = null;
    private spinButton: ButtonEx = null;
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
        this.turboButton = buttons.find((button) => strLike(button.name, "turbo"));
        this.minusButton = buttons.find((button) => strLike(button.name, "minus"));
        this.plusButton = buttons.find((button) => strLike(button.name, "plus"));
        this.autoButton = buttons.find((button) => strLike(button.name, "auto"));
        this.totalWin = this.node.getComponentInChildren(TotalWin);

        const buttonExs: ButtonEx[] = this.node.getComponentsInChildren(ButtonEx);
        this.spinButton = buttonExs.find((buttonEx) => strLike(buttonEx.name, "spin"));
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
        this.spinButton.setInteractable(isActive);
    }

    setTotalWin(totalWin: number) {
        this.totalWin.setTotalWin(totalWin);
    }

    setTitleTotalWin(title: string) {
        this.totalWin.setTitle(title);
    }
}
