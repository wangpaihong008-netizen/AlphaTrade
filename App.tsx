import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MarketScanner from './components/MarketScanner';
import TradingTerminal from './components/TradingTerminal';
import AIAdvisor from './components/AIAdvisor';
import NewsFeed from './components/NewsFeed';
import SettingsView from './components/SettingsView';
import { ViewState, CoinData, WhaleAlert, NewsItem, MarketTrend, AIProvider, ScanInterval, ActiveGrid, FuturesPosition, UrgentAlert, TradeHistoryItem, PromptConfig, SystemLog, Language, NetworkStatus, ExchangeName } from './types';
import { Menu, X, Bell, Zap, XCircle } from 'lucide-react';

// Mock Data Generators with expanded coin list
const generateMockCoins = (): CoinData[] => [
  { symbol: 'BTC', price: 44250.00, change24h: 2.5, volume24h: '24.5B', netFlow: 150000000, trend: MarketTrend.BULLISH, chartData: Array(20).fill(0).map((_, i) => ({ time: `${i}`, value: Math.random() })) },
  { symbol: 'ETH', price: 2350.15, change24h: -1.2, volume24h: '12.1B', netFlow: -45000000, trend: MarketTrend.BEARISH, chartData: Array(20).fill(0).map((_, i) => ({ time: `${i}`, value: Math.random() })) },
  { symbol: 'SOL', price: 98.45, change24h: 8.4, volume24h: '4.2B', netFlow: 82000000, trend: MarketTrend.BULLISH, chartData: Array(20).fill(0).map((_, i) => ({ time: `${i}`, value: Math.random() })) },
  { symbol: 'DOGE', price: 0.082, change24h: 12.1, volume24h: '1.5B', netFlow: 12000000, trend: MarketTrend.BULLISH, chartData: Array(20).fill(0).map((_, i) => ({ time: `${i}`, value: Math.random() })) },
  { symbol: 'AVAX', price: 35.20, change24h: -0.5, volume24h: '800M', netFlow: -5000000, trend: MarketTrend.NEUTRAL, chartData: Array(20).fill(0).map((_, i) => ({ time: `${i}`, value: Math.random() })) },
  { symbol: 'LINK', price: 15.60, change24h: 3.2, volume24h: '400M', netFlow: 8000000, trend: MarketTrend.BULLISH, chartData: Array(20).fill(0).map((_, i) => ({ time: `${i}`, value: Math.random() })) },
  { symbol: 'MATIC', price: 0.85, change24h: -2.1, volume24h: '250M', netFlow: -12000000, trend: MarketTrend.BEARISH, chartData: Array(20).fill(0).map((_, i) => ({ time: `${i}`, value: Math.random() })) },
  { symbol: 'XRP', price: 0.55, change24h: 0.5, volume24h: '1.2B', netFlow: 500000, trend: MarketTrend.NEUTRAL, chartData: Array(20).fill(0).map((_, i) => ({ time: `${i}`, value: Math.random() })) },
  { symbol: 'ADA', price: 0.50, change24h: -1.5, volume24h: '350M', netFlow: -8000000, trend: MarketTrend.BEARISH, chartData: Array(20).fill(0).map((_, i) => ({ time: `${i}`, value: Math.random() })) },
  { symbol: 'DOT', price: 7.20, change24h: 1.8, volume24h: '180M', netFlow: 2000000, trend: MarketTrend.BULLISH, chartData: Array(20).fill(0).map((_, i) => ({ time: `${i}`, value: Math.random() })) },
  { symbol: 'PEPE', price: 0.0000012, change24h: 15.5, volume24h: '120M', netFlow: 25000000, trend: MarketTrend.BULLISH, chartData: [] },
  { symbol: 'WIF', price: 2.10, change24h: -8.5, volume24h: '80M', netFlow: -15000000, trend: MarketTrend.BEARISH, chartData: [] },
];

const generateMockWhaleAlerts = (): WhaleAlert[] => [
  { id: '1', timestamp: new Date().toISOString(), symbol: 'ETH', amount: '5,000', amountUsd: 11500000, from: '0x3f...2a', to: 'Binance', type: 'INFLOW' },
  { id: '2', timestamp: new Date(Date.now() - 300000).toISOString(), symbol: 'BTC', amount: '250', amountUsd: 10800000, from: 'Coinbase', to: '0x9a...bc', type: 'OUTFLOW' },
  { id: '3', timestamp: new Date(Date.now() - 600000).toISOString(), symbol: 'SOL', amount: '150,000', amountUsd: 14700000, from: 'Unknown', to: 'Unknown', type: 'TRANSFER' },
];

const generateMockNews = (): NewsItem[] => [
  { id: '1', title: 'SEC Approves New Crypto Regulation Framework', source: 'CoinDesk', timestamp: new Date().toISOString(), sentiment: 'POSITIVE', summary: 'The new framework provides clarity for institutional investors, potentially boosting market confidence.' },
  { id: '2', title: 'Major Exchange Suspends Withdrawals Temporarily', source: 'TheBlock', timestamp: new Date().toISOString(), sentiment: 'NEGATIVE', summary: 'Technical maintenance cited as the reason, but market anxiety is rising slightly.' },
  { id: '3', title: 'Solana Ecosystem TVL Hits All-Time High', source: 'DefiLlama', timestamp: new Date().toISOString(), sentiment: 'POSITIVE', summary: 'Total Value Locked has surpassed previous records indicating strong adoption.' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [whaleAlerts, setWhaleAlerts] = useState<WhaleAlert[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdvisor, setShowAdvisor] = useState(false); // Mobile advisor toggle

  // Global AI & Exchange Settings
  const [aiProvider, setAiProvider] = useState<AIProvider>('GEMINI');
  const [scanInterval, setScanInterval] = useState<ScanInterval>(5);
  const [deepSeekKey, setDeepSeekKey] = useState('');
  const [exchangeConfig, setExchangeConfig] = useState<{
    connected: boolean;
    key: string;
    secret: string;
    passphrase?: string;
    exchangeName?: ExchangeName;
  }>({
    connected: false,
    key: '',
    secret: '',
    passphrase: '',
    exchangeName: 'BINANCE'
  });
  
  // Strategy/Prompt Configuration
  const [promptConfig, setPromptConfig] = useState<PromptConfig>({
    mode: 'BALANCED',
    customInstructions: ''
  });

  // System & Language
  const [language, setLanguage] = useState<Language>('ZH');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    online: true,
    latency: 0,
    lastChecked: Date.now()
  });

  // System Logs
  const [logs, setLogs] = useState<SystemLog[]>([]);

  const addLog = (level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', message: string) => {
    setLogs(prev => [...prev, {
       id: Math.random().toString(),
       timestamp: Date.now(),
       level,
       message
    }]);
  };

  // Active Strategies State
  const [activeGrids, setActiveGrids] = useState<ActiveGrid[]>([]);
  const [activePositions, setActivePositions] = useState<FuturesPosition[]>([]);
  const [pnlHistory, setPnlHistory] = useState<TradeHistoryItem[]>([]);
  
  // Notification State
  const [urgentAlerts, setUrgentAlerts] = useState<UrgentAlert[]>([]);

  // Simulation loop & Background Activity
  useEffect(() => {
    // Initial Load
    setCoins(generateMockCoins());
    setWhaleAlerts(generateMockWhaleAlerts());
    setNews(generateMockNews());
    setSelectedCoin(generateMockCoins()[0]);
    addLog('INFO', 'System initialized. Connecting to simulated market data stream...');

    // Live update simulation for coins and positions PNL
    const interval = setInterval(() => {
      setCoins(prevCoins => prevCoins.map(coin => ({
        ...coin,
        price: coin.price * (1 + (Math.random() * 0.002 - 0.001)),
        netFlow: coin.netFlow + (Math.random() - 0.5) * 1000000 // Simulate flow changes
      })));

      // Simulate PNL updates for active positions
      setActivePositions(prev => prev.map(pos => {
        const change = (Math.random() - 0.5) * 10;
        return {
          ...pos,
          markPrice: pos.markPrice + change,
          pnl: pos.pnl + change * pos.size * (pos.side === 'LONG' ? 1 : -1),
          pnlPercent: pos.pnlPercent + (Math.random() - 0.5)
        };
      }));

    }, 3000);

    // Background Logging Loop (Every 15s)
    const logInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        addLog('INFO', 'Background Sync: Market data packet received (32ms)');
      }
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  // Network Heartbeat Monitoring
  useEffect(() => {
    const checkNetwork = async () => {
       const start = Date.now();
       try {
         // Try to fetch a tiny resource or just check online status
         // Since we can't reliably ping google due to cors in some environments, we rely on navigator + mock latency for demo
         const online = navigator.onLine;
         const latency = online ? Math.floor(Math.random() * 50) + 20 : 0; // Simulated latency
         
         setNetworkStatus({
            online,
            latency,
            lastChecked: Date.now()
         });
       } catch (e) {
         setNetworkStatus(prev => ({ ...prev, online: false }));
       }
    };
    
    // Check immediately then every 30s
    checkNetwork();
    const netInterval = setInterval(checkNetwork, 30000);
    return () => clearInterval(netInterval);
  }, []);

  const handleCoinSelect = (coin: CoinData) => {
    setSelectedCoin(coin);
    setCurrentView('TERMINAL');
  };

  const handleAddGrid = (grid: ActiveGrid) => {
    setActiveGrids(prev => [grid, ...prev]);
    addLog('SUCCESS', `Started Grid Strategy for ${grid.symbol} (${grid.direction})`);
    setCurrentView('DASHBOARD'); // Redirect to dashboard to see result
  };

  const handleAddPosition = (pos: FuturesPosition) => {
    setActivePositions(prev => [pos, ...prev]);
    addLog('SUCCESS', `Opened Position: ${pos.side} ${pos.symbol} x${pos.leverage}`);
    setCurrentView('DASHBOARD');
  };

  const handleClosePosition = (id: string) => {
    const pos = activePositions.find(p => p.id === id);
    if (!pos) return;
    
    // Remove from active
    setActivePositions(prev => prev.filter(p => p.id !== id));
    
    // Add to history
    setPnlHistory(prev => [{
      id: pos.id,
      symbol: pos.symbol,
      type: 'FUTURES',
      side: pos.side,
      closeTime: new Date().toISOString(),
      finalPnl: pos.pnl
    }, ...prev]);
    addLog('INFO', `Closed position ${pos.symbol}. PNL: ${pos.pnl.toFixed(2)}`);
  };

  const handleTerminateGrid = (id: string) => {
    const grid = activeGrids.find(g => g.id === id);
    if (!grid) return;

    // Remove from active
    setActiveGrids(prev => prev.filter(g => g.id !== id));

    // Simulate random profit for grid upon termination
    const simulatedProfit = (Math.random() * 20) - 5; 

    // Add to history
    setPnlHistory(prev => [{
      id: grid.id,
      symbol: grid.symbol,
      type: 'GRID',
      side: grid.direction,
      closeTime: new Date().toISOString(),
      finalPnl: simulatedProfit
    }, ...prev]);
    addLog('INFO', `Terminated Grid ${grid.symbol}. PNL: ${simulatedProfit.toFixed(2)}`);
  };

  const handleUrgentAlert = (alert: UrgentAlert) => {
    // Only add unique alerts or update timestamp
    setUrgentAlerts(prev => {
      const exists = prev.find(a => a.id === alert.id || a.title === alert.title);
      if (exists) return prev;
      return [...prev, alert];
    });

    // Auto dismiss after 10s
    setTimeout(() => {
      setUrgentAlerts(prev => prev.filter(a => a.id !== alert.id));
    }, 10000);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-trade-accent selection:text-white">
      {/* Mobile Menu Button - Z-Index Increased to 60 to be above Alerts */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 shadow-xl"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Z-Index Increased to 60 */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-[60] md:z-auto`}>
        <Sidebar 
          currentView={currentView} 
          onViewChange={(view) => {
            setCurrentView(view);
            setIsMobileMenuOpen(false);
          }} 
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#0b101a]">
        {/* View Router */}
        <div className="flex-1 overflow-hidden relative">
          {currentView === 'DASHBOARD' && (
             <Dashboard 
                whaleAlerts={whaleAlerts} 
                news={news} 
                activeGrids={activeGrids}
                activePositions={activePositions}
                pnlHistory={pnlHistory}
                onClosePosition={handleClosePosition}
                onTerminateGrid={handleTerminateGrid}
             />
          )}
          {currentView === 'SCANNER' && (
            <MarketScanner 
                coins={coins} 
                onSelectCoin={handleCoinSelect}
                onAiScan={(results) => {
                    addLog('SUCCESS', `AI Scan Completed. Found ${results.length} opportunities.`);
                    results.forEach((r: any) => addLog('INFO', `Opportunity: ${r.symbol} ${r.direction} (${r.potential}%)`));
                }} 
            />
          )}
          {currentView === 'TERMINAL' && selectedCoin && (
             <TradingTerminal 
               activeCoin={selectedCoin} 
               coins={coins}
               onCoinChange={setSelectedCoin}
               exchangeConnected={exchangeConfig.connected}
               onStartGrid={handleAddGrid}
               onOpenPosition={handleAddPosition}
               promptConfig={promptConfig}
             />
          )}
          {currentView === 'NEWS' && <NewsFeed news={news} />}
          {currentView === 'SETTINGS' && (
             <SettingsView 
                aiConfig={{
                   provider: aiProvider,
                   setProvider: setAiProvider,
                   interval: scanInterval,
                   setInterval: setScanInterval,
                   deepSeekKey: deepSeekKey,
                   setDeepSeekKey: setDeepSeekKey
                }}
                exchangeConfig={{
                   data: exchangeConfig,
                   setData: setExchangeConfig
                }}
                logs={logs}
                onClearLogs={() => setLogs([])}
                language={language}
                setLanguage={setLanguage}
                networkStatus={networkStatus}
                onAddLog={addLog}
             />
          )}
        </div>
      </main>

      {/* AI Advisor/Signal Panel (Right Side) */}
      <div className={`fixed inset-y-0 right-0 transform ${showAdvisor ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:relative md:block transition duration-200 ease-in-out z-30 w-full md:w-80 lg:w-96 shadow-2xl border-l border-slate-900`}>
         {selectedCoin && (
           <AIAdvisor 
             currentCoin={selectedCoin} 
             whaleAlerts={whaleAlerts}
             news={news}
             coins={coins}
             aiConfig={{
               provider: aiProvider,
               interval: scanInterval,
               deepSeekKey: deepSeekKey
             }}
             promptConfig={{
               data: promptConfig,
               setData: setPromptConfig
             }}
             onUrgentAlert={handleUrgentAlert}
             onAddLog={addLog}
           />
         )}
      </div>

      {/* Bottom Right Notification Container - Z-50 */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-80 pointer-events-none">
        {urgentAlerts.map(alert => (
          <div key={alert.id} className="pointer-events-auto bg-slate-900/95 border-l-4 border-red-500 rounded-lg p-4 shadow-2xl shadow-black/50 animate-in slide-in-from-right fade-in duration-300 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-white flex items-center">
                <Zap className="w-4 h-4 text-red-500 mr-2" />
                {alert.title}
              </h4>
              <button onClick={() => setUrgentAlerts(prev => prev.filter(a => a.id !== alert.id))} className="text-slate-500 hover:text-white">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 font-medium mb-2">{alert.message}</p>
            <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
               <span className="text-[10px] text-red-400 font-bold block mb-0.5">AI 建议:</span>
               <p className="text-[10px] text-slate-300 leading-tight">{alert.advice}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Advisor Toggle */}
      <button 
        onClick={() => setShowAdvisor(!showAdvisor)}
        className="md:hidden fixed bottom-6 right-6 z-40 p-4 bg-trade-accent rounded-full shadow-lg shadow-blue-500/30 text-white"
      >
        {showAdvisor ? <X size={24} /> : <Bell size={24} />}
      </button>

      {/* Overlay for mobile menu - Z-Index Increased to 50 */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;