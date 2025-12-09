import React, { useState, useEffect } from 'react';
import { Play, Flame, Zap, Settings2, Skull, ArrowRightCircle, ChevronDown, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { CoinData, GridStrategyConfig, GridDirection, OHLCData, ActiveGrid, FuturesPosition, FuturesAdvice, PromptConfig, ScalpingAdvice } from '../types';
import { suggestGridStrategy, getFuturesAdvice, getScalpingAdvice } from '../services/geminiService';
import { ComposedChart, YAxis, XAxis, Tooltip, ResponsiveContainer, Bar, ReferenceLine, CartesianGrid } from 'recharts';

interface TradingTerminalProps {
  activeCoin: CoinData;
  coins?: CoinData[];
  onCoinChange?: (coin: CoinData) => void;
  exchangeConnected?: boolean;
  onStartGrid: (grid: ActiveGrid) => void;
  onOpenPosition: (position: FuturesPosition) => void;
  promptConfig?: PromptConfig;
}

const CustomCandle = (props: any) => {
  const { x, y, width, height, payload, yAxis } = props;
  if (!payload || !yAxis) return null;
  const { open, close, high, low } = payload;
  const isUp = close >= open;
  const color = isUp ? '#10b981' : '#ef4444';
  const yOpen = yAxis.scale(open);
  const yClose = yAxis.scale(close);
  const yHigh = yAxis.scale(high);
  const yLow = yAxis.scale(low);
  const bodyHeight = Math.max(2, Math.abs(yOpen - yClose));
  const bodyY = Math.min(yOpen, yClose);
  const wickX = x + width / 2;
  return (
    <g>
      <line x1={wickX} y1={yHigh} x2={wickX} y2={yLow} stroke={color} strokeWidth={1.5} />
      <rect x={x} y={bodyY} width={width} height={bodyHeight} fill={color} />
    </g>
  );
};

const OrderBook = ({ price, isUp }: { price: number, isUp: boolean }) => {
  const [asks, setAsks] = useState<{p: number, a: string, total: number}[]>([]);
  const [bids, setBids] = useState<{p: number, a: string, total: number}[]>([]);

  useEffect(() => {
    const spread = price * 0.0002;
    const generateDepth = (basePrice: number, type: 'ask' | 'bid') => {
      return Array(12).fill(0).map((_, i) => {
        const p = type === 'ask' 
          ? basePrice + spread + (i * basePrice * 0.0001) 
          : basePrice - spread - (i * basePrice * 0.0001);
        const a = (Math.random() * 2 + 0.1).toFixed(4);
        return { p, a, total: Math.random() * 100 }; 
      });
    };
    setAsks(generateDepth(price, 'ask').reverse());
    setBids(generateDepth(price, 'bid'));
    const interval = setInterval(() => {
       if(Math.random() > 0.5) {
         setAsks(generateDepth(price, 'ask').reverse());
         setBids(generateDepth(price, 'bid'));
       }
    }, 2000);
    return () => clearInterval(interval);
  }, [price]);

  return (
    <div className="flex flex-col h-full bg-[#0b101a] border-l border-slate-800 w-64 hidden xl:flex">
      <div className="p-3 border-b border-slate-800 font-bold text-slate-400 text-xs flex justify-between">
         <span>Price(USDT)</span><span>Amount</span>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col justify-end pb-1">
        {asks.map((a, i) => (
           <div key={`ask-${i}`} className="flex justify-between items-center px-3 py-0.5 hover:bg-slate-800 cursor-pointer relative group">
              <div className="absolute right-0 top-0 bottom-0 bg-red-500/10" style={{width: `${a.total}%`}}></div>
              <span className="text-red-500 text-xs font-mono relative z-10">{a.p.toFixed(2)}</span>
              <span className="text-slate-400 text-[10px] font-mono relative z-10">{a.a}</span>
           </div>
        ))}
      </div>
      <div className={`py-2 px-3 text-lg font-bold border-y border-slate-800 my-1 flex items-center justify-center ${isUp ? 'text-green-500 bg-green-500/5' : 'text-red-500 bg-red-500/5'}`}>
         {price.toFixed(2)} {isUp ? <TrendingUp className="w-4 h-4 ml-2" /> : <TrendingDown className="w-4 h-4 ml-2" />}
      </div>
      <div className="flex-1 overflow-hidden pt-1">
        {bids.map((b, i) => (
           <div key={`bid-${i}`} className="flex justify-between items-center px-3 py-0.5 hover:bg-slate-800 cursor-pointer relative group">
              <div className="absolute right-0 top-0 bottom-0 bg-green-500/10" style={{width: `${b.total}%`}}></div>
              <span className="text-green-500 text-xs font-mono relative z-10">{b.p.toFixed(2)}</span>
              <span className="text-slate-400 text-[10px] font-mono relative z-10">{b.a}</span>
           </div>
        ))}
      </div>
    </div>
  );
};

const TradingTerminal: React.FC<TradingTerminalProps> = ({ 
  activeCoin, coins = [], onCoinChange = () => {}, exchangeConnected = false, onStartGrid, onOpenPosition, promptConfig 
}) => {
  const [mode, setMode] = useState<'GRID' | 'FUTURES'>('GRID');
  const [showCoinMenu, setShowCoinMenu] = useState(false);
  const [candleData, setCandleData] = useState<OHLCData[]>([]);
  const [gridDirection, setGridDirection] = useState<GridDirection>('NEUTRAL');
  const [gridConfig, setGridConfig] = useState<Partial<GridStrategyConfig>>({ investment: 1000, leverage: 3, grids: 20 });
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReasoning, setAiReasoning] = useState("");
  const [futuresStyle, setFuturesStyle] = useState<'STANDARD' | 'SCALPING'>('STANDARD');
  const [futuresLeverage, setFuturesLeverage] = useState(10);
  const [futuresAdvice, setFuturesAdvice] = useState<FuturesAdvice | ScalpingAdvice | null>(null);

  useEffect(() => {
    const generateData = () => {
       const basePrice = activeCoin.price;
       const data: OHLCData[] = [];
       let current = basePrice;
       const volFactor = futuresStyle === 'SCALPING' ? 0.002 : 0.005;
       for (let i = 0; i < 60; i++) {
         const time = Date.now() - (60 - i) * (futuresStyle === 'SCALPING' ? 5 : 15) * 60 * 1000;
         const open = current;
         const change = (Math.random() - 0.5) * basePrice * volFactor;
         const close = open + change;
         const high = Math.max(open, close) + Math.random() * basePrice * (volFactor/2);
         const low = Math.min(open, close) - Math.random() * basePrice * (volFactor/2);
         data.push({ time, open, high, low, close });
         current = close;
       }
       setCandleData(data);
    };
    generateData();
  }, [activeCoin, futuresStyle]);

  const handleAiOptimize = async () => {
    setLoadingAI(true);
    await new Promise(r => setTimeout(r, 1500));
    const strategy = await suggestGridStrategy(activeCoin, gridDirection, gridConfig.investment || 1000, 'GEMINI', '', promptConfig);
    setGridConfig({ ...gridConfig, ...strategy });
    setAiReasoning(strategy.reasoning || "AI Analysis Complete");
    setLoadingAI(false);
  };

  const handleFuturesAdvice = async () => {
    setLoadingAI(true);
    await new Promise(r => setTimeout(r, 1000));
    const advice = futuresStyle === 'SCALPING' 
        ? await getScalpingAdvice(activeCoin, 'GEMINI', '', promptConfig)
        : await getFuturesAdvice(activeCoin, 'GEMINI', '', promptConfig);
    setFuturesAdvice(advice);
    setLoadingAI(false);
  };

  const executeGrid = () => {
    onStartGrid({ ...gridConfig as any, symbol: activeCoin.symbol, direction: gridDirection, id: Math.random().toString(), startTime: new Date().toISOString(), currentProfit: 0, gridYield: 1.2 });
  };

  const minPrice = candleData.length ? Math.min(...candleData.map(c => c.low)) * 0.995 : 0;
  const maxPrice = candleData.length ? Math.max(...candleData.map(c => c.high)) * 1.005 : 100;

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-[#0b101a]">
      <div className="flex-1 flex flex-col border-r border-slate-800 relative min-w-0">
        <div className="h-14 flex justify-between items-center px-4 border-b border-slate-800 bg-slate-950 shrink-0">
           <div className="relative z-20">
             <button onClick={() => setShowCoinMenu(!showCoinMenu)} className="flex items-center space-x-2 hover:bg-slate-900 px-2 py-1 rounded transition-colors group">
                <div className="text-xl font-bold text-white group-hover:text-trade-accent">{activeCoin.symbol}USDT</div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
             </button>
             {showCoinMenu && (
               <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                 {coins?.map(c => (
                   <div key={c.symbol} onClick={() => { onCoinChange(c); setShowCoinMenu(false); }} className="px-4 py-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center border-b border-slate-800/50">
                     <span className="font-bold text-slate-200">{c.symbol}</span>
                     <div className="text-right"><div className="text-xs text-slate-400">${c.price}</div></div>
                   </div>
                 ))}
               </div>
             )}
           </div>
           <div className="flex space-x-6 items-center">
              <div><span className={`text-lg font-mono font-bold ${activeCoin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>${activeCoin.price.toLocaleString()}</span></div>
           </div>
        </div>
        <div className="flex-1 relative bg-[#0b101a] w-full min-h-0">
           {candleData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={candleData} margin={{ top: 20, right: 60, left: 10, bottom: 20 }}>
                   <XAxis dataKey="time" tickFormatter={(t) => new Date(t).getHours() + ':' + new Date(t).getMinutes()} minTickGap={40} axisLine={{ stroke: '#1e293b' }} tick={{fill: '#64748b', fontSize: 10}} />
                   <YAxis domain={[minPrice, maxPrice]} orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} tickFormatter={(val) => val.toFixed(2)} />
                   <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} itemStyle={{ color: '#e2e8f0' }} formatter={(val: number) => val.toFixed(2)} />
                   <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                   <Bar dataKey="close" shape={<CustomCandle />} isAnimationActive={false} />
                   {futuresAdvice && (
                     <>
                       <ReferenceLine y={futuresAdvice.entryPrice} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 3" label={{value: 'ENTRY', position: 'insideRight', fill: '#3b82f6', fontSize: 10}} />
                       <ReferenceLine y={futuresAdvice.stopLoss} stroke="#ef4444" strokeWidth={1} label={{value: 'SL', position: 'insideRight', fill: '#ef4444', fontSize: 10}} />
                     </>
                   )}
                 </ComposedChart>
               </ResponsiveContainer>
           ) : <div className="flex items-center justify-center h-full text-slate-600">Loading Chart...</div>}
        </div>
      </div>
      <OrderBook price={activeCoin.price} isUp={activeCoin.change24h >= 0} />
      <div className="w-full md:w-80 lg:w-96 bg-slate-950 border-l border-slate-800 flex flex-col z-10 shadow-2xl shrink-0">
         <div className="flex border-b border-slate-800 bg-slate-950">
            <button onClick={() => setMode('GRID')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${mode === 'GRID' ? 'border-trade-accent text-trade-accent bg-slate-900' : 'text-slate-500 hover:bg-slate-900/50'}`}>网格</button>
            <button onClick={() => setMode('FUTURES')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${mode === 'FUTURES' ? 'border-trade-accent text-trade-accent bg-slate-900' : 'text-slate-500 hover:bg-slate-900/50'}`}>合约</button>
         </div>
         <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#0b101a]">
            {mode === 'GRID' ? (
               <div className="space-y-6">
                  <div>
                     <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">策略方向</label>
                     <div className="grid grid-cols-3 gap-2">
                        {['LONG', 'NEUTRAL', 'SHORT'].map(d => (
                           <button key={d} onClick={() => setGridDirection(d as any)} className={`py-2.5 text-xs font-bold rounded-lg border transition-all ${gridDirection === d ? 'bg-slate-800 border-slate-500 text-white' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>{d}</button>
                        ))}
                     </div>
                  </div>
                  <div className="p-0.5 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                      <div className="bg-slate-900 rounded-[10px] p-4 relative">
                            <h4 className="text-white font-bold text-sm flex items-center mb-1"><Zap className="w-4 h-4 mr-1 text-yellow-400" /> AI 智能策略</h4>
                            <button onClick={handleAiOptimize} disabled={loadingAI} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center justify-center transition-all mt-3">
                               {loadingAI ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <Settings2 className="w-3 h-3 mr-2" />} {loadingAI ? '分析中...' : '生成策略'}
                            </button>
                      </div>
                  </div>
                  {aiReasoning && <div className="bg-slate-900 p-3 rounded-lg border-l-2 border-indigo-500 text-xs text-slate-400">{aiReasoning}</div>}
                  <button onClick={executeGrid} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center"><Play className="w-5 h-5 mr-2" /> 启动网格</button>
               </div>
            ) : (
               <div className="space-y-6">
                  <div className="bg-slate-900 p-1 rounded-xl grid grid-cols-2 gap-1 border border-slate-800">
                     <button onClick={() => setFuturesStyle('STANDARD')} className={`py-2 text-[10px] font-bold rounded-lg transition-all ${futuresStyle === 'STANDARD' ? 'bg-slate-800 text-white shadow' : 'text-slate-500'}`}>标准模式</button>
                     <button onClick={() => setFuturesStyle('SCALPING')} className={`py-2 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center ${futuresStyle === 'SCALPING' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500'}`}><Flame className="w-3 h-3 mr-1" /> 拔头皮</button>
                  </div>
                  <div className={`border rounded-xl p-0.5 ${futuresStyle === 'SCALPING' ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-blue-600 to-cyan-600'}`}>
                     <div className="bg-slate-900 rounded-[10px] p-4">
                        <div className="flex justify-between items-center mb-4">
                           <h4 className={`text-xs font-bold flex items-center ${futuresStyle === 'SCALPING' ? 'text-purple-400' : 'text-blue-400'}`}>
                              {futuresStyle === 'SCALPING' ? <Skull className="w-4 h-4 mr-1"/> : <Zap className="w-4 h-4 mr-1"/>} AI 信号
                           </h4>
                           <button onClick={handleFuturesAdvice} disabled={loadingAI} className="text-[10px] underline text-slate-500 hover:text-white flex items-center">
                              {loadingAI ? <RefreshCw className="w-3 h-3 animate-spin mr-1"/> : '刷新'}
                           </button>
                        </div>
                        {futuresAdvice ? (
                           <div className="space-y-3">
                              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                                 <span className={`font-bold text-lg ${futuresAdvice.direction === 'LONG' ? 'text-green-500' : 'text-red-500'}`}>{futuresAdvice.direction}</span>
                                 <div className="text-right"><span className="text-[10px] text-slate-500 block">ENTRY</span><span className="font-mono text-white text-sm">{futuresAdvice.entryPrice}</span></div>
                              </div>
                              <p className="text-[10px] text-slate-400 italic">"{futuresAdvice.reasoning}"</p>
                              <button onClick={() => onOpenPosition({ id: Math.random().toString(), symbol: activeCoin.symbol, side: futuresAdvice.direction, entryPrice: activeCoin.price, markPrice: activeCoin.price, size: 100, leverage: futuresAdvice.leverage, pnl: 0, pnlPercent: 0 })} className={`w-full py-3 mt-1 rounded-lg text-xs font-bold text-white flex items-center justify-center transition-all ${futuresStyle === 'SCALPING' ? 'bg-purple-600' : 'bg-blue-600'}`}><ArrowRightCircle className="w-3 h-3 mr-1" /> 一键跟单 (x{futuresAdvice.leverage})</button>
                           </div>
                        ) : <div className="text-center py-6 text-xs text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">点击刷新信号</div>}
                     </div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                     <div className="flex justify-between text-xs font-bold text-slate-500 mb-4"><span>杠杆倍数</span><span className={`px-2 py-0.5 rounded text-white ${futuresLeverage > 20 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{futuresLeverage}x</span></div>
                     <input type="range" min="1" max={futuresStyle === 'SCALPING' ? 125 : 50} value={futuresLeverage} onChange={(e) => setFuturesLeverage(parseInt(e.target.value))} className={`w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer ${futuresStyle === 'SCALPING' ? 'accent-purple-500' : 'accent-blue-500'}`} />
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default TradingTerminal;
