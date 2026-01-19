import React from 'react';
import { X, Trophy, PartyPopper, CheckCircle2 } from 'lucide-react';
import { useUserPreferences } from '../../context/UserPreferencesContext';

const SessionSummary = ({ onClose, onDone, data }) => {
    const { unitSystem } = useUserPreferences();

    // Safe fallback if data is missing (shouldn't happen in normal flow)
    const stats = data || {
        time: '-',
        volume: '-',
        moves: '-',
        records: []
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans relative overflow-x-hidden flex flex-col">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#ec4899]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-20 pointer-events-none" style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)' }}></div>


            {/* 1. Header */}
            <header className="px-6 py-6 flex items-center justify-between relative z-10">
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-[#18181b] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
                <h1 className="text-lg font-semibold tracking-wide">Session Summary</h1>
                <div className="w-10" /> {/* Spacer */}
            </header>

            <main className="flex-1 px-6 relative z-10 pb-32">
                {/* 2. Hero Section */}
                <div className="flex flex-col items-center mt-4 mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#be185d] to-[#ec4899] mb-6 shadow-lg shadow-pink-900/40">
                        <PartyPopper size={14} className="text-white" />
                        <span className="text-[10px] font-bold tracking-widest text-white uppercase">GREAT SESSION</span>
                    </div>

                    <div className="text-center space-y-0">
                        <h2 className="text-5xl italic font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] via-[#d946ef] to-[#a855f7] leading-[0.9] tracking-tighter drop-shadow-sm">
                            WORKOUT
                        </h2>
                        <h2 className="text-5xl italic font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] via-[#d946ef] to-[#3b82f6] leading-[0.9] tracking-tighter drop-shadow-sm">
                            COMPLETE!
                        </h2>
                    </div>
                </div>

                {/* 3. Stats Summary Card */}
                <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 flex justify-between items-center mb-8 shadow-2xl">
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">TIME</span>
                        <span className="text-3xl font-bold text-[#ec4899]">{stats.time}</span>
                    </div>

                    <div className="w-px h-10 bg-white/10" /> {/* Divider */}

                    <div className="flex flex-col items-center flex-1">
                        <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">VOLUME</span>
                        <span className="text-3xl font-bold text-white">{stats.volume}</span>
                        <span className="text-[10px] text-gray-600 font-bold -mt-1">{unitSystem.toLowerCase()}</span>
                    </div>

                    <div className="w-px h-10 bg-white/10" /> {/* Divider */}

                    <div className="flex flex-col items-center flex-1">
                        <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">MOVES</span>
                        <span className="text-3xl font-bold text-white">{stats.moves}</span>
                    </div>
                </div>

                {/* 4. New Records Section */}
                {stats.records.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Trophy className="text-[#eab308]" size={20} />
                                <h3 className="text-lg font-bold text-white">New Records</h3>
                            </div>
                            <span className="px-3 py-1 bg-[#422006] text-[#eab308] text-[10px] font-bold rounded-lg border border-[#eab308]/20">
                                +{stats.records.length} Achievement
                            </span>
                        </div>

                        <div className="space-y-3">
                            {stats.records.map((record) => (
                                <div key={record.id} className="bg-[#121212] border border-white/5 rounded-2xl p-4 flex justify-between items-center group hover:border-white/10 transition-colors">
                                    <div>
                                        <h4 className="font-bold text-sm text-white mb-1">{record.exercise}</h4>
                                        <p className="text-xs text-gray-500 font-medium">Previous Max: {record.previousMax}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-[#eab308] tabular-nums">
                                            {record.newMax} <span className="text-xs font-bold text-[#eab308]/80">{unitSystem}</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-[#22c55e] mt-0.5">
                                            {record.improvement} {record.improvement !== 'New' ? unitSystem : ''}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* 5. Footer Action */}
            <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent z-20">
                <button
                    onClick={onDone}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ec4899] to-[#be185d] text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 active:scale-[0.98] transition-transform"
                >
                    Done
                    <CheckCircle2 size={20} strokeWidth={3} />
                </button>
            </footer>
        </div>
    );
};

export default SessionSummary;
