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
