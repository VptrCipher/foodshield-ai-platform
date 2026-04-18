'use client';

import AppNavbar from '@/components/AppNavbar';
import AppFooter from '@/components/AppFooter';
import TiltCard from '@/components/TiltCard';
import FoodParticles from '@/components/FoodParticles';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import CustomSelect from '@/components/CustomSelect';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// Accurate Web Mercator projection positioning for the Yandex map overlay
const getMapPosition = (lat: number, lng: number) => {
  const W = 4096;
  const x = ((lng + 180) / 360) * W;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * W;
  const cx = ((79.0 + 180) / 360) * W;
  const cLat = (22.0 * Math.PI) / 180;
  const cy = ((1 - Math.log(Math.tan(cLat) + 1 / Math.cos(cLat)) / Math.PI) / 2) * W;
  return {
    left: `${((x - (cx - 300)) / 600) * 100}%`,
    top: `${((y - (cy - 225)) / 450) * 100}%`
  };
};

const initialRestaurants = [
  { name: "Joe's Diner", area: 'Koramangala, Bangalore', lat: 12.9352, lng: 77.6245, score: 92, risk: 'Critical', riskColor: '#ff4d4d', pathogens: ['Salmonella', 'E.coli'], lastInspection: '2024-10-12', grade: 'F' },
  { name: 'Paradise Biryani', area: 'MG Road, Bangalore', lat: 12.9716, lng: 77.5946, score: 34, risk: 'Low', riskColor: '#22c55e', pathogens: [], lastInspection: '2024-10-10', grade: 'A' },
  { name: 'Taco Bell Central', area: 'Indiranagar, Bangalore', lat: 12.9784, lng: 77.6408, score: 67, risk: 'Elevated', riskColor: '#ffd700', pathogens: ['Norovirus'], lastInspection: '2024-10-08', grade: 'C' },
  { name: 'Meghana Foods', area: 'Jayanagar, Bangalore', lat: 12.9279, lng: 77.5837, score: 21, risk: 'Safe', riskColor: '#22c55e', pathogens: [], lastInspection: '2024-10-11', grade: 'A+' },
  { name: 'Delhi Heights', area: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167, score: 85, risk: 'Critical', riskColor: '#ff4d4d', pathogens: ['E.coli'], lastInspection: '2024-10-14', grade: 'D' },
  { name: 'Bombay Canteen', area: 'Lower Parel, Mumbai', lat: 18.9942, lng: 72.8258, score: 45, risk: 'Low', riskColor: '#22c55e', pathogens: [], lastInspection: '2024-10-09', grade: 'B' },
  { name: 'Southern Spice', area: 'T Nagar, Chennai', lat: 13.0405, lng: 80.2337, score: 72, risk: 'Elevated', riskColor: '#ffd700', pathogens: ['Listeria'], lastInspection: '2024-10-13', grade: 'C' },
];

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(initialRestaurants[0]);
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filtered = restaurants.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.area.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCity = cityFilter === 'All Cities' ? true : r.area.includes(cityFilter);
    return matchSearch && matchCity;
  });

  const handleAnalyze = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    // Simulate an AI risk analysis sweep that slightly modifies scores
    setTimeout(() => {
      const updated = restaurants.map(r => {
        const adjustment = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const newScore = Math.max(0, Math.min(100, r.score + adjustment));
        let newRisk = r.risk;
        let newColor = r.riskColor;
        let newGrade = r.grade;
        if (newScore > 80) { newRisk = 'Critical'; newColor = '#ff4d4d'; newGrade = 'F'; }
        else if (newScore > 60) { newRisk = 'Elevated'; newColor = '#ffd700'; newGrade = 'C'; }
        else { newRisk = 'Low'; newColor = '#22c55e'; newGrade = 'A'; }
        return { ...r, score: newScore, risk: newRisk, riskColor: newColor, grade: newGrade };
      });
      setRestaurants(updated);
      setSelectedRestaurant(updated.find(r => r.name === selectedRestaurant.name) || updated[0]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <>
      <AppNavbar />
      <FoodParticles count={12} />

      <motion.main
        initial={{ opacity: 0, rotateY: -5, scale: 0.96 }}
        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: 1200 }}
        className="pt-24 pb-12 px-8 max-w-[1600px] mx-auto min-h-screen relative z-10"
      >
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-10"
        >
          <motion.span variants={fadeUp} custom={0} className="font-mono text-[10px] uppercase tracking-widest text-red-500 mb-1 block">WMF Risk Analysis Engine</motion.span>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl font-black tracking-tighter mb-2">
            Restaurant <span className="text-shimmer">Safety Portal</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-stone-400 text-sm font-mono uppercase tracking-widest">Search any restaurant • Get location • Analyze food safety risk</motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 relative z-50"
        >
          <div className="glass-panel-lg p-3 rounded-2xl flex gap-3 items-center">
            <div className="flex items-center gap-3 flex-1 bg-[var(--surface-container-lowest)] rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-stone-500">search</span>
              <input
                className="w-full bg-transparent border-none text-[var(--on-surface)] placeholder:text-stone-600 focus:outline-none text-sm"
                placeholder="Search restaurant by name or area (e.g., Koramangala, MG Road)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 bg-[var(--surface-container-lowest)] rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-stone-500">location_on</span>
              <div className="w-32 z-20">
                <CustomSelect
                  options={['All Cities', 'Bangalore', 'Chennai', 'Delhi', 'Mumbai']}
                  value={cityFilter}
                  onChange={setCityFilter}
                  className="w-full"
                />
              </div>
            </div>
            <motion.button
              onClick={handleAnalyze}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3.5 rounded-xl font-bold shadow-[0_0_20px_rgba(255,77,77,0.3)] hover:shadow-[0_0_40px_rgba(255,77,77,0.5)] transition-shadow whitespace-nowrap text-sm flex items-center justify-center ${isAnalyzing ? 'bg-stone-800 text-stone-400' : 'bg-gradient-to-r from-red-500 to-red-600 text-white'}`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined align-middle mr-1 text-lg">radar</span>
                  Analyze Risk
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Restaurant List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-widest text-stone-500 mb-3 px-2">
              {filtered.length} restaurants found
            </h3>
            {filtered.map((r, idx) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ x: 6 }}
                onClick={() => setSelectedRestaurant(r)}
                className={`glass-panel p-4 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${
                  selectedRestaurant.name === r.name ? 'border-red-500/40 bg-red-500/5' : 'hover:border-white/10'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-container-low)] flex items-center justify-center text-xl">
                  🍽️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[var(--on-surface)] text-sm truncate">{r.name}</h4>
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color: r.riskColor, background: `color-mix(in srgb, ${r.riskColor} 15%, transparent)` }}>
                      {r.risk}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                    {r.area}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black font-mono" style={{ color: r.riskColor }}>{r.score}%</div>
                  <div className="text-[9px] text-stone-600 font-mono">RISK</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8"
          >
            <TiltCard tiltAmount={2}>
              <div className="glass-panel-lg rounded-2xl overflow-hidden">
                {/* Map placeholder with restaurant markers */}
                <div className="h-[400px] bg-[var(--surface-container-low)] relative overflow-hidden">
                  {/* Dark themed map background */}
                  <div className="absolute inset-0 bg-[#0a0606]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Map of India"
                      className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                      src="https://static-maps.yandex.ru/1.x/?l=map&ll=79.0,22.0&z=4&size=600,450&lang=en_US"
                    />
                  </div>
                  {/* Markers */}
                  {filtered.map((r, i) => (
                    <motion.div
                      key={r.name}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.2, type: 'spring' }}
                      className="absolute cursor-pointer group/marker z-10 -translate-x-1/2 -translate-y-1/2"
                      style={getMapPosition(r.lat, r.lng)}
                      onClick={() => setSelectedRestaurant(r)}
                    >
                      <div className={`w-4 h-4 rounded-full shadow-[0_0_15px_4px] animate-pulse`} style={{ backgroundColor: r.riskColor, boxShadow: `0 0 15px 4px ${r.riskColor}40` }} />
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1a0606]/95 backdrop-blur-xl px-3 py-1.5 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-20">
                        <span className="text-[10px] font-mono font-bold text-[var(--on-surface)]">{r.name}</span>
                        <br />
                        <span className="text-[9px] font-mono" style={{ color: r.riskColor }}>{r.risk} • {r.score}%</span>
                      </div>
                    </motion.div>
                  ))}
                  {/* Map controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
                    <button className="glass-panel w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-white transition-colors text-sm font-bold">+</button>
                    <button className="glass-panel w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-white transition-colors text-sm font-bold">−</button>
                  </div>
                  <div className="absolute bottom-4 left-4 glass-panel px-3 py-1.5 rounded-lg z-10">
                    <span className="font-mono text-[10px] text-stone-400">📍 {selectedRestaurant.area}</span>
                  </div>
                </div>

                {/* WMF Analysis Panel */}
                <div className="p-8 border-t border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--on-surface)] flex items-center gap-3">
                        {selectedRestaurant.name}
                        <span className="font-mono text-xs font-bold px-3 py-1 rounded-full" style={{ color: selectedRestaurant.riskColor, background: `color-mix(in srgb, ${selectedRestaurant.riskColor} 15%, transparent)` }}>
                          {selectedRestaurant.risk}
                        </span>
                      </h3>
                      <p className="text-stone-500 text-sm flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {selectedRestaurant.area}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center relative">
                        <svg className="-rotate-90 w-full h-full" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" fill="none" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                          <motion.circle
                            cx="50" cy="50" fill="none" r="42"
                            stroke={selectedRestaurant.riskColor}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={264}
                            initial={{ strokeDashoffset: 264 }}
                            animate={{ strokeDashoffset: 264 - (264 * selectedRestaurant.score / 100) }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            style={{ filter: `drop-shadow(0 0 8px ${selectedRestaurant.riskColor})` }}
                          />
                        </svg>
                        <span className="absolute text-xl font-black font-mono" style={{ color: selectedRestaurant.riskColor }}>{selectedRestaurant.score}</span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 mt-1 block">WMF SCORE</span>
                    </div>
                  </div>

                  {/* WMF Analysis Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[var(--surface-container-low)] p-4 rounded-xl">
                      <p className="text-[10px] font-mono text-stone-500 uppercase mb-1">Safety Grade</p>
                      <p className="text-3xl font-black" style={{ color: selectedRestaurant.riskColor }}>{selectedRestaurant.grade}</p>
                    </div>
                    <div className="bg-[var(--surface-container-low)] p-4 rounded-xl">
                      <p className="text-[10px] font-mono text-stone-500 uppercase mb-1">Detected Pathogens</p>
                      <p className="text-lg font-bold text-[var(--on-surface)]">
                        {selectedRestaurant.pathogens.length > 0
                          ? selectedRestaurant.pathogens.join(', ')
                          : 'None detected'}
                      </p>
                    </div>
                    <div className="bg-[var(--surface-container-low)] p-4 rounded-xl">
                      <p className="text-[10px] font-mono text-stone-500 uppercase mb-1">Last Inspection</p>
                      <p className="text-lg font-bold text-[var(--on-surface)]">{selectedRestaurant.lastInspection}</p>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <h4 className="font-mono text-xs uppercase tracking-widest text-stone-500 mb-4">WMF Risk Factor Breakdown</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Hygiene & Sanitation Score', pct: selectedRestaurant.score > 50 ? 85 : 25, color: selectedRestaurant.score > 50 ? '#ff4d4d' : '#22c55e' },
                      { label: 'Supply Chain Integrity', pct: selectedRestaurant.score > 50 ? 72 : 15, color: selectedRestaurant.score > 50 ? '#f5a623' : '#22c55e' },
                      { label: 'Environmental Compliance', pct: selectedRestaurant.score > 50 ? 90 : 10, color: selectedRestaurant.score > 50 ? '#ff4d4d' : '#22c55e' },
                    ].map((factor) => (
                      <div key={factor.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-stone-400">{factor.label}</span>
                          <span className="font-mono font-bold" style={{ color: factor.color }}>{factor.pct}%</span>
                        </div>
                        <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${factor.pct}%` }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full rounded-full"
                            style={{ background: factor.color, boxShadow: `0 0 8px ${factor.color}50` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </motion.main>
      <AppFooter />
    </>
  );
}
