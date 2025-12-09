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
