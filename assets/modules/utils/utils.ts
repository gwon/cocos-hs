import { ApiResponse } from "../rg-api/apidata";
import { Canvas, Node } from "cc";

export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function extractWinResult(data: ApiResponse) {
    const { Result } = data.Current;
    const winResult = Result.WR ?? [];
    return winResult;
}

export function extractStrWheels(data: ApiResponse) {
    const { Result } = data.Current;
    const sWheels: string[][] = [];
    const wheels = Result.R.split("|");
    for (let i = 0; i < wheels.length; i++) {
        const symbols = wheels[i].split(",");
        sWheels.push(symbols);
    }
    return sWheels;
}

export function getRandomFromArray(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
}

export function randomMinMax(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatMoney(
    amount: number,
    decimals: number = 2,
    decimalSeparator: string = ".",
    thousandsSeparator: string = ","
): string {
    if (isNaN(amount) || !isFinite(amount)) {
        return amount.toString(); // Handle non-numeric values
    }

    const fixedAmount = Math.abs(amount).toFixed(decimals);
    const parts = fixedAmount.split(".");
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? decimalSeparator + parts[1] : "";

    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

    return (amount < 0 ? "-" : "") + formattedIntegerPart + decimalPart;
}

export function strLike(name0: string, name1: string) {
    const index = name0.toLowerCase().indexOf(name1.toLowerCase());
    return index >= 0;
}

export function findCanvasRoot(node: Node) {
    while (node.parent) {
        const canvas = node.parent.getComponent(Canvas);
        if (canvas) {
            return canvas;
        }
        node = node.parent;
    }
    return null;
}
