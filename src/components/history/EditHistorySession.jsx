import React, { useState } from 'react';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorkoutHistory } from '../../context/WorkoutHistoryContext';

const EditHistorySession = ({ sessionData, onBack, onSave }) => {
    // Initialize state with session data or mock structure if null
    const [session, setSession] = useState({
        ...sessionData,
        date: sessionData?.date || new Date().toISOString(),
        exercises: sessionData?.exercises || []
    });

    const handleDeleteSet = (exerciseId, setId) => {
        setSession(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex => {
                if (ex.id === exerciseId) {
                    return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
                }
                return ex;
            })
        }));
    };

    const handleAddSet = (exerciseId) => {
        setSession(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex => {
                if (ex.id === exerciseId) {
                    const newSet = {
                        id: Date.now(),
                        kg: '',
                        reps: '',
                        completed: true
                    };
                    return { ...ex, sets: [...ex.sets, newSet] };
                }
                return ex;
            })
        }));
    };

    const handleUpdateSet = (exerciseId, setId, field, value) => {
        setSession(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex => {
                if (ex.id === exerciseId) {
                    return {
                        ...ex,
                        sets: ex.sets.map(s =>
                            s.id === setId ? { ...s, [field]: value } : s
                        )
                    };
                }
                return ex;
            })
        }));
    };

    const formattedDate = new Date(session.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const { updateWorkout } = useWorkoutHistory();

    const handleSave = async () => {
        const success = await updateWorkout(session);
        if (success) {
            onSave();
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-32">
            {/* 1. Header */}
            <header className="px-4 py-6 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10 border-b border-white/5">
                <button
                    onClick={onBack}
                    className="flex items-center text-purple-500 font-medium hover:opacity-80 transition-opacity"
                >
                    <ArrowLeft size={20} className="mr-1" />
                    History
                </button>
                <h1 className="text-white font-bold text-lg">{formattedDate}</h1>
                <button
                    onClick={handleSave}
                    className="text-purple-500 font-bold hover:opacity-80 transition-opacity"
                >
                    Save
                </button>
            </header>

            {/* 2. Main Content */}
            <main className="px-4 py-6 space-y-6">
                {session.exercises.map((exercise) => (
                    <div key={exercise.id} className="bg-[#18181b] rounded-2xl p-4 border border-white/5">
                        {/* Exercise Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                                    EXERCISE
                                </span>
                                <h3 className="text-xl font-bold text-purple-500 leading-tight">
                                    {exercise.name}
                                </h3>
                            </div>
                            {/* Image Placeholder or Thumbnail */}
                            <div className="w-12 h-8 bg-gradient-to-br from-purple-500/20 to-purple-900/20 rounded-md border border-purple-500/20" />
                        </div>

                        {/* Sets Header */}
                        <div className="grid grid-cols-[1fr_2fr_2fr_1fr] gap-4 mb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center px-2">
                            <span>SET</span>
                            <span>WEIGHT (KG)</span>
                            <span>REPS</span>
                            <span>ACTION</span>
                        </div>

                        {/* Sets Rows */}
                        <div className="space-y-3">
                            {exercise.sets.map((set, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={set.id}
                                    className="grid grid-cols-[1fr_2fr_2fr_1fr] gap-4 items-center bg-[#27272a] rounded-xl p-2"
                                >
                                    {/* Set Number */}
                                    <div className="text-center font-bold text-gray-500">
                                        {index + 1}
                                    </div>

                                    {/* Weight Input */}
                                    <div className="flex justify-center">
                                        <input
                                            type="number"
                                            value={set.kg}
                                            onChange={(e) => handleUpdateSet(exercise.id, set.id, 'kg', e.target.value)}
                                            className="w-16 bg-transparent text-center font-bold text-white text-lg focus:outline-none focus:border-b-2 focus:border-purple-500 transition-colors placeholder-gray-600"
                                            placeholder="0"
                                        />
                                    </div>

                                    {/* Reps Input */}
                                    <div className="flex justify-center">
                                        <input
                                            type="number"
                                            value={set.reps}
                                            onChange={(e) => handleUpdateSet(exercise.id, set.id, 'reps', e.target.value)}
                                            className="w-16 bg-transparent text-center font-bold text-white text-lg focus:outline-none focus:border-b-2 focus:border-purple-500 transition-colors placeholder-gray-600"
                                            placeholder="0"
                                        />
                                    </div>

                                    {/* Delete Action */}
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => handleDeleteSet(exercise.id, set.id)}
                                            className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Add Set Button */}
                        <button
                            onClick={() => handleAddSet(exercise.id)}
                            className="w-full mt-4 py-3 rounded-xl border border-dashed border-purple-500/30 text-purple-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-500/5 transition-colors"
                        >
                            <Plus size={16} />
                            Add Set
                        </button>
                    </div>
                ))}
            </main>

            {/* 3. Footer */}
            <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent z-20">
                <button
                    onClick={handleSave}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold text-lg shadow-lg shadow-purple-900/40 active:scale-[0.98] transition-transform"
                >
                    Update History
                </button>
            </footer>
        </div>
    );
};

export default EditHistorySession;
