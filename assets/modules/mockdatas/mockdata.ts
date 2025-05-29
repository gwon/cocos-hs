import { normalData } from "./normal";

export function getDataFrom(array2d: string[][]) {
    const data = { ...normalData };
    data.Current.Result.R = array2d.map((row) => row.join(",")).join("|");
    return data;
}
