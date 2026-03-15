import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Github, Calendar } from "lucide-react";
import Dashboard from "./Dashboard";
import About from "./About";
import News from "./News";
import { fetchLatestAttackData } from "./services/dataService";

function Layout({ children }: { children: React.ReactNode }) {
  const [lastUpdate, setLastUpdate] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchLatestAttackData()
      .then(lastEntry => {
        if (lastEntry) {
          // Add current year to the date
          setLastUpdate(`${lastEntry.date}, 2024`);
        }
      })
      .catch(error => {
        console.error("Failed to fetch last update:", error);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8 lg:p-12 font-sans">
      <header className="mb-6 md:mb-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase italic border-l-4 border-blue-600 pl-4">
              🇦🇪 UAE Defense Monitor
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-400 pl-4">
              UAE successfully intercepts virtually all incoming attacks. This website aims to show you the current data of attacks on UAE, based on official public statements
            </p>
            <p className="sr-only">
              Dubai & Abu Dhabi Security Dashboard. Real-time monitoring of UAV drone attacks, cruise missiles, and ballistic missile interceptions in United Arab Emirates
            </p>
          </div>
          {lastUpdate && (
            <div className="text-gray-400 text-sm flex items-center gap-2">
              <Calendar size={16} />
              <span>Updated {lastUpdate}</span>
            </div>
          )}
        </div>
        <nav className="mt-6 pl-4">
          <div className="flex gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/" ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/about" ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              About
            </Link>
            <Link 
              to="/news" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/news" ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              News
            </Link>
          </div>
        </nav>
      </header>
      <div className="flex-1">
        {children}
      </div>
      
      {/* GitHub Contribution Link */}
      <footer className="mt-12 text-center">
        <a 
          href="https://github.com/pvgomes/uae-attacks-monitor" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#111] border border-white/10 rounded-lg hover:bg-[#222] transition-colors"
        >
          <Github size={20} />
          <span>Contribute on GitHub</span>
        </a>
        <p className="mt-4 text-sm text-gray-500">
          Help improve this project by contributing data updates or code enhancements
        </p>
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/news" element={<Layout><News /></Layout>} />
      </Routes>
    </Router>
  );
}

