import React from 'react';
const NewsFeed: React.FC<any> = ({ news }) => (
  <div className="p-6 space-y-4">
     <h1 className="text-2xl font-bold text-white mb-4">情报中心</h1>
     {news.map((n:any)=>(<div key={n.id} className="bg-slate-900 p-4 rounded border border-slate-800"><h3 className="font-bold text-slate-200">{n.title}</h3><p className="text-sm text-slate-400">{n.summary}</p></div>))}
  </div>
);
export default NewsFeed;
