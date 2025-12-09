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
