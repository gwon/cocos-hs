import { ApiResponse } from "../rg-api/apidata";

export const win3Data: ApiResponse = {
    Player: {
        Balance: 100000.14,
    },
    Current: {
        Type: 1,
        TotalWin: 0.09,
        AccWin: 0.09,
        Result: {
            R: "203,104,104|1,104,202|103,101,103|202,103,103|103,203,103",
            WR: [
                {
                    T: 1,
                    AWP: [[], [], [2, 0], [2, 1], [2, 0]],
                    R: "0.03,3,3,1,103,2|0.03,4,3,1,103,2|0.03,5,3,1,103,2",
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
            Payout: 0.09,
            Items: ["1|0.09|1"],
            Mode: 1,
        },
        WBId: "100",
        RId: 732736,
        ReId: 1,
    },
    Next: {
        Type: 1,
    },
    Status: 200,
    Ts: 1747378986,
};
