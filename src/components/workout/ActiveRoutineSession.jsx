import React, { useState, useEffect } from 'react';
import { ChevronLeft, MoreVertical, Timer, Check, Play, Pause, FastForward, Plus, Minus, X } from 'lucide-react';
import WorkoutExerciseCard from './WorkoutExerciseCard';
import { useRoutines } from '../../context/RoutineContext';
import { useWorkoutHistory } from '../../context/WorkoutHistoryContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';

const ActiveRoutineSession = ({ onFinish, onBack }) => {
    const { activeRoutine } = useRoutines();
    const { addWorkout, history } = useWorkoutHistory();
    const { defaultRest, restTimerEnabled, unitSystem } = useUserPreferences();

    // Helper to find the last performance of an exercise
    const getLastPerformance = (exerciseName) => {
        if (!history || history.length === 0) return null;

        const targetName = exerciseName.trim().toLowerCase();

        // Find the most recent workout that contained this exercise
        for (const workout of history) {
            const exercise = workout.exercises?.find(ex =>
                ex.name.trim().toLowerCase() === targetName
            );
            if (exercise && exercise.sets && exercise.sets.some(s => s.completed)) {
                return exercise.sets;
            }
        }
        return null;
    };

    // Fallback if accessed directly without starting a routine
    if (!activeRoutine) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-500 bg-[#1c1a15]">
                <p>No active routine selected.</p>
                <button onClick={onBack} className="mt-4 text-[#eab308] hover:underline">Go Back</button>
            </div>
        );
    }

    const [duration, setDuration] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Initialize exercises from the routine data
    const [exercises, setExercises] = useState((activeRoutine.exercises || []).map(ex => {
        const lastSets = getLastPerformance(ex.name);

        return {
            ...ex,
            // Ensure sets are initialized with status if they aren't already
            sets: Array(ex.setCount || 3).fill(null).map((_, i) => {
                const prevSet = lastSets ? lastSets[i] : null;
                const weight = prevSet?.kg ?? prevSet?.weight;
                const reps = prevSet?.reps;

                // Only show if both weight and reps exist and reps > 0
                const prevBest = (weight !== undefined && reps !== undefined && reps > 0)
                    ? `${weight} x ${reps}`
                    : '-';

                return {
                    id: i + 1,
                    kg: '',
                    reps: '',
                    completed: false,
                    previousBest: prevBest
                };
            })
        };
    }));

    const [activeContext, setActiveContext] = useState({ exerciseId: exercises[0]?.id, setId: 1 });

    const storageKey = `active_session_${activeRoutine.id}`;

    // Load saved session on mount
    useEffect(() => {
        const savedSession = localStorage.getItem(storageKey);
        if (savedSession) {
            try {
                const { exercises: savedExercises, duration: savedDuration } = JSON.parse(savedSession);
                if (savedExercises) setExercises(savedExercises);
                if (savedDuration) setDuration(savedDuration);
            } catch (e) {
                console.error("Failed to recover session", e);
            }
        }
    }, [storageKey]);

    // Reactive update for Previous Performance when history loads
    useEffect(() => {
        if (!history || history.length === 0) return;

        setExercises(prevExercises => prevExercises.map(ex => {
            const lastSets = getLastPerformance(ex.name);
            if (!lastSets) return ex;

            const updatedSets = ex.sets.map((set, i) => {
                const prevSet = lastSets[i];
                const weight = prevSet?.kg ?? prevSet?.weight;
                const reps = prevSet?.reps;

                // Only show if both weight and reps exist and reps > 0
                const prevBest = (weight !== undefined && reps !== undefined && reps > 0)
                    ? `${weight} x ${reps}`
                    : '-';

                // Only update if it wasn't already set or was just a placeholder
                if (set.previousBest === '-' || !set.previousBest) {
                    return { ...set, previousBest: prevBest };
                }
                return set;
            });

            return { ...ex, sets: updatedSets };
        }));
    }, [history]);

    // Save session on change
    useEffect(() => {
        const sessionData = {
            exercises,
            duration
        };
        localStorage.setItem(storageKey, JSON.stringify(sessionData));
    }, [exercises, duration, storageKey]);

    // Rest Timer State
    const [isResting, setIsResting] = useState(false);
    const [restTime, setRestTime] = useState(60);
    const [isSaving, setIsSaving] = useState(false);

    // Main Timer Logic
    useEffect(() => {
        let interval;
        if (!isPaused) {
            interval = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPaused]);

    // Rest Timer Logic
    useEffect(() => {
        let interval;
        if (isResting && restTime > 0) {
            interval = setInterval(() => {
                setRestTime(prev => prev - 1);
            }, 1000);
        } else if (restTime === 0) {
            setIsResting(false);
        }
        return () => clearInterval(interval);
    }, [isResting, restTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const formatRestTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSetComplete = (exerciseId, setId, data) => {
        console.log(`Set completed: Ex ${exerciseId}, Set ${setId}`, data);

        setExercises(prev => prev.map(ex => {
            if (ex.id === exerciseId) {
                const newSets = ex.sets.map(set =>
                    set.id === setId ? { ...set, ...data, completed: true } : set
                );
                return { ...ex, sets: newSets };
            }
            return ex;
        }));

        // Trigger Rest Timer
        if (restTimerEnabled) {
            setIsResting(true);
            setRestTime(defaultRest);
        }
    };

    const handleSetUpdate = (exerciseId, setId, data) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id === exerciseId) {
                const newSets = ex.sets.map(set =>
                    set.id === setId ? { ...set, ...data } : set
                );
                return { ...ex, sets: newSets };
            }
            return ex;
        }));
    };

    const handleExit = () => {
        if (window.confirm("Exit workout? Current progress will be lost.")) {
            localStorage.removeItem(storageKey);
            onBack();
        }
    };

    const handleAddSet = (exerciseId) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id === exerciseId) {
                const newSet = {
                    id: Date.now(), // Unique ID
                    kg: '',
                    reps: '',
                    completed: false
                };
                return { ...ex, sets: [...ex.sets, newSet] };
            }
            return ex;
        }));
    };

    const handleDeleteSet = (exerciseId, setId) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id === exerciseId) {
                const newSets = ex.sets.filter(s => s.id !== setId);
                return { ...ex, sets: newSets };
            }
            return ex;
        }));
    };

    const handleFinishWorkout = async () => {
        // 1. Filter out exercises that have NO completed sets
        const performedExercises = exercises.filter(ex =>
            ex.sets.some(s => s.completed)
        );

        if (performedExercises.length === 0) {
            alert("No exercises performed! Workout discarded.");
            onFinish(null); // Pass null or empty object if discarded
            return;
        }

        // Calculate Stats for Summary
        let totalVolume = 0;
        let distinctMoves = performedExercises.length; // Distinct exercises
        let newRecords = [];

        // 2. Construct workout object & Calculate Stats
        const workoutExercises = performedExercises.map(ex => {
            // Find stats for this exercise
            const lastSets = getLastPerformance(ex.name); // Returns sets array or null
            // Calculate max from previous history
            let previousMax = 0;
            if (lastSets) {
                // Find max weight in previous sets
                const maxSet = lastSets.reduce((max, set) => {
                    const w = parseFloat(set.kg || set.weight || 0);
                    return w > max ? w : max;
                }, 0);
                previousMax = maxSet;
            }

            // Current Session Max
            let currentMax = 0;

            const finalSets = ex.sets.map(s => {
                const weight = parseFloat(s.kg || 0);
                const reps = parseFloat(s.reps || 0);

                if (s.completed && weight > 0 && reps > 0) {
                    totalVolume += weight * reps; // Add to volume
                    if (weight > currentMax) currentMax = weight;
                }

                return {
                    id: s.id,
                    kg: s.kg || 0,
                    reps: s.reps || 0,
                    completed: s.completed
                };
            });

            // Check for PR
            if (currentMax > previousMax && previousMax > 0) {
                newRecords.push({
                    id: ex.id,
                    exercise: ex.name,
                    previousMax: `${previousMax} ${unitSystem}`,
                    newMax: `${currentMax}`,
                    improvement: `+${currentMax - previousMax}`
                });
            } else if (currentMax > 0 && previousMax === 0) {
                // First time performing or no history? 
                // Optionally count as PR or just baseline. Let's count as baseline for now (no record)
                // Or treat as record:
                newRecords.push({
                    id: ex.id,
                    exercise: ex.name,
                    previousMax: 'First',
                    newMax: `${currentMax}`,
                    improvement: 'New'
                });
            }

            return {
                id: ex.id,
                name: ex.name,
                image: ex.image || null,
                sets: finalSets
            };
        });

        const workoutData = {
            routineId: activeRoutine.id,
            title: activeRoutine.name,
            startTime: new Date(Date.now() - duration * 1000).toISOString(),
            endTime: new Date().toISOString(),
            duration: formatTime(duration),
            difficulty: 'Medium',
            exercises: workoutExercises
        };

        // 3. Save to history
        setIsSaving(true);
        console.log("Saving workout...", workoutData);
        let success = false;
        try {
            success = await addWorkout(workoutData);
        } catch (err) {
            console.error("Unexpected error calling addWorkout", err);
            alert("Unexpected error: " + err.message);
        }
        setIsSaving(false);

        if (success) {
            // Clear local storage
            localStorage.removeItem(storageKey);

            // Prepare Summary Data
            const summaryData = {
                time: formatTime(duration), // "MM:SS" -> maybe convert to "Xm" for display if needed
                volume: (totalVolume > 1000) ? `${(totalVolume / 1000).toFixed(1)}k` : `${totalVolume}`,
                moves: distinctMoves.toString(),
                records: newRecords
            };

            // 4. Proceed to finish with data
            onFinish(summaryData);
        } else {
            console.warn("Save returned false.");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#1c1a15] text-white font-sans relative">
            {/* 1. Header */}
            <header className="flex items-center justify-between px-4 py-4 md:py-6 bg-[#1c1a15] border-b border-white/5 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={handleExit} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold leading-tight">{activeRoutine.name}</h1>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#eab308]">
                            <Timer size={12} />
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
                <button className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
                    <MoreVertical size={24} />
                </button>
            </header>

            {/* 2. Scrollable Exercise List */}
            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-32">
                {exercises.map((exercise, index) => (
                    <WorkoutExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        unitSystem={unitSystem}
                        isActive={activeContext.exerciseId === exercise.id}
                        onSetComplete={handleSetComplete}
                        onSetUpdate={handleSetUpdate}
                        onAddSet={handleAddSet}
                        onDeleteSet={handleDeleteSet}
                    />
                ))}
            </main>

            {/* 3. Floating Footer */}
            <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1c1a15] to-[#1c1a15]/95 backdrop-blur-sm z-20">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="flex-1 py-4 bg-[#2c2c2e] rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-300 active:scale-[0.98] transition-transform"
                    >
                        {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                        {isPaused ? "Resume" : "Pause"}
                    </button>
                    <button className="w-14 h-14 bg-[#2c2c2e] rounded-2xl flex items-center justify-center text-gray-400">
                        <FastForward size={20} />
                    </button>
                </div>

                <button
                    onClick={handleFinishWorkout}
                    disabled={isSaving}
                    className={`w-full py-4 bg-[#eab308] hover:bg-[#ca9a04] text-black font-extrabold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
                >
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            SAVING...
                        </>
                    ) : (
                        <>
                            <Check size={20} strokeWidth={3} />
                            FINISH WORKOUT
                        </>
                    )}
                </button>
            </footer>

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

export default ActiveRoutineSession;
