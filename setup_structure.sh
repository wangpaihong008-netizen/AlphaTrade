#!/bin/bash

echo "🚀 开始初始化 AlphaTrade 项目..."

# 1. 创建文件夹结构
mkdir -p components services

# 2. 生成核心文件

echo "📄 生成 package.json..."
cat > package.json << 'EOF'
{
  "name": "alphatrade-ai-hub",
  "private": true,
  "version": "2.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@google/genai": "^0.1.1",
    "recharts": "^2.12.0",
    "lucide-react": "^0.330.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "vite": "^5.1.0",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19"
  }
}
EOF

echo "📄 生成 vite.config.ts..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  server: {
    host: true,
    port: 3000
  }
});
EOF

echo "📄 生成 index.html..."
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AlphaTrade AI 策略中心</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              slate: { 850: '#151f2e', 900: '#0f172a', 950: '#020617' },
              trade: { up: '#10b981', down: '#ef4444', accent: '#3b82f6' }
            }
          }
        }
      }
    </script>
    <style>
      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      body { background-color: #020617; }
    </style>
  </head>
  <body class="bg-slate-950 text-slate-200 antialiased overflow-hidden">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
EOF

echo "📄 生成 types.ts..."
cat > types.ts << 'EOF'
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
EOF

echo "📄 生成 services/geminiService.ts..."
cat > services/geminiService.ts << 'EOF'
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
EOF

echo "📄 生成 components/Sidebar.tsx..."
cat > components/Sidebar.tsx << 'EOF'
import React from 'react';
import { LayoutDashboard, Radar, Terminal, Newspaper, Settings, BrainCircuit } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps { currentView: ViewState; onViewChange: (view: ViewState) => void; }

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'DASHBOARD' as ViewState, icon: LayoutDashboard, label: '总览' },
    { id: 'SCANNER' as ViewState, icon: Radar, label: '市场扫描' },
    { id: 'TERMINAL' as ViewState, icon: Terminal, label: '智能终端' },
    { id: 'NEWS' as ViewState, icon: Newspaper, label: '情报中心' },
  ];
  return (
    <div className="w-20 md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full z-50">
      <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800 bg-slate-950">
        <BrainCircuit className="w-8 h-8 text-trade-accent" />
        <span className="hidden md:block ml-3 font-bold text-white">AlphaTrade</span>
      </div>
      <nav className="flex-1 py-4 space-y-2 px-3">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${currentView === item.id ? 'bg-trade-accent/20 text-trade-accent' : 'text-slate-400 hover:bg-slate-900'}`}>
            <item.icon className="w-5 h-5" />
            <span className="hidden md:block ml-3 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button onClick={() => onViewChange('SETTINGS')} className="w-full flex items-center p-3 text-slate-500 hover:text-white">
          <Settings className="w-5 h-5" />
          <span className="hidden md:block ml-3">系统设置</span>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
EOF

echo "📄 生成 components/Dashboard.tsx..."
cat > components/Dashboard.tsx << 'EOF'
import React from 'react';
import { Wallet, Activity, PlayCircle, Layers } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC<any> = ({ activeGrids, activePositions }) => {
  const data = [{name:'00:00',v:42000},{name:'04:00',v:42500},{name:'08:00',v:41800},{name:'12:00',v:43200}];
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
           <p className="text-slate-400 text-sm">总资产 (USD)</p>
           <h3 className="text-2xl font-bold text-white">$45,230.50</h3>
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
           <p className="text-slate-400 text-sm">活跃策略</p>
           <h3 className="text-2xl font-bold text-white">{activeGrids.length}</h3>
        </div>
      </div>
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-80">
         <h2 className="text-lg font-semibold mb-4 text-white">资产走势</h2>
         <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1}/></AreaChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};
export default Dashboard;
EOF

echo "📄 生成 components/MarketScanner.tsx..."
cat > components/MarketScanner.tsx << 'EOF'
import React, { useState } from 'react';
import { Zap, Search, Filter } from 'lucide-react';
import { analyzeOpportunities } from '../services/geminiService';

const MarketScanner: React.FC<any> = ({ coins, onSelectCoin, onAiScan }) => {
  const [scanning, setScanning] = useState(false);
  const handleScan = async () => {
      setScanning(true);
      const res = await analyzeOpportunities(coins);
      onAiScan(res);
      setScanning(false);
  };
  return (
    <div className="p-6 h-full overflow-y-auto">
       <div className="flex justify-between items-end mb-6">
          <div><h1 className="text-3xl font-bold text-white">市场雷达</h1><p className="text-slate-400">AI 实时扫描全市场机会</p></div>
          <button onClick={handleScan} disabled={scanning} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">{scanning ? '扫描中...' : '开始 AI 扫描'}</button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coins.map((c: any) => (
             <div key={c.symbol} onClick={() => onSelectCoin(c)} className="bg-slate-900 p-5 rounded-xl border border-slate-800 cursor-pointer hover:border-blue-500">
                <div className="flex justify-between"><h3 className="font-bold text-white">{c.symbol}</h3><span className={c.change24h>=0?'text-green-500':'text-red-500'}>{c.change24h}%</span></div>
                <p className="text-2xl font-mono text-white mt-2">${c.price}</p>
             </div>
          ))}
       </div>
    </div>
  );
};
export default MarketScanner;
EOF

echo "📄 生成 components/TradingTerminal.tsx..."
cat > components/TradingTerminal.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { Play, Flame, Zap, Settings2 } from 'lucide-react';
import { getFuturesAdvice, getScalpingAdvice } from '../services/geminiService';
import { ComposedChart, YAxis, Tooltip, ResponsiveContainer, Bar } from 'recharts';

const TradingTerminal: React.FC<any> = ({ activeCoin, onOpenPosition }) => {
  const [mode, setMode] = useState('GRID');
  const [futuresStyle, setFuturesStyle] = useState('STANDARD');
  const [advice, setAdvice] = useState<any>(null);
  
  const handleAdvice = async () => {
     const res = futuresStyle === 'SCALPING' ? await getScalpingAdvice(activeCoin) : await getFuturesAdvice(activeCoin);
     setAdvice(res);
  };

  return (
    <div className="h-full flex flex-col md:flex-row">
       <div className="flex-1 bg-slate-950 p-4 border-r border-slate-800">
          <div className="h-16 flex justify-between items-center border-b border-slate-800 mb-4">
             <h2 className="text-2xl font-bold text-white">{activeCoin.symbol}/USDT <span className={activeCoin.change24h>=0?'text-green-500 text-lg':'text-red-500 text-lg'}>{activeCoin.price}</span></h2>
          </div>
          <div className="h-[400px] bg-slate-900/20 rounded border border-slate-800 flex items-center justify-center text-slate-500">
             K-Line Chart Placeholder
          </div>
       </div>
       <div className="w-[400px] bg-slate-900 p-6 border-l border-slate-800">
          <div className="flex mb-6 border-b border-slate-800">
             <button onClick={()=>setMode('GRID')} className={`flex-1 py-3 ${mode==='GRID'?'text-blue-500 border-b-2 border-blue-500':'text-slate-400'}`}>网格</button>
             <button onClick={()=>setMode('FUTURES')} className={`flex-1 py-3 ${mode==='FUTURES'?'text-blue-500 border-b-2 border-blue-500':'text-slate-400'}`}>合约</button>
          </div>
          {mode === 'FUTURES' && (
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={()=>setFuturesStyle('STANDARD')} className={`py-2 rounded border ${futuresStyle==='STANDARD'?'bg-slate-800 text-white':'text-slate-500'}`}>标准</button>
                   <button onClick={()=>setFuturesStyle('SCALPING')} className={`py-2 rounded border flex justify-center items-center ${futuresStyle==='SCALPING'?'bg-purple-900/50 text-purple-400 border-purple-500':'text-slate-500'}`}><Flame className="w-3 h-3 mr-1"/>拔头皮</button>
                </div>
                <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                   <div className="flex justify-between mb-2"><span className="text-xs font-bold text-slate-400">AI 信号</span><button onClick={handleAdvice} className="text-xs text-blue-400">生成建议</button></div>
                   {advice && (
                      <div className="text-sm space-y-1">
                         <div className="flex justify-between"><span className="font-bold text-white">{advice.direction}</span><span>Entry: {advice.entryPrice}</span></div>
                         <p className="text-xs text-slate-400">{advice.reasoning}</p>
                      </div>
                   )}
                </div>
                <button className="w-full py-3 bg-green-600 rounded font-bold text-white">买入 / 做多</button>
                <button className="w-full py-3 bg-red-600 rounded font-bold text-white">卖出 / 做空</button>
             </div>
          )}
       </div>
    </div>
  );
};
export default TradingTerminal;
EOF

echo "📄 生成 components/AIAdvisor.tsx..."
cat > components/AIAdvisor.tsx << 'EOF'
import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
const AIAdvisor: React.FC<any> = () => {
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState([{role:'model', text:'AlphaAI 在线。请问有什么可以帮您？'}]);
  const send = () => {
     if(!input) return;
     setMsgs([...msgs, {role:'user', text:input}, {role:'model', text:'模拟回复: 收到您的指令。'}]);
     setInput('');
  };
  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
       <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {msgs.map((m,i)=>(<div key={i} className={`p-3 rounded-lg text-sm ${m.role==='user'?'bg-blue-600 ml-auto':'bg-slate-800'}`}>{m.text}</div>))}
       </div>
       <div className="p-4 border-t border-slate-800 relative">
          <input value={input} onChange={e=>setInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm text-white" placeholder="输入..." />
          <button onClick={send} className="absolute right-6 top-6 text-blue-500"><Send className="w-4 h-4"/></button>
       </div>
    </div>
  );
};
export default AIAdvisor;
EOF

echo "📄 生成 components/NewsFeed.tsx..."
cat > components/NewsFeed.tsx << 'EOF'
import React from 'react';
const NewsFeed: React.FC<any> = ({ news }) => (
  <div className="p-6 space-y-4">
     <h1 className="text-2xl font-bold text-white mb-4">情报中心</h1>
     {news.map((n:any)=>(<div key={n.id} className="bg-slate-900 p-4 rounded border border-slate-800"><h3 className="font-bold text-slate-200">{n.title}</h3><p className="text-sm text-slate-400">{n.summary}</p></div>))}
  </div>
);
export default NewsFeed;
EOF

echo "📄 生成 components/SettingsView.tsx..."
cat > components/SettingsView.tsx << 'EOF'
import React from 'react';
import { Save } from 'lucide-react';
const SettingsView: React.FC<any> = () => (
  <div className="p-6">
     <h1 className="text-2xl font-bold text-white mb-6">系统设置</h1>
     <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
        <div><label className="text-xs text-slate-500 font-bold block mb-1">DeepSeek API Key</label><input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"/></div>
        <div><label className="text-xs text-slate-500 font-bold block mb-1">Exchange API Key</label><input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"/></div>
        <div><label className="text-xs text-slate-500 font-bold block mb-1">OKX Passphrase</label><input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" type="password"/></div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded font-bold flex items-center"><Save className="w-4 h-4 mr-2"/> 保存</button>
     </div>
  </div>
);
export default SettingsView;
EOF

echo "📄 生成 App.tsx..."
cat > App.tsx << 'EOF'
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MarketScanner from './components/MarketScanner';
import TradingTerminal from './components/TradingTerminal';
import AIAdvisor from './components/AIAdvisor';
import NewsFeed from './components/NewsFeed';
import SettingsView from './components/SettingsView';
import { CoinData, MarketTrend } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<any>('DASHBOARD');
  const [coins] = useState<CoinData[]>([
    { symbol: 'BTC', price: 44000, change24h: 2.5, volume24h: '20B', netFlow: 100, trend: MarketTrend.BULLISH, chartData: [] },
    { symbol: 'ETH', price: 2300, change24h: -1.2, volume24h: '10B', netFlow: -50, trend: MarketTrend.BEARISH, chartData: [] }
  ]);
  const [selectedCoin, setSelectedCoin] = useState(coins[0]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      <Sidebar currentView={view} onViewChange={setView} />
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
           {view === 'DASHBOARD' && <Dashboard activeGrids={[]} activePositions={[]} />}
           {view === 'SCANNER' && <MarketScanner coins={coins} onSelectCoin={(c:any)=>{setSelectedCoin(c);setView('TERMINAL')}} onAiScan={()=>{}} />}
           {view === 'TERMINAL' && <TradingTerminal activeCoin={selectedCoin} />}
           {view === 'NEWS' && <NewsFeed news={[]} />}
           {view === 'SETTINGS' && <SettingsView aiConfig={{}} exchangeConfig={{data:{}}} />}
        </div>
        <div className="w-80 border-l border-slate-900 hidden md:block">
           <AIAdvisor currentCoin={selectedCoin} />
        </div>
      </main>
    </div>
  );
};
export default App;
EOF

echo "📄 生成 index.tsx..."
cat > index.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
EOF

echo "✅ 所有文件生成完毕！"
echo "请运行: sh github_upload.sh 上传代码。"