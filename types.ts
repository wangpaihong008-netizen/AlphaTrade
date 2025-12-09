export enum MarketTrend {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL'
}

export interface CoinData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: string;
  netFlow: number;
  trend: MarketTrend;
  chartData: { time: string; value: number }[];
}

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface WhaleAlert {
  id: string;
  timestamp: string;
  symbol: string;
  amount: string;
  amountUsd: number;
  from: string;
  to: string;
  type: 'INFLOW' | 'OUTFLOW' | 'TRANSFER';
}

export type GridDirection = 'NEUTRAL' | 'LONG' | 'SHORT';

export interface StrategyGuardrails {
  hedgeMode: boolean;
  trendSurfing: boolean;
  autoDeleverage: boolean;
  maxDrawdownOverride: number;
}

export interface GridStrategyConfig {
  symbol: string;
  direction: GridDirection;
  lowerPrice: number;
  upperPrice: number;
  grids: number;
  investment: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
  isRunning: boolean;
  guardrails?: StrategyGuardrails;
  allocationDetail?: string;
}

export interface FuturesAdvice {
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  leverage: number;
  confidence: number;
  reasoning: string;
  expectedPnl?: number;
  style?: 'STANDARD' | 'SCALPING';
}

export interface ScalpingAdvice extends FuturesAdvice {
  timeframe: string;
  winRate: number;
  pressure: 'BUY' | 'SELL';
}

export interface ActiveGrid extends GridStrategyConfig {
  id: string;
  startTime: string;
  currentProfit: number;
  gridYield: number;
}

export interface FuturesPosition {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  markPrice: number;
  size: number;
  leverage: number;
  pnl: number;
  pnlPercent: number;
  stopLoss?: number;
  trailingStop?: number;
}

export interface TradeHistoryItem {
  id: string;
  symbol: string;
  type: 'GRID' | 'FUTURES';
  side: string;
  closeTime: string;
  finalPnl: number;
}

export interface ScannerFilter {
  period: '1H' | '4H' | '24H';
  minVolume: number;
  minChange: number;
  minFlow?: number;
  trend?: MarketTrend;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  summary: string;
}

export interface TradingSignal {
  id: string;
  timestamp: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  confidence: number;
  isRead: boolean;
}

export interface UrgentAlert {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'danger' | 'warning';
  timestamp: number;
  advice: string;
}

export type ViewState = 'DASHBOARD' | 'SCANNER' | 'TERMINAL' | 'NEWS' | 'SETTINGS';
export type AIProvider = 'GEMINI' | 'DEEPSEEK';
export type ExchangeName = 'BINANCE' | 'OKX' | 'PAI';
export type ScanInterval = 5 | 15 | 30 | 60;
export type StrategyMode = 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';

export interface PromptConfig {
  mode: StrategyMode;
  customInstructions: string;
}

export interface SystemLog {
  id: string;
  timestamp: number;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
  source?: string;
}

export type Language = 'ZH' | 'EN';

export interface NetworkStatus {
  online: boolean;
  latency: number;
  lastChecked: number;
}
