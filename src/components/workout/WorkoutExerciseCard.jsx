import React from 'react';
import { MoreHorizontal, Dumbbell, Check, X } from 'lucide-react';

const WorkoutExerciseCard = ({ exercise, unitSystem, onSetUpdate, onSetComplete, onAddSet, onDeleteSet }) => {
    // Determine the index of the first incomplete set to mark as "Active"
    const activeSetIndex = exercise.sets.findIndex(s => !s.completed);

    return (
        <div className="bg-[#121212] rounded-xl p-4 mb-4 border border-white/5">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e] overflow-hidden">
                        {exercise.image ? (
                            <img
                                src={exercise.image}
                                alt={exercise.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Dumbbell size={18} />
                        )}
                    </div>
                    <h3 className="text-white font-bold text-lg">{exercise.name}</h3>
                </div>
                <button className="text-gray-400">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[0.5fr_1fr_2fr_2fr_1fr] gap-2 mb-2 px-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase text-center">#</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase text-center">PREV</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase text-center">{unitSystem}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase text-center">REPS</span>
                <div className="flex justify-center">
                    <Check size={14} className="text-gray-500" />
                </div>
            </div>

            {/* Set Rows */}
            <div className="space-y-3">
                {exercise.sets.map((set, index) => {
                    const isCompleted = set.completed; // Use 'completed' to match ActiveRoutineSession state
                    const isActive = index === activeSetIndex;
                    const isFuture = !isCompleted && index > activeSetIndex && activeSetIndex !== -1;

                    return (
                        <div
                            key={set.id}
                            className={`grid grid-cols-[0.5fr_1fr_2fr_2fr_1fr] gap-2 items-center per-row transition-opacity duration-300 ${isFuture ? 'opacity-40' : 'opacity-100'}`}
                        >
                            {/* Set Number */}
                            <div className="flex justify-center relative group">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isCompleted ? 'bg-[#22c55e] text-black' :
                                    isActive ? 'bg-zinc-800 text-white' : 'bg-zinc-800 text-gray-500'}`}>
                                    {index + 1}
                                </div>
                                {/* Delete Button (Visible on Hover or always if needed) */}
                                <button
                                    onClick={() => onDeleteSet(exercise.id, set.id)}
                                    className="absolute -left-6 top-1/2 -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Previous Best (Compact) */}
                            <div className="flex justify-center">
                                <span className="text-[10px] text-gray-600 font-mono">
                                    {set.previousBest || '-'}
                                </span>
                            </div>

                            {/* Weight Input */}
                            <div className="flex flex-col items-center">
                                <div className={`w-full rounded-lg h-10 flex items-center justify-center transition-colors ${isCompleted ? 'text-[#22c55e]' : 'bg-zinc-800'}`}>
                                    {isCompleted ? (
                                        <span className="text-sm font-bold underline decoration-[#22c55e] underline-offset-4">{set.kg || set.weight}</span>
                                    ) : (
                                        <input
                                            type="number"
                                            placeholder={set.targetWeight || '-'}
                                            value={set.kg || set.weight || ''}
                                            onChange={(e) => onSetUpdate(exercise.id, set.id, { kg: e.target.value })}
                                            disabled={!isActive}
                                            className="w-full h-full bg-transparent text-center text-white font-bold focus:outline-none focus:ring-1 focus:ring-[#22c55e] rounded-lg disabled:opacity-50"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Reps Input */}
                            <div className="flex flex-col items-center">
                                <div className={`w-full rounded-lg h-10 flex items-center justify-center transition-colors ${isCompleted ? 'text-[#22c55e]' : 'bg-zinc-800'}`}>
                                    {isCompleted ? (
                                        <span className="text-sm font-bold underline decoration-[#22c55e] underline-offset-4">{set.reps}</span>
                                    ) : (
                                        <input
                                            type="number"
                                            placeholder={set.targetReps || '-'}
                                            value={set.reps || ''}
                                            onChange={(e) => onSetUpdate(exercise.id, set.id, { reps: e.target.value })}
                                            disabled={!isActive}
                                            className="w-full h-full bg-transparent text-center text-white font-bold focus:outline-none focus:ring-1 focus:ring-[#22c55e] rounded-lg disabled:opacity-50"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Checkbox Action */}
                            <div className="flex justify-center">
                                <div
                                    onClick={() => !isFuture && onSetComplete(exercise.id, set.id, { kg: set.kg, reps: set.reps })}
                                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${isCompleted ? 'bg-[#22c55e]' : 'border-2 border-zinc-700 bg-transparent hover:border-zinc-500'
                                        }`}>
                                    {isCompleted && <Check size={18} className="text-black stroke-[3]" />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Card Footer */}
            <button
                onClick={() => onAddSet(exercise.id)}
                className="w-full mt-4 py-3 bg-[#1e3a29] text-[#22c55e] text-xs font-bold rounded-lg hover:bg-[#254632] transition-colors flex items-center justify-center gap-2 uppercase tracking-wide"
            >
                + Add Set
            </button>
        </div>
    );
};

export default WorkoutExerciseCard;
