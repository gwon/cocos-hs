import { _decorator, Button, Component, NodePool } from "cc";
import { SymbolData } from "./SymbolData";
import { getRandomFromArray } from "../utils/utils";
const { ccclass } = _decorator;

@ccclass("SymbolManager")
export class SymbolManager extends Component {
    private srcNodes: Map<string, SymbolData> = new Map();
    private dic: Map<string, string> = new Map();

    onLoad() {
        this.setup0();
    }

    start() {}

    private setup0() {
        if (this.srcNodes.size > 0) {
            return;
        }
        const symbolItems = this.node.getComponentsInChildren(SymbolData);
        for (const symbol of symbolItems) {
            this.srcNodes.set(symbol.node.name, symbol);
        }
    }

    setup(dic: Map<string, string>) {
        this.setup0();
        this.dic = dic;
    }

    private getRandomSrcName(): string {
        const keys = Array.from(this.srcNodes.keys());
        if (keys.length == 0) {
            console.warn("Src nodes is empty");
            return "???";
        }
        return getRandomFromArray(keys);
    }

    translateId(id: string): string {
        return this.dic.get(id) ?? id;
    }

    translateIds(ids: string[]): string[] {
        const results: string[] = [];
        for (const id of ids) {
            const name = this.translateId(id);
            results.push(name);
        }
        return results;
    }

    getSymbol(id: string): SymbolData {
        const srcName = this.translateId(id);
        const controller = this.srcNodes.get(srcName);
        if (controller == null) {
            console.error(`SkeletonData is not found in ${srcName}`);
            return null;
        }
        return controller;
    }

    getRandomSymbol(): SymbolData {
        const srcName = this.getRandomSrcName();
        return this.getSymbol(srcName);
    }
}
