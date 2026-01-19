
import React, { useState, useRef } from 'react';
import { ArrowRight, ChevronRight, Dumbbell } from 'lucide-react';
import { useRoutines } from '../../context/RoutineContext';

const StartWorkoutCarousel = ({ onStartRoutine, onViewAll }) => {
    const { routines } = useRoutines();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { scrollLeft, clientWidth } = scrollRef.current;
        // Calculate the centered index
        const index = Math.round(scrollLeft / clientWidth);

        if (index !== activeIndex && index >= 0 && index < routines.length) {
            setActiveIndex(index);
        }
    };

    return (
        <div className="mb-8">
            {/* Header with Title and View All */}
            <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-sm font-bold text-gray-400 tracking-wider uppercase">Your Routines</span>
                <button
                    onClick={onViewAll}
                    className="text-xs font-bold text-[#22c55e] flex items-center gap-1 hover:opacity-80 transition-colors"
                >
                    VIEW ALL <ChevronRight size={14} />
                </button>
            </div>

            {/* Scroll container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-hide"
            >
                {routines.map((routine, index) => (
                    <div
                        key={routine.id}
                        className="flex-shrink-0 w-full snap-center relative overflow-hidden rounded-[2rem] bg-[#22c55e] text-black h-40 flex flex-col justify-between p-6 group"
                    >
                        {/* Background Element */}
                        <Dumbbell className="absolute -right-8 -bottom-8 text-black/10 w-48 h-48 rotate-[-15deg]" strokeWidth={1} />

                        <div className="relative z-10">
                            <div className="flex items-center space-x-2 mb-1 opacity-70">
                                <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                    {routine.focus}
                                </span>
                                <span className="text-xs font-bold">• {routine.duration}</span>
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tight leading-none mt-1">
                                {routine.name}
                            </h2>
                        </div>

                        <div className="relative z-10 flex justify-between items-end">
                            <span className="font-bold opacity-60 text-xs">READY TO START?</span>
                            <button
                                onClick={() => onStartRoutine(routine)}
                                className="w-10 h-10 rounded-full bg-black text-[#22c55e] flex items-center justify-center group-active:scale-95 transition-transform"
                            >
                                <ArrowRight size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center space-x-2">
                {routines.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-[#22c55e]' : 'w-1.5 bg-gray-700'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default StartWorkoutCarousel;
