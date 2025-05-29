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
import { SymbolManager } from "./SymbolManager";
import { SymbolController } from "./SymbolController";
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

@ccclass("WheelController")
export class WheelController extends Component {
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
    private results: SymbolController[] = [];
    private totalMoveTime = 0;
    private displaySize = 0;
    private slots: Node[] = [];
    private winIdxs: number[] = [];
    private easingStart = easing.backInOut;
    private easingStop = easing.backOut;
    private onCompleteCallback: (self: WheelController) => void = () => {
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

        this.displaySize = this.slots.length;
        const p0 = this.slots[0].getPosition();
        const p1 = this.slots[1].getPosition();
        const pend = this.slots[this.slots.length - 1].getPosition();
        this.dy = Math.abs(p1.y - p0.y);
        const distance = Math.abs(pend.y - p0.y);
        this.totalMoveTime = distance / this.moveDistance;

        const layout = this.node.getComponent(Layout);
        layout.updateLayout(true);
        layout.enabled = false;

        this.sortingSpinSlots();
        this.addTopAndBottomItems();
    }

    private stopTime() {
        const distance = this.maxY - this.minY + this.loopOffset;
        return (distance / this.moveDistance) * this.stopTimeRatio;
    }

    start() {
        this.fillItems();
        for (const slot of this.slots) {
            const skelton = slot.getComponent(sp.Skeleton);
            if (skelton) skelton.destroy();
        }

        this.sortingSpinSlots();
        this.fillSymbols();
    }

    private fillItems() {
        const { displayItem, extendedItems } = this.getSlots();
        for (const item of displayItem) {
            const controller = this.symbolManager.createEmptySymbol(item.name);
            item.addChild(controller.node);
            controller.node.setPosition(0, 0, 0);
            controller.show();
        }
        for (const item of extendedItems) {
            const controller = this.symbolManager.createEmptySymbol(item.name);
            item.addChild(controller.node);
            controller.node.setPosition(0, 0, 0);
            controller.show();
        }
    }

    private addTopAndBottomItems() {
        const maxY = this.maxY + this.dy;
        const minY = this.minY - this.dy;
        const topItem = instantiate(this.slots[0]);
        this.node.addChild(topItem);
        topItem.setPosition(0, maxY, 0);
        const bottomItem = instantiate(this.slots[0]);
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

    onComplete(callback: (self: WheelController) => void) {
        this.onCompleteCallback = callback;
    }

    findMinY() {
        let minY = this.slots[0].getPosition().y;
        for (const slot of this.slots) {
            const p0 = slot.getPosition();
            if (p0.y < minY) minY = p0.y;
        }
        return minY;
    }

    findMaxY() {
        let maxY = this.slots[0].getPosition().y;
        for (const slot of this.slots) {
            const p0 = slot.getPosition();
            if (p0.y > maxY) maxY = p0.y;
        }
        return maxY;
    }

    getSlots() {
        const displayItem = [...this.slots];
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
        const { displayItem, extendedItems } = this.getSlots();
        for (const exItem of extendedItems) {
            const target = exItem.getComponentInChildren(SymbolController);
            const controller = this.symbolManager.getRandomSymbol();
            target.copyFrom(controller);
            target.show();
        }

        let i = 0;
        for (const item of displayItem) {
            const target = item.getComponentInChildren(SymbolController);
            const id = ids[i];
            let controller: SymbolController = null;
            if (id == undefined) {
                controller = this.symbolManager.getRandomSymbol();
            } else {
                controller = this.symbolManager.getSymbol(id);
            }
            target.copyFrom(controller);
            target.show();
            i++;
        }
    }

    private listSymbols(ids: string[]): SymbolController[] {
        const results: SymbolController[] = [];
        for (const id of ids) {
            const controller = this.symbolManager.getSymbol(id);
            results.push(controller);
        }
        return results;
    }

    debug() {
        for (const slot of this.slots) {
            const p0 = slot.getPosition();
            console.log("debug", slot.name, p0.y);
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
        const { displayItem } = this.getSlots();
        displayItem.reverse();

        for (const symbol of this.slots) {
            const symbolController = symbol.getComponentInChildren(SymbolController);
            symbolController.stopAnimation();
        }

        for (const idx of this.winIdxs) {
            const symbol = displayItem[idx];
            if (symbol) {
                const symbolController = symbol.getComponentInChildren(SymbolController);
                this.scheduleOnce(() => {
                    symbolController.playTrigger();
                }, delay);
            }
        }
    }

    stopAnimation() {
        for (const slot of this.slots) {
            const symbolController = slot.getComponentInChildren(SymbolController);
            if (symbolController) {
                symbolController.stopAnimation();
            }
        }
    }

    stop(count: number, results: SymbolController[]) {
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

        this.slots = children;
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            slot.name = `slot_${i}`;
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

        this.changeItem(endingNode);
        const stopTime = this.stopTime();
        tween(p0)
            .to(stopTime, p1, {
                easing: this.easingStop,
                onUpdate: (target: Vec3, ratio: number) => {
                    this.endingNode.setPosition(target);
                    const diff = target.y - this.lastEndingPos.y;
                    for (const child of this.slots) {
                        if (child != this.endingNode) {
                            const p0 = child.getPosition();
                            const { x, y, z } = p0;
                            child.setPosition(x, y + diff, z);
                            const isLoop = this.updateLoopY(child);
                            if (isLoop) {
                                this.changeItem(child);
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
        for (const slot of this.slots) {
            const symbolController = slot.getComponentInChildren(SymbolController);
            if (symbolController) {
                symbolController.playLanding();
            }
        }
    }

    private changeItem(root: Node) {
        if (this.results.length > 0 && this.endingNode && this.stopCountTarget == 0) {
            const symbol = this.results.shift();
            this._changeItem(root, symbol);
        } else {
            const sk = this.symbolManager.getRandomSymbol();
            this._changeItem(root, sk);
        }
    }

    private _changeItem(root: Node, src: SymbolController) {
        const target = root.getComponentInChildren(SymbolController);
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
            for (const children of this.slots) {
                const { x, y, z } = children.getPosition();
                children.setPosition(x, y + distance, z);
                const isLooped = this.updateLoopY(children);
                if (isLooped) {
                    if (this.stopCountTarget > 0) {
                        this.stopCountTarget--;
                        if (this.stopCountTarget === 0) {
                            this.doStop(children);
                        }
                    } else {
                        const symbolController = children.getComponentInChildren(SymbolController);
                        if (symbolController) {
                            this.changeItem(children);
                        }
                    }
                }
            }
        }
    }
}
