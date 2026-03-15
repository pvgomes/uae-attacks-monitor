import React, { useState } from "react";
import { Tv, Radio } from "lucide-react";

interface NewsChannel {
  name: string;
  embedId: string;
  country?: string;
}

const newsChannels: NewsChannel[] = [
  { name: "Bloomberg", embedId: "iEpJwprxDdk", country: "US" },
  { name: "Sky News", embedId: "YDvsBbKfLPA", country: "UK" },
  { name: "Euronews", embedId: "pykpO5kQJ98", country: "EU" },
  { name: "DW", embedId: "LuKwFajn37U", country: "DE" },
  { name: "CNBC", embedId: "9NyxcX3rhQs", country: "US" },
  { name: "CNN", embedId: "awA4cInzpx8", country: "US" },
  { name: "France 24", embedId: "Ap-UM1O9RBU", country: "FR" },
  { name: "Al Arabiya", embedId: "rXnG4eiVVdM", country: "UAE" },
  { name: "Al Jazeera", embedId: "gCNeDWCI0vo", country: "QA" },
  { name: "India Today", embedId: "cTZLVaugpL0", country: "IN" },
  { name: "CNN Brazil", embedId: "VYSx7Qxr3nI", country: "BR" },
  { name: "TVP WORLD", embedId: "m4mVcUReR6Y", country: "PL" },
];

export default function News() {
  const [selectedChannel, setSelectedChannel] = useState<NewsChannel>(newsChannels[0]);

  return (
    <div>
      {/* Channel Selector */}
      <div className="bg-[#111] p-4 rounded-xl border border-white/10 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Tv className="text-blue-500" size={20} />
          <h2 className="text-lg font-bold">Live News Channels</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {newsChannels.map((channel) => (
            <button
              key={channel.name}
              onClick={() => setSelectedChannel(channel)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                selectedChannel.name === channel.name
                  ? "bg-red-600 text-white"
                  : "bg-[#222] text-gray-400 hover:text-white hover:bg-[#333]"
              }`}
            >
              {channel.name}
              {channel.country && (
                <span className="ml-2 text-xs opacity-75">{channel.country}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Video Player */}
      <div className="bg-[#111] p-4 rounded-xl border border-white/10 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Radio className="text-red-500 animate-pulse" size={20} />
          {selectedChannel.name} - Live
        </h3>
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${selectedChannel.embedId}?autoplay=1&mute=1`}
            title={`${selectedChannel.name} Live Stream`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Future News Feed */}
      <div className="bg-[#111] p-6 rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Latest News Updates</h3>
        <div className="text-gray-400 text-center py-12">
          <p className="text-sm">News feed coming soon...</p>
          <p className="text-xs mt-2">This section will display curated news updates related to UAE security and regional developments.</p>
        </div>
      </div>
    </div>
  );
}