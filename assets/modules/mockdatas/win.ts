import { ApiResponse } from "../rg-api/apidata";

export const winData: ApiResponse = {
    Player: {
        Balance: 99999.61,
    },
    Current: {
        Type: 1,
        TotalWin: 0.05,
        AccWin: 0.05,
        Result: {
            R: "203,101,101|104,103,204|102,101,204|102,104,104|102,204,203",
            WR: [
                {
                    T: 1,
                    AWP: [[], [], [0], [0], [0]],
                    R: "0.05,2,3,1,102,2",
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
            Payout: 0.05,
            Items: ["1|0.05|1"],
            Mode: 1,
        },
        WBId: "100",
        RId: 730688,
        ReId: 1,
    },
    Next: {
        Type: 1,
    },
    Status: 200,
    Ts: 1747213604,
};
