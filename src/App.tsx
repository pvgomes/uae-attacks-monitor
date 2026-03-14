import React, { useEffect, useState } from "react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ShieldAlert, Target, Zap, AlertCircle, Phone, ExternalLink, Twitter } from "lucide-react";

export default function App() {
  const [data, setData] = useState([]);
  const [isLogScale, setIsLogScale] = useState(false);
  useEffect(() => { fetch("./data.json").then(res => res.json()).then(setData); }, []);
  const totals = data.reduce((acc, curr) => ({
    uav: acc.uav + curr.uav, cruise: acc.cruise + curr.cruise, ballistic: acc.ballistic + curr.ballistic
  }), { uav: 0, cruise: 0, ballistic: 0 });

  // Transform data for log scale - replace zeros with 0.1 so they can be displayed
  const chartData = isLogScale 
    ? data.map(d => ({
        ...d,
        uav: d.uav || 0.1,
        cruise: d.cruise || 0.1,
        ballistic: d.ballistic || 0.1
      }))
    : data;

  return (
    <main className="min-h-screen bg-[#050505] text-white p-12 font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-black uppercase italic italic border-l-4 border-blue-600 pl-4">
          UAE Attacks Monitor - Dubai & Abu Dhabi Security Dashboard
        </h1>
        <p className="sr-only">
          Real-time monitoring of UAV drone attacks, cruise missiles, and ballistic missile interceptions in United Arab Emirates
        </p>
      </header>
      <section className="grid grid-cols-3 gap-4 mb-8 text-center" aria-label="Attack statistics summary">
        <div className="bg-[#111] p-4 rounded border border-white/5" aria-label="UAV drone attacks">
          <Zap className="mx-auto text-blue-500 mb-2" aria-hidden="true"/>
          <span className="font-bold">{totals.uav}</span> UAV Drones
        </div>
        <div className="bg-[#111] p-4 rounded border border-white/5" aria-label="Cruise missile attacks">
          <Target className="mx-auto text-orange-500 mb-2" aria-hidden="true"/>
          <span className="font-bold">{totals.cruise}</span> Cruise Missiles
        </div>
        <div className="bg-[#111] p-4 rounded border border-white/5" aria-label="Ballistic missile attacks">
          <ShieldAlert className="mx-auto text-red-500 mb-2" aria-hidden="true"/>
          <span className="font-bold">{totals.ballistic}</span> Ballistic Missiles
        </div>
      </section>
      <div className="bg-[#111] p-6 rounded-xl border border-white/10 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Attack Trends</h2>
          <button
            onClick={() => setIsLogScale(!isLogScale)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              isLogScale ? 'bg-blue-600 text-white' : 'bg-[#222] text-gray-400 hover:text-white'
            }`}
          >
            Log Scale
          </button>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {isLogScale ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#444" fontSize={12} />
                <YAxis stroke="#444" fontSize={12} scale="log" domain={[0.1, 'dataMax']} />
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
                <Legend />
                <Line type="monotone" dataKey="uav" name="UAVs" stroke="#3b82f6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="cruise" name="Cruise" stroke="#f97316" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="ballistic" name="Ballistic" stroke="#ef4444" strokeWidth={3} dot={false} />
              </LineChart>
            ) : (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#444" fontSize={12} />
                <YAxis stroke="#444" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
                <Legend />
                <Area type="monotone" dataKey="uav" name="UAVs" stroke="#3b82f6" fill="#3b82f633" strokeWidth={3} />
                <Area type="monotone" dataKey="cruise" name="Cruise" stroke="#f97316" fill="#f9731633" strokeWidth={3} />
                <Area type="monotone" dataKey="ballistic" name="Ballistic" stroke="#ef4444" fill="#ef444433" strokeWidth={3} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-[#111] p-6 rounded-xl border border-white/10 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-yellow-500" size={20} />
          <h2 className="text-lg font-bold">Important Information</h2>
        </div>
        <p className="text-gray-400 mb-6">
          This is an <span className="text-yellow-500 font-medium">unofficial</span> website. All data is manually transcribed from official public statements by the UAE Ministry of Interior (MOI) and other government sources.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Official Sources */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-500 mb-3">Official Sources</h3>
            <div className="space-y-2">
              <a href="https://ncema.gov.ae" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <ExternalLink size={16} />
                National Emergency Crisis and Disaster Management Authority
              </a>
              <a href="https://wam.ae" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <ExternalLink size={16} />
                Emirates News Agency (WAM)
              </a>
            </div>

            <h3 className="text-sm font-semibold uppercase text-gray-500 mt-6 mb-3">Updates</h3>
            <div className="space-y-2">
              <a href="https://x.com/ADMediaOffice" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <Twitter size={16} />
                Abu Dhabi Media Office
              </a>
              <a href="https://x.com/modgovae" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <Twitter size={16} />
                Ministry of Defence
              </a>
              <a href="https://x.com/NCEMAUAE" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <Twitter size={16} />
                National Emergency Crisis and Disaster Management Authority
              </a>
            </div>
          </div>

          {/* Emergency Numbers */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-500 mb-3">Emergency Numbers in UAE</h3>
            <div className="space-y-2 font-mono">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-red-500" />
                <span className="text-white">999</span>
                <span className="text-gray-400">Police</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-red-500" />
                <span className="text-white">998</span>
                <span className="text-gray-400">Ambulance</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-red-500" />
                <span className="text-white">997</span>
                <span className="text-gray-400">Fire Department (Civil Defence)</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-red-500" />
                <span className="text-white">996</span>
                <span className="text-gray-400">Coast Guard</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-red-500" />
                <span className="text-white">995</span>
                <span className="text-gray-400">Find and Rescue</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-red-500" />
                <span className="text-white">992</span>
                <span className="text-gray-400">Water Failure</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-red-500" />
                <span className="text-white">991</span>
                <span className="text-gray-400">Electricity Failure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
