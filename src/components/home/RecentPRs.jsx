import React from 'react';
import { ArrowUpRight, TrendingUp, ChevronRight } from 'lucide-react';
import { RECENT_PRS } from '../../data/mockData';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import { displayWeight } from '../../utils/unitConversions';

import { useWorkoutHistory } from '../../context/WorkoutHistoryContext';

const RecentPRs = () => {
    const { unitSystem } = useUserPreferences();
    const { history } = useWorkoutHistory();

    // Calculate "PRs" from history (Simplification: Just show max weight from recent sessions for now)
    // A real PR system would track "all-time best" vs "current". 
    // Here we'll just extract the heaviest lift for unique exercises from the last 5 workouts.

    const recentLifts = [];
    const processedExercises = new Set();

    // Iterate through history to find distinct exercises
    history.forEach(workout => {
        workout.exercises.forEach(ex => {
            if (!processedExercises.has(ex.name)) {
                // Find max weight in this session for this exercise
                const maxWeight = Math.max(...ex.sets.map(s => parseFloat(s.kg) || 0));
                if (maxWeight > 0) {
                    recentLifts.push({
                        id: ex.id + workout.startTime,
                        exercise: ex.name,
                        weight: maxWeight,
                        // date: workout.startTime
                    });
                    processedExercises.add(ex.name);
                }
            }
        });
    });

    const displayLifts = recentLifts.slice(0, 5); // Show top 5 recent

    if (displayLifts.length === 0) {
        return (
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Recent Lifts</h3>
                </div>
                <div className="bg-[#1e1e1e] rounded-2xl p-6 border border-white/5 text-center">
                    <p className="text-gray-500 text-sm">Start a workout to track your personal records.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Recent Lifts</h3>
                <a href="#" className="text-xs font-bold text-[#22c55e] flex items-center hover:opacity-80">
                    VIEW ALL <ChevronRight size={14} />
                </a>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                {displayLifts.map((pr) => {
                    return (
                        <div
                            key={pr.id}
                            className="flex-shrink-0 w-36 bg-[#1e1e1e] p-4 rounded-2xl border border-white/5 flex flex-col justify-between h-40"
                        >
                            <div className="flex justify-between items-start gap-2 min-h-[2.5rem]">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider line-clamp-2 leading-tight">
                                    {pr.exercise}
                                </span>
                                <TrendingUp size={14} className="text-[#22c55e] flex-shrink-0" />
                            </div>

                            <div>
                                <div className="text-2xl font-black text-white">
                                    {displayWeight(pr.weight, unitSystem)}
                                    <span className="text-sm ml-1 font-bold text-gray-500">{unitSystem.toLowerCase()}</span>
                                </div>
                                <div className="text-xs font-bold text-[#22c55e] bg-[#22c55e]/10 inline-block px-1.5 py-0.5 rounded mt-1">
                                    Best Set
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentPRs;
