export interface ChartImage {
  id: string;
  url: string; // Base64 data URL or Object URL
  base64Data: string; // Raw base64 without data URI header
  mimeType: string;
  name: string;
  timeframe: string; // e.g. "15M", "5M", "3M", "1M", "4H", "1H"
}

export interface MarketStructure {
  trend: string;
  bosChoch: string;
  liquidity: string;
  supportResistance: string;
  orderBlock: string;
  fvg: string;
  momentum: string;
}

export interface TradeSetup {
  entry: string;
  entryPriceNum?: number;
  stopLoss: string;
  stopLossNum?: number;
  takeProfit1: string;
  takeProfit1Num?: number;
  takeProfit2: string;
  takeProfit2Num?: number;
  riskRewardRatio: string;
  confidenceScore: number; // 0 - 100
}

export interface ConfluenceScores {
  higherTimeframeBias: number; // max 15
  marketStructure: number; // max 15
  liquidity: number; // max 15
  entryZoneQuality: number; // max 15
  priceActionConfirmation: number; // max 10
  fvgOrderBlock: number; // max 10
  indicatorMomentum: number; // max 5
  riskReward: number; // max 10
  multiTimeframeAlignment: number; // max 5
}

export interface PositionSizing {
  accountBalance?: number;
  riskPercentage?: number;
  riskAmountDollars?: number;
  pipRiskValue?: string;
  lotOrContractAdvice?: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  market: string;
  timeframesAnalyzed: string[];
  marketBias: 'Strong Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Strong Bearish' | 'Ranging' | 'Choppy / Unclear';
  finalSignal: 'BUY' | 'SELL' | 'NO TRADE';
  tradeSetup: TradeSetup;
  execution: 'ENTER NOW' | 'WAIT FOR RETEST' | 'WAIT FOR CONFIRMATION' | 'NO TRADE';
  reasonsForTrade: string[];
  marketStructure: MarketStructure;
  confluenceScores?: ConfluenceScores;
  invalidation: string;
  riskWarning: string;
  positionSizing?: PositionSizing;
  rawReportMarkdown: string;
  uploadedImagesSummary?: { name: string; timeframe: string }[];
}

export interface SamplePresetChart {
  id: string;
  title: string;
  asset: string;
  description: string;
  images: {
    name: string;
    timeframe: string;
    url: string; // Data URL or SVG canvas preview
  }[];
}
