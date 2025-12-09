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
