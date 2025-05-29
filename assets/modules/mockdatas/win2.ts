import { ApiResponse } from "../rg-api/apidata";

export const win2Data: ApiResponse = {
    Player: {
        Balance: 99997.97,
    },
    Current: {
        Type: 1,
        TotalWin: 0.16,
        AccWin: 0.16,
        Result: {
            R: "104,204,104|204,1,104|103,104,104|202,103,103|103,203,103",
            WR: [
                {
                    T: 1,
                    AWP: [[2, 0], [2, 1], [2, 1, 0], [1], [2]],
                    R: "0.02,3,3,1,104,1|0.02,4,3,1,104,1|0.02,7,3,1,104,1|0.10,5,4,1,103,2",
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
            Payout: 0.16,
            Items: ["1|0.16|1"],
            Mode: 1,
        },
        WBId: "100",
        RId: 730713,
        ReId: 1,
    },
    Next: {
        Type: 1,
    },
    Status: 200,
    Ts: 1747218119,
};
