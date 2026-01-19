import React, { useState, useEffect } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { ArrowLeft, Plus, Check, Trash2, GripVertical, Dumbbell } from 'lucide-react';
import { useRoutines } from '../../context/RoutineContext';

const RoutineItem = ({ routine, onDelete }) => {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={routine}
            id={routine.id}
            dragListener={false}
            dragControls={controls}
            className="mb-3 relative"
        >
            <div className="bg-[#27272a] rounded-2xl p-4 flex items-center justify-between group active:scale-[1.02] transition-transform shadow-lg border border-white/5">
                <div className="flex items-center gap-4 flex-1">
                    {/* Drag Handle */}
                    <div
                        onPointerDown={(e) => controls.start(e)}
                        className="touch-none cursor-grab p-2 -ml-2 text-gray-600 hover:text-white transition-colors"
                    >
                        <GripVertical size={20} />
                    </div>

                    {/* Icon Placeholder */}
                    <div className="w-10 h-10 bg-[#3f3f46] rounded-lg flex items-center justify-center text-gray-500">
                        <Dumbbell size={18} />
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-wide">{routine.name}</h3>
                        <p className="text-gray-500 text-xs font-medium">
                            {routine.exercises?.length || 0} Exercises
                        </p>
                    </div>
                </div>

                {/* Delete Button */}
                <button
                    onClick={() => onDelete(routine.id, routine.name)}
                    className="p-2 text-gray-600 hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </Reorder.Item>
    );
};

const ManageRoutines = ({ onBack, onAdd }) => {
    const { routines, deleteRoutine, reorderRoutines } = useRoutines();

    // Local state for drag and drop to be responsive
    const [localRoutines, setLocalRoutines] = useState(routines);

    useEffect(() => {
        setLocalRoutines(routines);
    }, [routines]);

    const handleReorder = (newOrder) => {
        setLocalRoutines(newOrder);
    };

    // When drag ends/component unmounts or on "Done", we could save.
    // But for instant feel, we might want to save on every reorder or on unmount.
    // Framer Motion Reorder updates state on every move. 
    // We should sync to context.
    // To avoid spamming context/firebase, we can just sync when user clicks "Done" or on unmount?
    // Or just sync immediately for simplicity first.
    // Actually, Reorder component expects onReorder to update state provided in 'values'.
    // If we update context immediately, it might cause flicker due to async firestore.
    // Better to keep local state here and sync on effect change or "Done".

    const handleDone = () => {
        // Check if order changed?
        // Simple: just save current local order to context
        reorderRoutines(localRoutines);
        onBack();
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
            deleteRoutine(id);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#18181b] text-white font-sans">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-6 sticky top-0 bg-[#18181b] z-10 border-b border-white/5">
                <span className="text-lg font-bold tracking-tight">Manage Routines</span>
                <button
                    onClick={handleDone} // Save and Exit
                    className="bg-[#ccff00] hover:bg-[#b3e600] text-black px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                >
                    Done
                </button>
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-6 text-center">
                    Drag to Reorder • Tap to Delete
                </p>

                <Reorder.Group
                    axis="y"
                    values={localRoutines}
                    onReorder={handleReorder}
                    className="space-y-3 pb-24"
                >
                    {localRoutines.map((routine) => (
                        <RoutineItem
                            key={routine.id} // Reorder needs consistent key
                            routine={routine}
                            onDelete={handleDelete}
                        />
                    ))}
                </Reorder.Group>
            </main>

            {/* Footer Add Button */}
            <div className="p-6 fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#18181b] to-transparent">
                <button
                    onClick={onAdd}
                    className="w-full py-4 border border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-2 text-gray-400 font-bold hover:text-white hover:border-white/40 transition-colors active:scale-[0.98]"
                >
                    <Plus size={20} />
                    Add New Routine
                </button>
            </div>
        </div>
    );
};

export default ManageRoutines;
