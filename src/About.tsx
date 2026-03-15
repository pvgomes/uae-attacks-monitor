import React from "react";
import { Info, Users } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#111] p-6 md:p-8 rounded-xl border border-white/10 mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Info className="text-blue-500" size={24} />
          <h2 className="text-2xl font-bold">What is the UAE Defense Monitor?</h2>
        </div>
        <p className="text-gray-300 leading-relaxed">
          The UAE Defense Monitor is a free, real-time dashboard that tracks ongoing attacks on the UAE from Iran. 
          The UAE is not part of the war, but Iran wrongly accuses the UAE of allowing the USA to attack Iran from its territory. 
          According to Iran, this is why they are attacking the UAE.
        </p>
        <p className="text-gray-300 leading-relaxed mt-4">
          This website aims to remain neutral - though we believe the UAE and other GCC countries have always focused on 
          diplomacy over war. Our primary focus is presenting data. Based on official reports, our goal is to make this 
          information easily visible to everyone.
        </p>
      </div>

      <div className="bg-[#111] p-6 md:p-8 rounded-xl border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Users className="text-blue-500" size={24} />
          <h2 className="text-2xl font-bold">Who built it?</h2>
        </div>
        <p className="text-gray-300 leading-relaxed">
          A free community willing to help people stay informed. Everyone can contribute via GitHub.
        </p>
      </div>
    </div>
  );
}