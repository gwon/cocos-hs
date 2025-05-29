import { ApiResponse } from "../rg-api/apidata";

const t6Data: ApiResponse = {
    Current: {
        Type: 10,
        TotalWin: 3.6,
        AccWin: 3.6,
        FreeSpin: {
            Current: 14,
            Total: 20,
        },
        Result: {
            R: "104,104,104|1,1,1|1,1,1|1,1,1|104,104,104",
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
                    R: "3.60",
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
            Payout: 5.47,
            Items: ["1|0|1", "10|5.47|14"],
            Mode: 1,
        },
        WBId: "100",
        RId: 737251,
        ReId: 15,
    },
    Next: {
        Type: 10,
        FreeSpin: {
            Next: 15,
            Total: 20,
        },
    },
    Status: 200,
    Ts: 1747981866,
};
