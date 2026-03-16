import React, { useEffect, useState } from "react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ShieldAlert, Target, Zap, AlertCircle, Phone, ExternalLink, Twitter, Github, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchAttackData } from "./services/dataService";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [isLogScale, setIsLogScale] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    fetchAttackData()
      .then(setData)
      .catch(error => {
        console.error("Failed to fetch attack data:", error);
        setData([]);
      })
      .finally(() => setIsLoading(false));
  }, []);
  const totals = data.reduce((acc, curr) => ({
    uav: acc.uav + curr.uav, cruise: acc.cruise + curr.cruise, ballistic: acc.ballistic + curr.ballistic
  }), { uav: 0, cruise: 0, ballistic: 0 });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading attack data...</div>
      </div>
    );
  }

  // Calculate percentage decrease from first day to last day
  const percentageDecrease = data.length > 1 ? (() => {
    const firstDay = data[0];
    const lastDay = data[data.length - 1];
    const firstTotal = (firstDay?.uav || 0) + (firstDay?.cruise || 0) + (firstDay?.ballistic || 0);
    const lastTotal = (lastDay?.uav || 0) + (lastDay?.cruise || 0) + (lastDay?.ballistic || 0);
    return firstTotal > 0 ? Math.round(((firstTotal - lastTotal) / firstTotal) * 100) : 0;
  })() : 0;

  // Transform data for log scale - replace zeros with 0.1 so they can be displayed
  const chartData = isLogScale 
    ? data.map(d => ({
        ...d,
        uav: d.uav || 0.1,
        cruise: d.cruise || 0.1,
        ballistic: d.ballistic || 0.1
      }))
    : data;

  // Calculate trend line for total attacks (simple moving average)
  const dataWithTrend = data.map((d, i) => {
    const window = 3; // 3-day moving average
    const start = Math.max(0, i - Math.floor(window / 2));
    const end = Math.min(data.length, i + Math.floor(window / 2) + 1);
    const subset = data.slice(start, end);
    const avgTotal = subset.reduce((sum, item) => sum + item.uav + item.cruise + item.ballistic, 0) / subset.length;
    return {
      ...d,
      trend: Math.round(avgTotal)
    };
  });

  return (
    <>
      <section className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8 text-center" aria-label="Attack statistics summary">
        <div className="bg-[#111] p-3 md:p-4 rounded border border-white/5 text-sm md:text-base" aria-label="UAV drone attacks">
          <Zap className="mx-auto text-blue-500 mb-1 md:mb-2 w-6 h-6 md:w-8 md:h-8" aria-hidden="true"/>
          <span className="font-bold block text-lg md:text-xl">{totals.uav}</span>
          <span className="text-xs md:text-sm">UAV Drones</span>
        </div>
        <div className="bg-[#111] p-3 md:p-4 rounded border border-white/5 text-sm md:text-base" aria-label="Cruise missile attacks">
          <Target className="mx-auto text-orange-500 mb-1 md:mb-2 w-6 h-6 md:w-8 md:h-8" aria-hidden="true"/>
          <span className="font-bold block text-lg md:text-xl">{totals.cruise}</span>
          <span className="text-xs md:text-sm">Cruise Missiles</span>
        </div>
        <div className="bg-[#111] p-3 md:p-4 rounded border border-white/5 text-sm md:text-base" aria-label="Ballistic missile attacks">
          <ShieldAlert className="mx-auto text-red-500 mb-1 md:mb-2 w-6 h-6 md:w-8 md:h-8" aria-hidden="true"/>
          <span className="font-bold block text-lg md:text-xl">{totals.ballistic}</span>
          <span className="text-xs md:text-sm">Ballistic Missiles</span>
        </div>
      </section>
      <div className="bg-[#111] p-4 md:p-6 rounded-xl border border-white/10 mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold">Attack Trends</h2>
          <button
            onClick={() => setIsLogScale(!isLogScale)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm font-medium transition-colors ${
              isLogScale ? 'bg-blue-600 text-white' : 'bg-[#222] text-gray-400 hover:text-white'
            }`}
          >
            Log Scale
          </button>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {isLogScale ? (
              <LineChart data={dataWithTrend.map(d => ({
                ...d,
                uav: d.uav || 0.1,
                cruise: d.cruise || 0.1,
                ballistic: d.ballistic || 0.1,
                trend: d.trend || 0.1
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#444" fontSize={12} />
                <YAxis stroke="#444" fontSize={12} scale="log" domain={[0.1, 'dataMax']} />
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
                <Legend />
                <Line type="monotone" dataKey="uav" name="UAVs" stroke="#3b82f6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="cruise" name="Cruise" stroke="#f97316" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="ballistic" name="Ballistic" stroke="#ef4444" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="trend" name="Trend" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            ) : (
              <AreaChart data={dataWithTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#444" fontSize={12} />
                <YAxis stroke="#444" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
                <Legend />
                <Area type="monotone" dataKey="uav" name="UAVs" stroke="#3b82f6" fill="#3b82f633" strokeWidth={3} />
                <Area type="monotone" dataKey="cruise" name="Cruise" stroke="#f97316" fill="#f9731633" strokeWidth={3} />
                <Area type="monotone" dataKey="ballistic" name="Ballistic" stroke="#ef4444" fill="#ef444433" strokeWidth={3} />
                <Line type="monotone" dataKey="trend" name="Trend (3-day avg)" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Percentage decrease indicator */}
        {percentageDecrease > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-green-400 bg-green-400/10 py-2 px-4 rounded-lg">
            <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-base md:text-lg font-semibold">
              {percentageDecrease}% decrease from the first day
            </span>
          </div>
        )}
      </div>

      {/* Detailed Data Table */}
      <div className="bg-[#111] p-4 md:p-6 rounded-xl border border-white/10 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-bold mb-4">Detailed Attack Data</h2>
        
        {(() => {
          // Sort data in descending order (most recent first)
          const sortedData = [...data].reverse();
          
          // Calculate pagination
          const totalPages = Math.ceil(sortedData.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedData = sortedData.slice(startIndex, endIndex);
          
          return (
            <>
              {/* Table for desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-3 px-2 text-gray-400 font-medium">Date</th>
                      <th className="pb-3 px-2 text-gray-400 font-medium text-right">UAV Drones</th>
                      <th className="pb-3 px-2 text-gray-400 font-medium text-right">Cruise Missiles</th>
                      <th className="pb-3 px-2 text-gray-400 font-medium text-right">Ballistic Missiles</th>
                      <th className="pb-3 px-2 text-gray-400 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, index) => {
                      const total = item.uav + item.cruise + item.ballistic;
                      return (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-2">{item.date}</td>
                          <td className="py-3 px-2 text-right text-blue-400">{item.uav}</td>
                          <td className="py-3 px-2 text-right text-orange-400">{item.cruise}</td>
                          <td className="py-3 px-2 text-right text-red-400">{item.ballistic}</td>
                          <td className="py-3 px-2 text-right font-semibold">{total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Cards for mobile */}
              <div className="md:hidden space-y-3">
                {paginatedData.map((item, index) => {
                  const total = item.uav + item.cruise + item.ballistic;
                  return (
                    <div key={index} className="bg-[#222] p-4 rounded-lg border border-white/10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">{item.date}</span>
                        <span className="text-sm text-gray-400">Total: <span className="font-semibold text-white">{total}</span></span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <div className="text-blue-400 font-semibold">{item.uav}</div>
                          <div className="text-xs text-gray-500">UAV</div>
                        </div>
                        <div className="text-center">
                          <div className="text-orange-400 font-semibold">{item.cruise}</div>
                          <div className="text-xs text-gray-500">Cruise</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-400 font-semibold">{item.ballistic}</div>
                          <div className="text-xs text-gray-500">Ballistic</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      currentPage === 1 
                        ? 'bg-[#222] text-gray-600 cursor-not-allowed' 
                        : 'bg-[#222] text-gray-400 hover:text-white hover:bg-[#333]'
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="hidden sm:inline text-gray-400">Page</span>
                    <span className="font-medium">{currentPage}</span>
                    <span className="text-gray-400">of</span>
                    <span className="font-medium">{totalPages}</span>
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      currentPage === totalPages 
                        ? 'bg-[#222] text-gray-600 cursor-not-allowed' 
                        : 'bg-[#222] text-gray-400 hover:text-white hover:bg-[#333]'
                    }`}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Information Section */}
      <div className="bg-[#111] p-4 md:p-6 rounded-xl border border-white/10 mb-6 md:mb-8">
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
              <a href="https://www.instagram.com/modgovae/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <ExternalLink size={16} />
                Instagram Ministry of Defence - UAE
              </a>
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
              <a href="https://hormuzstraitmonitor.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <ExternalLink size={16} />
                Strait of Hormuz Monitor - real-time tracking of maritime security incidents in the region
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
    </>
  );
}