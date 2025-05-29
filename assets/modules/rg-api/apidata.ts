export interface WinResultItem {
    T: number;
    AWP: number[][];
    R: string;
}

export interface BuyFeatureItem {
    RoundType: number;
    Rate: number;
    Total: number;
}

export interface PlayerInfo {
    Balance: number;
    Rate?: number;
    Currency?: string;
    CoinRate?: number;
}

export interface FreeSpinInfo {
    Current: number;
    Total: number;
}

export interface NextFreeSpinInfo {
    Next: number;
    Total: number;
}

export interface CurrentInfo {
    Type: number;
    TotalWin: number;
    AccWin: number;
    Result: {
        R: string;
        WR?: WinResultItem[];
    };
    FreeSpin?: FreeSpinInfo;
    Round: {
        RoundType: number;
        Bet: number;
        ActualBet: number;
        BetValue: number;
        Line: number;
        LineBet: number;
        Payout: number;
        Items: string[];
        Mode: number;
    };
    WBId: string;
    RId: number;
    ReId: number;
}

export interface NextInfo {
    Type: number;
    FreeSpin?: NextFreeSpinInfo; // for type 10
}

export interface GameInfo {
    Line: number;
    BetValue: number[];
    LineBet: number[];
    BuyFeature: BuyFeatureItem[];
}

export interface ApiResponse {
    Player?: PlayerInfo;
    Current: CurrentInfo;
    Next: NextInfo;
    GameInfo?: GameInfo;
    Status: number;
    Ts: number;
}
