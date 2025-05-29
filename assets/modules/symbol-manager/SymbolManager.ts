import { _decorator, Component, instantiate, Color } from "cc";
import { SymbolData } from "./SymbolData";
import { getRandomFromArray } from "../utils/utils";
const { ccclass } = _decorator;

@ccclass("SymbolManager")
export class SymbolManager extends Component {
    private srcNodes: Map<string, SymbolData> = new Map();
    private dic: Map<string, string> = new Map();
    private defaultSymbol: SymbolData = null;

    onLoad() {
        this.setup0();
    }

    start() {
        if (this.dic.size == 0) {
            for (const [key, symbol] of this.srcNodes) {
                symbol.setInfo(symbol.node.name, symbol.node.name);
            }
        }
    }

    private setup0() {
        if (this.srcNodes.size > 0) {
            return;
        }
        const symbolItems = this.node.getComponentsInChildren(SymbolData);
        for (const symbol of symbolItems) {
            this.srcNodes.set(symbol.node.name, symbol);
        }
        const defaultNode = instantiate(symbolItems[0].node);
        this.node.addChild(defaultNode);
        this.defaultSymbol = defaultNode.getComponent(SymbolData);
        this.defaultSymbol.setInfo("???", "???");
        this.defaultSymbol.setColor(new Color(0, 0, 0, 255));
    }

    setup(dic: Map<string, string>) {
        this.setup0();
        this.dic = dic;
        for (const [key, value] of this.dic) {
            const symbol = this.srcNodes.get(value);
            symbol.setInfo(key, value);
        }
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
            this.defaultSymbol.setInfo(id, id);
            return this.defaultSymbol;
        }
        return controller;
    }

    getRandomSymbol(): SymbolData {
        const srcName = this.getRandomSrcName();
        return this.getSymbol(srcName);
    }
}
