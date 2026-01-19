import React from 'react';
import { Clock, Trophy, Dumbbell, ChevronRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { LAST_WORKOUT } from '../../data/mockData';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import { displayWeight } from '../../utils/unitConversions';

import { useWorkoutHistory } from '../../context/WorkoutHistoryContext';

const LastWorkout = () => {
    const { unitSystem } = useUserPreferences();
    const { history } = useWorkoutHistory();

    const lastWorkout = history[0]; // History is ordered newest first

    if (!lastWorkout) {
        return (
            <div className="mb-24">
                <h3 className="text-lg font-bold text-white mb-4">Last Workout</h3>
                <div className="bg-[#1e1e1e] rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 text-gray-500">
                        <Dumbbell size={32} />
                    </div>
                    <h4 className="text-white font-bold mb-2">No workouts yet</h4>
                    <p className="text-gray-500 text-sm mb-4">Complete your first routine to see your stats here!</p>
                </div>
            </div>
        );
    }

    // Calculate total volume or use stored metrics
    const volumeKg = lastWorkout.exercises.reduce((acc, ex) => {
        return acc + ex.sets.reduce((sAcc, set) => sAcc + (set.kg * set.reps), 0);
    }, 0);

    // Simple conversion if needed, but keeping it raw for display logic below
    // Note: If you want perfect unit handling, you should store the unit in the workout or normalize to kg always.

    // Format date string "Tuesday, 10:30 AM"
    const dateObj = new Date(lastWorkout.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: 'numeric' });

    return (
        <div className="mb-24">
            <h3 className="text-lg font-bold text-white mb-4">Last Workout</h3>

            <div className="bg-[#1e1e1e] rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/5 rounded-full blur-3xl -mr-10 -mt-10" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">{lastWorkout.title}</h2>
                            <p className="text-sm text-gray-500 font-medium">{dateStr}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#22c55e]/10 flex items-center justify-center">
                            <CheckCircle2 className="text-[#22c55e]" size={20} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">TIME</div>
                            <div className="text-white font-bold">{lastWorkout.duration}</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">VOLUME</div>
                            <div className="text-white font-bold">
                                {displayWeight(volumeKg, unitSystem).toLocaleString()} {unitSystem.toLowerCase()}
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/5 w-full mb-4" />

                    <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                            {lastWorkout.exercises.slice(0, 4).map((ex, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#1e1e1e] flex items-center justify-center text-[10px] font-bold text-gray-300 overflow-hidden">
                                    {ex.name[0]}
                                </div>
                            ))}
                        </div>

                        <button className="text-xs font-bold text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LastWorkout;
