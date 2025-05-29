import { ApiResponse } from "../rg-api/apidata";

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
