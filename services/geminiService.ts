import { GoogleGenAI, Type } from "@google/genai";
import { CoinData, WhaleAlert, NewsItem, GridDirection, TradingSignal, AIProvider, GridStrategyConfig, FuturesAdvice, PromptConfig, ScalpingAdvice } from "../types";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const geminiModelId = "gemini-2.5-flash";
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"; 

const SYSTEM_PERSONA = {
  CONSERVATIVE: "You are AlphaQuant-Safe. PRIORITY: Capital Preservation. STYLE: Low leverage (1x-3x).",
  BALANCED: "You are AlphaQuant-Core. PRIORITY: Risk-Adjusted Returns.",
  AGGRESSIVE: "You are AlphaQuant-Degen. PRIORITY: Maximum Short-Term Profit. STYLE: High leverage (10x-50x)."
};

const getBaseSystemPrompt = (config?: PromptConfig) => {
  const mode = config?.mode || 'BALANCED';
  const custom = config?.customInstructions || '';
  return `${SYSTEM_PERSONA[mode]} Language: Simplified Chinese. Constraints: "${custom}"`;
};

const cleanJson = (text: string) => {
  if (!text) return "{}";
  let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstOpenBrace = cleaned.indexOf('{');
  const firstOpenBracket = cleaned.indexOf('[');
  const lastCloseBrace = cleaned.lastIndexOf('}');
  const lastCloseBracket = cleaned.lastIndexOf(']');
  const firstOpen = (firstOpenBrace !== -1 && (firstOpenBracket === -1 || firstOpenBrace < firstOpenBracket)) ? firstOpenBrace : firstOpenBracket;
  const lastClose = (lastCloseBrace !== -1 && (lastCloseBracket === -1 || lastCloseBrace > lastCloseBracket)) ? lastCloseBrace : lastCloseBracket;
  if (firstOpen !== -1 && lastClose !== -1) cleaned = cleaned.substring(firstOpen, lastClose + 1);
  return cleaned;
};

const callDeepSeek = async (systemPrompt: string, userPrompt: string, jsonMode: boolean = true, apiKey: string = "") => {
  const key = apiKey || process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("缺少 DeepSeek API Key");
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
        response_format: jsonMode ? { type: "json_object" } : undefined,
        stream: false
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) { console.error("DeepSeek Error:", error); throw error; }
};

const generateMockStrategy = (coin: CoinData) => ({
  lowerPrice: coin.price * 0.9, upperPrice: coin.price * 1.1, grids: 20, stopLoss: coin.price * 0.85, takeProfit: coin.price * 1.2, leverage: 3,
  reasoning: "API 连接失败，使用本地模拟策略。", allocationDetail: "建议 40% 保证金", guardrails: { hedgeMode: true, trendSurfing: false, autoDeleverage: true, maxDrawdownOverride: 10 }
});

const generateMockFuturesAdvice = (coin: CoinData, style: string = 'STANDARD'): FuturesAdvice => ({
  direction: Math.random() > 0.5 ? 'LONG' : 'SHORT', entryPrice: coin.price, stopLoss: coin.price * 0.95, takeProfit: coin.price * 1.05,
  leverage: style === 'SCALPING' ? 25 : 5, confidence: 75, reasoning: "本地模拟信号: 支撑位反弹。", expectedPnl: 12.5, style: style as any
});

export const analyzeMarketSentiment = async (news: NewsItem[], whaleAlerts: WhaleAlert[], provider: AIProvider = 'GEMINI', apiKey: string = "") => {
  return { sentiment: "中性", score: 50, insights: ["模拟数据：API 未连接", "建议关注 BTC 动向"] };
};

export const suggestGridStrategy = async (coin: CoinData, direction: GridDirection, investment: number = 1000, provider: AIProvider = 'GEMINI', apiKey: string = "", promptConfig?: PromptConfig) => {
  const systemPrompt = getBaseSystemPrompt(promptConfig);
  const prompt = `Asset: ${coin.symbol}, Price: ${coin.price}, Dir: ${direction}. Output JSON strategy.`;
  try {
    let jsonStr = "{}";
    if (provider === 'DEEPSEEK') {
      const text = await callDeepSeek(systemPrompt, prompt, true, apiKey);
      jsonStr = cleanJson(text);
    } else {
      if (!ai) throw new Error("Google Key Missing");
      const response = await ai.models.generateContent({
        model: geminiModelId, contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      jsonStr = response.text || "{}";
    }
    return JSON.parse(jsonStr);
  } catch (e) { return generateMockStrategy(coin); }
};

export const getFuturesAdvice = async (coin: CoinData, provider: AIProvider = 'GEMINI', apiKey: string = "", promptConfig?: PromptConfig) => {
  return generateMockFuturesAdvice(coin);
};

export const getScalpingAdvice = async (coin: CoinData, provider: AIProvider = 'GEMINI', apiKey: string = "", promptConfig?: PromptConfig): Promise<ScalpingAdvice> => {
   const mock = generateMockFuturesAdvice(coin, 'SCALPING');
   return { ...mock, timeframe: '5m', winRate: 65, pressure: 'BUY' } as ScalpingAdvice;
};

export const scanForSignals = async (coins: CoinData[], whaleAlerts: WhaleAlert[], provider: AIProvider = 'GEMINI', apiKey: string = "", promptConfig?: PromptConfig) => {
  return coins.slice(0, 2).map(c => ({
    id: Math.random().toString(), timestamp: new Date().toISOString(), symbol: c.symbol, type: 'INFO',
    title: `${c.symbol} 模拟信号`, description: "API 未连接，显示模拟数据", confidence: 60, isRead: false
  }));
};

export const analyzeOpportunities = async (filteredCoins: CoinData[]) => {
    return filteredCoins.slice(0,3).map(c => ({
        symbol: c.symbol, direction: "LONG", reason: "模拟机会: 交易量放大", potential: 75
    }));
};

export const chatWithAdvisor = async (history: any[], message: string, context: string, provider: AIProvider = 'GEMINI', apiKey: string = "", promptConfig?: PromptConfig) => {
    return "模拟回复: 这是一个演示版本，请配置 API Key 以启用完整 AI 功能。";
};

export const runSystemDiagnostics = async (deepSeekKey: string, onLog: (msg: string) => void) => {
  onLog("[系统] 开始自检...");
  onLog(`[网络] 浏览器在线: ${navigator.onLine}`);
  return true;
};

export const analyzeDiagnosticReport = async (report: string[]) => {
  return "系统运行正常 (模拟分析)。";
};
