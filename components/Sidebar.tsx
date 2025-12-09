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
