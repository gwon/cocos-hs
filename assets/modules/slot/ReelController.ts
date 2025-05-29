import {
    _decorator,
    Component,
    easing,
    instantiate,
    Layout,
    Node,
    sp,
    Tween,
    tween,
    TweenEasing,
    Vec3,
} from "cc";

import { SymbolManager } from "../symbol-manager/SymbolManager";
import { SymbolController } from "./SymbolController";
import { SymbolData } from "../symbol-manager/SymbolData";

const { ccclass, property } = _decorator;

export enum DIRECTION {
    DOWN = -1,
    UP = 1,
}

export enum STATE {
    IDLE,
    SPINNING,
    STOPPING,
}

@ccclass("ReelController")
export class ReelController extends Component {
    private id: number = 0;
    private moveDistance: number = 5000;
    private stopTimeRatio = 4.5;
    private loopOffset: number = 100;

    private direction: DIRECTION = DIRECTION.UP;
    private symbolManager: SymbolManager = null;
    private minY: number = 0;
    private maxY: number = 0;
    private dy = 0;
    private vDistance: Vec3 = new Vec3();
    private tweening: Tween<Vec3> | null;
    private state: STATE = STATE.IDLE;
    private stopCountTarget: number = -1;
    private endingNode: Node = null;
    private lastEndingPos: Vec3 = new Vec3();
    private results: SymbolData[] = [];
    private totalMoveTime = 0;
    private displaySize = 0;
    private symbols: SymbolController[] = [];
    private winIdxs: number[] = [];
    private easingStart = easing.backInOut;
    private easingStop = easing.backOut;
    private onCompleteCallback: (self: ReelController) => void = () => {
        console.warn("on complete not set yet");
    };

    protected onLoad(): void {
        this.sortingSpinSlots();
        this.minY = this.findMinY();
        this.maxY = this.findMaxY();

        if (this.minY > this.maxY) {
            const temp = this.minY;
            this.minY = this.maxY;
            this.maxY = temp;
        }

        this.displaySize = this.symbols.length;
        const p0 = this.symbols[0].node.getPosition();
        const p1 = this.symbols[1].node.getPosition();
        const pend = this.symbols[this.symbols.length - 1].node.getPosition();
        this.dy = Math.abs(p1.y - p0.y);
        const distance = Math.abs(pend.y - p0.y);
        this.totalMoveTime = distance / this.moveDistance;

        const layout = this.node.getComponent(Layout);
        layout.updateLayout(true);
        layout.enabled = false;

        this.sortingSpinSlots();
        this.addTopAndBottomItems();
        console.log("this.symbols", this.symbols);
    }

    private stopTime() {
        const distance = this.maxY - this.minY + this.loopOffset;
        return (distance / this.moveDistance) * this.stopTimeRatio;
    }

    start() {
        this.fillItems();
        this.sortingSpinSlots();
        this.fillSymbols();
    }

    private fillItems() {
        const { displayItem, extendedItems } = this.getSymbols();
        for (const item of displayItem) {
            const symbolData = this.symbolManager.getRandomSymbol();
            item.copyFrom(symbolData);
            item.show();
        }
        for (const item of extendedItems) {
            const symbolData = this.symbolManager.getRandomSymbol();
            item.copyFrom(symbolData);
            item.show();
        }
    }

    private addTopAndBottomItems() {
        const maxY = this.maxY + this.dy;
        const minY = this.minY - this.dy;
        const topItem = instantiate(this.symbols[0].node);
        this.node.addChild(topItem);
        topItem.setPosition(0, maxY, 0);
        const bottomItem = instantiate(this.symbols[0].node);
        this.node.addChild(bottomItem);
        bottomItem.setPosition(0, minY, 0);
    }

    setup(id: number, poolController: SymbolManager) {
        this.id = id;
        this.symbolManager = poolController;
    }

    get State() {
        return this.state;
    }

    get DisplaySize() {
        return this.displaySize;
    }

    onComplete(callback: (self: ReelController) => void) {
        this.onCompleteCallback = callback;
    }

    findMinY() {
        let minY = this.symbols[0].node.getPosition().y;
        for (const symbol of this.symbols) {
            const p0 = symbol.node.getPosition();
            if (p0.y < minY) minY = p0.y;
        }
        return minY;
    }

    findMaxY() {
        let maxY = this.symbols[0].node.getPosition().y;
        for (const symbol of this.symbols) {
            const p0 = symbol.node.getPosition();
            if (p0.y > maxY) maxY = p0.y;
        }
        return maxY;
    }

    getSymbols() {
        const displayItem = [...this.symbols];
        const extendedItems = [displayItem.shift(), displayItem.pop()];
        if (this.direction == DIRECTION.UP) {
            displayItem.reverse();
        }
        return {
            displayItem,
            extendedItems,
        };
    }

    // default is down direction
    fillSymbols(ids: string[] = []) {
        this.stopAnimation();
        ids = ids.reverse();
        this.sortingSpinSlots();
        const { displayItem, extendedItems } = this.getSymbols();
        for (const exItem of extendedItems) {
            const target = exItem.getComponent(SymbolController);
            const controller = this.symbolManager.getRandomSymbol();
            target.copyFrom(controller);
            target.show();
        }

        let i = 0;
        for (const item of displayItem) {
            const target = item.getComponent(SymbolController);
            const id = ids[i];
            let symbolData: SymbolData = null;
            if (id == undefined) {
                symbolData = this.symbolManager.getRandomSymbol();
            } else {
                symbolData = this.symbolManager.getSymbol(id);
            }
            target.copyFrom(symbolData);
            target.show();
            i++;
        }
    }

    private listSymbols(ids: string[]): SymbolData[] {
        const results: SymbolData[] = [];
        for (const id of ids) {
            const symbolData = this.symbolManager.getSymbol(id);
            results.push(symbolData);
        }
        return results;
    }

    showDebug(isDebug: boolean) {
        for (const symbol of this.symbols) {
            symbol.showDebug(isDebug);
        }
    }

    spin(direction: DIRECTION) {
        this.stopAnimation();
        if (this.tweening) this.tweening.stop();
        this.endingNode = null;
        this.direction = direction;
        this.vDistance.y = 0;
        this.winIdxs = [];
        this.tweening = tween(this.vDistance)
            .to(
                this.totalMoveTime,
                { y: this.moveDistance * this.direction },
                {
                    easing: this.easingStart,
                }
            )
            .start();
        this.state = STATE.SPINNING;
    }

    stopByIds(count: number, ids: string[]) {
        this.stopCountTarget = count;
        if (this.direction == DIRECTION.UP) {
            ids.reverse();
            this.results = this.listSymbols(ids);
        } else {
            this.results = this.listSymbols(ids);
        }
        this.state = STATE.STOPPING;
        console.log(`wheel ${this.id} stop ${JSON.stringify(ids)}`);
    }

    win(idxs: number[]) {
        this.winIdxs = idxs;
        console.log(`wheel ${this.id} win ${JSON.stringify(idxs)}`);
    }

    playWin(delay: number = 0) {
        this.sortingSpinSlots();
        const { displayItem } = this.getSymbols();
        displayItem.reverse();

        for (const symbol of this.symbols) {
            const symbolController = symbol.getComponent(SymbolController);
            symbolController.stopAnimation();
        }

        for (const idx of this.winIdxs) {
            const symbol = displayItem[idx];
            if (symbol) {
                const symbolController = symbol.getComponent(SymbolController);
                this.scheduleOnce(() => {
                    symbolController.playTrigger();
                }, delay);
            }
        }
    }

    stopAnimation() {
        for (const symbol of this.symbols) {
            const symbolController = symbol.getComponent(SymbolController);
            if (symbolController) {
                symbolController.stopAnimation();
            }
        }
    }

    stop(count: number, results: SymbolData[]) {
        this.stopCountTarget = count;
        if (this.direction == DIRECTION.UP) {
            this.results = results;
        } else {
            this.results = results;
        }
        this.state = STATE.STOPPING;
    }

    private sortingSpinSlots() {
        const children = this.node.children;
        if (this.direction === DIRECTION.UP) {
            children.sort((a, b) => a.getPosition().y - b.getPosition().y);
        } else {
            children.sort((a, b) => b.getPosition().y - a.getPosition().y);
        }

        const symbols: SymbolController[] = [];
        for (const child of children) {
            const symbol = child.getComponent(SymbolController);
            if (symbol) {
                symbols.push(symbol);
            }
        }

        this.symbols = symbols;
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            symbol.name = `symbol_${i}`;
        }
    }

    private updateLoopY(node: Node): boolean {
        const p0 = node.getPosition();
        let isLoop = false;
        let limitMaxY = this.maxY + this.dy + this.loopOffset;
        let limitMinY = this.minY - this.dy - this.loopOffset;
        if (this.direction === DIRECTION.UP && p0.y >= limitMaxY) {
            p0.y = this.findMinY() - this.dy;
            isLoop = true;
            node.setPosition(p0);
            this.sortingSpinSlots();
        } else if (this.direction === DIRECTION.DOWN && p0.y <= limitMinY) {
            p0.y = this.findMaxY() + this.dy;
            isLoop = true;
            node.setPosition(p0);
            this.sortingSpinSlots();
        }
        return isLoop;
    }

    private doStop(endingNode: Node) {
        if (this.tweening) this.tweening.stop();
        this.tweening = null;
        this.endingNode = endingNode;
        this.lastEndingPos = this.endingNode.getPosition().clone();
        const p0 = endingNode.getPosition();
        const p1 = p0.clone();
        if (this.direction === DIRECTION.UP) {
            p1.y = this.maxY;
        } else {
            p1.y = this.minY;
        }

        this.changeItem(endingNode.getComponent(SymbolController));
        const stopTime = this.stopTime();
        tween(p0)
            .to(stopTime, p1, {
                easing: this.easingStop,
                onUpdate: (target: Vec3, ratio: number) => {
                    this.endingNode.setPosition(target);
                    const diff = target.y - this.lastEndingPos.y;
                    for (const symbol of this.symbols) {
                        if (symbol.node != this.endingNode) {
                            const p0 = symbol.node.getPosition();
                            const { x, y, z } = p0;
                            symbol.node.setPosition(x, y + diff, z);
                            const isLoop = this.updateLoopY(symbol.node);
                            if (isLoop) {
                                this.changeItem(symbol);
                            }
                        }
                    }
                    this.lastEndingPos.y = target.y;
                },
                onComplete: () => {
                    this.state = STATE.IDLE;
                    this.playLanding();
                    this.onCompleteCallback(this);
                },
            })
            .start();
    }

    private playLanding() {
        for (const symbol of this.symbols) {
            const symbolController = symbol.getComponent(SymbolController);
            if (symbolController) {
                symbolController.playLanding();
            }
        }
    }

    private changeItem(symbolController: SymbolController) {
        if (this.results.length > 0 && this.endingNode && this.stopCountTarget == 0) {
            const symbol = this.results.shift();
            this._changeItem(symbolController, symbol);
        } else {
            const sk = this.symbolManager.getRandomSymbol();
            this._changeItem(symbolController, sk);
        }
    }

    private _changeItem(symbolController: SymbolController, src: SymbolData) {
        const target = symbolController;
        target.copyFrom(src);
        target.show();
    }

    update(deltaTime: number) {
        if (this.state == STATE.IDLE) {
            return;
        }
        if (this.endingNode) {
            return;
        } else if (Math.abs(this.vDistance.y) > 0) {
            const distance = this.vDistance.y * deltaTime;
            for (const symbol of this.symbols) {
                const { x, y, z } = symbol.node.getPosition();
                symbol.node.setPosition(x, y + distance, z);
                const isLooped = this.updateLoopY(symbol.node);
                if (isLooped) {
                    if (this.stopCountTarget > 0) {
                        this.stopCountTarget--;
                        if (this.stopCountTarget === 0) {
                            this.doStop(symbol.node);
                        }
                    } else {
                        const symbolController = symbol.getComponent(SymbolController);
                        if (symbolController) {
                            this.changeItem(symbolController);
                        }
                    }
                }
            }
        }
    }
}
