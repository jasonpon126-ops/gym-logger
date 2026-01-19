import React, { useState } from 'react';
import { ArrowLeft, Plus, Dumbbell, Trash2, CheckCircle2 } from 'lucide-react';
import ExerciseLibrary from '../library/ExerciseLibrary';
import { useRoutines } from '../../context/RoutineContext';

const NewRoutine = ({ onBack }) => {
    const [routineName, setRoutineName] = useState('');
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const { addRoutine } = useRoutines();

    // Mock data for "State B" demonstration as requested
    // To toggle to State A (Empty), initialize with empty array []
    const [addedExercises, setAddedExercises] = useState([
        { id: 'e1', name: 'Barbell Bench Press', iconType: 'chest', setCount: 3 },
        { id: 'e2', name: 'Incline Dumbbell Press', iconType: 'chest', setCount: 3 },
        { id: 'e3', name: 'Tricep Pushdown', iconType: 'tricep', setCount: 4 },
    ]);

    const removeExercise = (id) => {
        setAddedExercises(prev => prev.filter(ex => ex.id !== id));
    };

    const handleAddExercises = () => {
        setIsLibraryOpen(true);
    };

    const handleSelectExercise = (exercise) => {
        console.log('Selected exercise:', exercise);
        const newExercise = {
            id: Date.now().toString(), // Unique ID
            name: exercise.name,
            image: exercise.image || null,
            muscles: exercise.muscles || '',
            setCount: 3, // Default sets
        };

        setAddedExercises(prev => [...prev, newExercise]);
        setIsLibraryOpen(false);
    };

    const handleSave = () => {
        if (!routineName.trim()) {
            // Minimal validation feedback; could be improved with a toast
            alert("Please enter a routine name");
            return;
        }

        const newRoutine = {
            id: Date.now().toString(),
            name: routineName,
            duration: '45-60 min', // Placeholder or calculation
            focus: 'Custom',
            exercises: addedExercises
        };

        addRoutine(newRoutine);
        onBack(); // Navigate back to home
    };

    return (
        <div className="flex flex-col h-screen bg-[#1c1a15] text-gray-200 font-sans">
            {/* 1. Fixed Header */}
            <header className="flex items-center justify-between px-4 py-4 md:py-6 sticky top-0 bg-[#1c1a15] z-10">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-white tracking-wide">New Routine</h1>
                <div className="w-8" /> {/* Spacer for centering title */}
            </header>

            {/* Main Scrollable Content */}
            <main className="flex-1 overflow-y-auto px-6 pb-24">

                {/* 2. Routine Name Input */}
                <div className="mt-4 mb-10">
                    <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">
                        ROUTINE NAME
                    </label>
                    <input
                        type="text"
                        value={routineName}
                        onChange={(e) => setRoutineName(e.target.value)}
                        placeholder="e.g. Leg Day, Upper Body A"
                        className="w-full bg-transparent border-b border-gray-700 py-2 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#eab308] transition-colors"
                    />
                </div>

                {/* 3. Exercises Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">Exercises</h2>
                    <span className="text-sm text-gray-500 font-medium">
                        {addedExercises.length} added
                    </span>
                </div>

                {/* 4. Main Content Area (Conditional Rendering) */}
                {addedExercises.length === 0 ? (
                    /* State A: Empty State */
                    <div className="border-2 border-dashed border-[#eab308]/30 rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                        <div className="w-16 h-16 bg-[#eab308]/10 rounded-full flex items-center justify-center mb-4">
                            <Plus className="text-[#eab308]" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Build your workout</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-[200px]">
                            Add exercises to create your custom routine.
                        </p>
                        <button
                            onClick={handleAddExercises}
                            className="px-6 py-3 bg-[#3f3825] hover:bg-[#4d442b] text-[#eab308] text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                        >
                            Add Exercises
                        </button>
                    </div>
                ) : (
                    /* State B: Populated State */
                    <div className="space-y-3">
                        {addedExercises.map((exercise) => (
                            <div
                                key={exercise.id}
                                className="bg-[#24221d] rounded-xl p-4 flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icon Container */}
                                    <div className="w-12 h-12 bg-[#2f2d26] rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 overflow-hidden">
                                        {exercise.image ? (
                                            <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Dumbbell size={20} />
                                        )}
                                    </div>

                                    {/* Exercise Details */}
                                    <div>
                                        <h3 className="text-white font-bold text-sm md:text-base">
                                            {exercise.name}
                                        </h3>
                                        <p className="text-gray-500 text-xs font-medium mt-1">
                                            {exercise.setCount} sets
                                        </p>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeExercise(exercise.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}

                        {/* Add More Button for Populated State */}
                        <button
                            onClick={handleAddExercises}
                            className="w-full py-4 mt-2 border border-dashed border-gray-700 rounded-xl text-gray-500 font-medium hover:border-[#eab308] hover:text-[#eab308] transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Add more exercises
                        </button>
                    </div>
                )}
            </main>

            {/* 1. Fixed Footer */}
            <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1c1a15] to-[#1c1a15]/95 backdrop-blur-sm z-20">
                <button
                    onClick={handleSave}
                    className="w-full bg-[#eab308] hover:bg-[#ca9a04] text-black font-extrabold py-4 rounded-xl text-center active:scale-[0.98] transition-all"
                >
                    Save Routine
                </button>
            </footer>

            {/* Exercise Library Modal */}
            {isLibraryOpen && (
                <ExerciseLibrary
                    isOpen={isLibraryOpen}
                    onClose={() => setIsLibraryOpen(false)}
                    onSelectExercise={handleSelectExercise}
                />
            )}
        </div>
    );
};

export default NewRoutine;
