import React, { useState, useEffect } from 'react';
import { Flag, Plus, X, Minus } from 'lucide-react';
import WorkoutExerciseCard from './WorkoutExerciseCard';
import { useUserPreferences } from '../../context/UserPreferencesContext';

// Mock Data
const INITIAL_EXERCISES = [
    {
        id: 'ex1',
        name: 'Barbell Squat',
        sets: [
            { id: 's1', setNumber: 1, weight: 225, reps: 5, isCompleted: true, previousBest: '225 x 5' },
            { id: 's2', setNumber: 2, weight: 225, reps: 5, isCompleted: false, previousBest: null },
            { id: 's3', setNumber: 3, weight: 225, reps: null, isCompleted: false, previousBest: null },
        ]
    },
    {
        id: 'ex2',
        name: 'Bench Press',
        sets: [
            { id: 's4', setNumber: 1, weight: 135, reps: 8, isCompleted: false, previousBest: '135 x 8' },
        ]
    }
];

const ActiveWorkout = () => {
    const { unitSystem } = useUserPreferences();
    const [duration, setDuration] = useState(2712); // Starting at 00:45:12 for demo matching image
    const [isResting, setIsResting] = useState(true); // Default active for demo
    const [restTime, setRestTime] = useState(45); // 45 seconds default rest

    // Main Workout Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Rest Countdown Timer
    useEffect(() => {
        let interval;
        if (isResting && restTime > 0) {
            interval = setInterval(() => {
                setRestTime(prev => prev - 1);
            }, 1000);
        } else if (restTime === 0) {
            setIsResting(false); // Auto close when done? Or stay at 00:00?
        }
        return () => clearInterval(interval);
    }, [isResting, restTime]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const formatRestTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-screen bg-[#09090b] text-white font-sans relative">
            {/* 1. Fixed Header */}
            <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-[#09090b] z-20 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" /> {/* Minimal timer icon proxy */}
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">DURATION</span>
                    </div>
                    <div className="text-3xl font-black tabular-nums tracking-tight">
                        {formatTime(duration)}
                    </div>
                </div>
                <button className="bg-[#1e3a29] hover:bg-[#254632] text-[#22c55e] px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors">
                    <Flag size={16} fill="currentColor" />
                    Finish
                </button>
            </header>

            {/* 2. Main Content */}
            <main className="flex-1 overflow-y-auto px-4 py-6 pb-40">
                {INITIAL_EXERCISES.map(exercise => (
                    <WorkoutExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        unitSystem={unitSystem}
                    />
                ))}

                {/* 3. Footer Section - Add Exercise */}
                <button className="w-full border-2 border-dashed border-[#22c55e]/30 rounded-xl py-6 flex items-center justify-center text-[#22c55e] font-bold hover:bg-[#22c55e]/5 transition-colors group">
                    <Plus size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                    Add Exercise
                </button>
            </main>

            {/* Floating Rest Timer Overlay */}
            {isResting && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#18181b] border border-white/10 rounded-2xl p-2 shadow-2xl z-30 flex items-center justify-between pl-4 pr-2">
                    <button
                        onClick={() => setIsResting(false)}
                        className="p-2 bg-zinc-800 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">REST</span>
                        <span className="text-2xl font-black text-[#22c55e] tabular-nums leading-none">
                            {formatRestTime(restTime)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setRestTime(prev => Math.max(0, prev - 10))}
                            className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold hover:bg-zinc-700 active:scale-95 transition-all"
                        >
                            <Minus size={16} />
                        </button>
                        <button
                            onClick={() => setRestTime(prev => prev + 10)}
                            className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-black font-bold hover:bg-[#22c55e]/90 active:scale-95 transition-all"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveWorkout;
