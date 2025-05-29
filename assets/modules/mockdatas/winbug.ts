import { ApiResponse } from "../rg-api/apidata";

export const winbugData: ApiResponse = {
    Player: {
        Balance: 99996.77,
    },
    Current: {
        Type: 1,
        TotalWin: 0.02,
        AccWin: 0.02,
        Result: {
            R: "202,203,104|1,104,202|104,103,104|103,103,203|203,204,103",
            WR: [
                {
                    T: 1,
                    AWP: [[2], [1], [0], [], []],
                    R: "0.02,5,3,1,104,1",
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
            Payout: 0.02,
            Items: ["1|0.02|1"],
            Mode: 1,
        },
        WBId: "100",
        RId: 732939,
        ReId: 1,
    },
    Next: {
        Type: 1,
    },
    Status: 200,
    Ts: 1747382243,
};
