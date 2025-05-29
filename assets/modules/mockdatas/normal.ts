import { ApiResponse } from "../dto/apidata";

export const normalData: ApiResponse = {
    Player: {
        Balance: 99999.52,
    },
    Current: {
        Type: 1,
        TotalWin: 0,
        AccWin: 0,
        Result: {
            R: "202,204,103|103,203,204|103,101,103|203,104,1|104,203,104",
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
        RId: 730689,
        ReId: 1,
    },
    Next: {
        Type: 1,
    },
    Status: 200,
    Ts: 1747214025,
};
