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
