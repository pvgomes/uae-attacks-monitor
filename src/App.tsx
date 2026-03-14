import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ShieldAlert, Target, Zap } from "lucide-react";

export default function App() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch("./data.json").then(res => res.json()).then(setData); }, []);
  const totals = data.reduce((acc, curr) => ({
    uav: acc.uav + curr.uav, cruise: acc.cruise + curr.cruise, ballistic: acc.ballistic + curr.ballistic
  }), { uav: 0, cruise: 0, ballistic: 0 });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-12 font-sans">
      <header className="mb-10"><h1 className="text-4xl font-black uppercase italic italic border-l-4 border-blue-600 pl-4">UAE Attacks Monitor</h1></header>
      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        <div className="bg-[#111] p-4 rounded border border-white/5"><Zap className="mx-auto text-blue-500 mb-2"/>{totals.uav} UAVs</div>
        <div className="bg-[#111] p-4 rounded border border-white/5"><Target className="mx-auto text-orange-500 mb-2"/>{totals.cruise} Cruise</div>
        <div className="bg-[#111] p-4 rounded border border-white/5"><ShieldAlert className="mx-auto text-red-500 mb-2"/>{totals.ballistic} Ballistic</div>
      </div>
      <div className="h-[400px] bg-[#111] p-6 rounded-xl border border-white/10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis dataKey="date" stroke="#444" fontSize={12} />
            <YAxis stroke="#444" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
            <Area type="monotone" dataKey="uav" name="UAVs" stroke="#3b82f6" fill="#3b82f633" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
