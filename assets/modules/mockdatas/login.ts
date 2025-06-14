import { ApiResponse } from "../rg-api/apidata";

export const loginData: ApiResponse = {
    Player: {
        Balance: 99998.87,
        Rate: 1,
        Currency: "MYR",
        CoinRate: 100,
    },
    Current: {
        Type: 1,
        TotalWin: 0,
        AccWin: 0,
        Result: {
            R: "201,104,204|103,101,204|204,203,103|102,25,101|103,204,101",
        },
        Round: {
            RoundType: 1,
            Bet: 0.09,
            ActualBet: 0.09,
            BetValue: 1,
            Line: 9,
            LineBet: 0.01,
            Payout: 0,
            Items: ["1|0|1"],
            Mode: 1,
        },
        WBId: "100",
        RId: 730700,
        ReId: 1,
    },
    Next: {
        Type: 1,
    },
    GameInfo: {
        Line: 9,
        BetValue: [1],
        LineBet: [
            0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2,
            0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.5, 3,
            3.5, 4, 5, 6, 7, 8, 9, 10, 12,
        ],
        BuyFeature: [
            {
                RoundType: 2,
                Rate: 100,
                Total: 10,
            },
        ],
    },
    Status: 200,
    Ts: 1747214763,
};

export const loginDataFirstTime: ApiResponse = {
    Player: {
        Balance: 100000,
        Rate: 1,
        Currency: "MYR",
        CoinRate: 100,
    },
    Current: {
        Type: 1,
        TotalWin: 10.8,
        AccWin: 10.8,
        Result: {
            R: "102,102,102|1,1,1|1,1,1|1,1,1|102,102,102",
            WR: [
                {
                    T: 6,
                    AWP: [
                        [0, 1, 2],
                        [0, 1, 2],
                        [0, 1, 2],
                        [0, 1, 2],
                        [0, 1, 2],
                    ],
                    R: "10.80",
                },
            ],
        },
        Round: {
            RoundType: 1,
            Bet: 0.09,
            ActualBet: 0.09,
            BetValue: 1,
            Line: 9,
            LineBet: 0.01,
            Payout: 10.8,
            Items: ["1|10.80|1"],
            Mode: 1,
        },
        WBId: "100",
        RId: 737516,
        ReId: 1,
    },
    Next: {
        Type: 1,
    },
    GameInfo: {
        Line: 9,
        BetValue: [1],
        LineBet: [
            0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2,
            0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.5, 3,
            3.5, 4, 5, 6, 7, 8, 9, 10, 12,
        ],
        BuyFeature: [
            {
                RoundType: 2,
                Rate: 100,
                Total: 10,
            },
        ],
    },
    Status: 200,
    Ts: 1748522484,
};
