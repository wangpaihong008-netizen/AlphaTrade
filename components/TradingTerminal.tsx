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
