import { _decorator, Component, Node } from "cc";
import { ApiResponse } from "./apidata";
const { ccclass, property } = _decorator;

export class API {
    private url: string = "";
    private token: string = "";
    private gamecode: string = "";

    constructor(url: string, token: string, gamecode: string) {
        this.url = url;
        this.token = token;
        this.gamecode = gamecode;
    }

    private pathConcat(path: string) {
        if (path.startsWith("/")) {
            path = path.slice(1);
        }
        const finalPath = this.url + path;
        console.log(finalPath);
        return finalPath;
    }

    get(path: string, callback: (data: any) => void) {
        fetch(this.pathConcat(path))
            .then((data) => {
                callback(data);
            })
            .catch((error) => {
                console.error("There was a problem with the GET request:", error);
            });
    }

    posth(path: string, headers: any, data: any, callback: (data: any) => void) {
        fetch(this.pathConcat(path), {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                callback(data);
            })
            .catch((error) => {
                console.error("There was a problem with the POST request:", error);
            });
    }

    post(path: string, data: any, callback: (data: any) => void) {
        fetch(this.pathConcat(path), {
            method: "POST",
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                callback(data);
            })
            .catch((error) => {
                console.error("There was a problem with the POST request:", error);
            });
    }

    private getHeaders() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
        };
    }

    login(callback: (data: ApiResponse) => void) {
        const headers = this.getHeaders();
        const data = {
            GameCode: this.gamecode,
        };

        this.posth("Game/Login", headers, data, (data) => {
            callback(data);
        });
    }

    transact(type: number, callback: (data: any) => void) {
        const headers = this.getHeaders();
        const data = {
            Type: type,
            Bet: null,
            BetValue: 1,
            Line: 9,
            LineBet: 0.01,
            RoundType: 1,
            Index: null,
        };

        this.posth("Game/Transact", headers, data, (data) => {
            callback(data);
        });
    }

    keepAlive(callback: (data: any) => void) {
        const headers = this.getHeaders();
        const data = {
            GameCode: this.gamecode,
        };

        this.posth("Game/KeepAlive", headers, data, (data) => {
            callback(data);
        });
    }
}
