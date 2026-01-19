
import React, { useMemo } from 'react';
import { Flame } from 'lucide-react';
import { useWorkoutHistory } from '../../context/WorkoutHistoryContext';

const WeeklyStreak = () => {
    const { history } = useWorkoutHistory();

    const { streak, weekData } = useMemo(() => {
        // 1. Calculate Streak
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get unique workout dates (string YYYY-MM-DD)
        const workoutDates = new Set(history.map(w => new Date(w.date).toDateString()));

        // Check backwards from today
        let checkDate = new Date(today);

        // If today has a workout, streak starts at 1
        if (workoutDates.has(checkDate.toDateString())) {
            currentStreak++;
        }

        // Check yesterday and back
        checkDate.setDate(checkDate.getDate() - 1);
        while (workoutDates.has(checkDate.toDateString())) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        // 2. Calculate Weekly Activity
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        startOfWeek.setDate(diff);

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weekActivity = days.map((d, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            const isCompleted = workoutDates.has(date.toDateString());
            return {
                day: d,
                status: isCompleted
            };
        });

        return { streak: currentStreak, weekData: weekActivity };
    }, [history]);

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Weekly Streak</h3>
                <div className="flex items-center space-x-2 bg-[#22c55e]/10 px-3 py-1 rounded-full border border-[#22c55e]/20">
                    <Flame size={16} className="text-[#22c55e] fill-[#22c55e]" />
                    <span className="text-[#22c55e] font-bold text-sm">{streak} Day Streak</span>
                </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-3xl p-6 border border-white/5">
                <div className="flex justify-between items-center">
                    {weekData.map((day, index) => (
                        <div key={index} className="flex flex-col items-center space-y-3">
                            <span className={`text-xs font-bold ${day.status ? 'text-white' : 'text-gray-600'}`}>
                                {day.day}
                            </span>
                            <div className={`w-8 h-10 rounded-lg flex items-center justify-center transition-all ${day.status
                                ? 'bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                                : 'bg-white/5'
                                }`}>
                                {day.status && (
                                    <span className="text-black text-xs font-black">✓</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default WeeklyStreak;
