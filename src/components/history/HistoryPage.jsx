import React, { useState } from 'react';
import { ArrowLeft, Calendar, Edit2, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { MOCK_HISTORY_DATA } from '../../data/mockData';
import CalendarComponent from './CalendarComponent';
import { slideVariants, swipeTransition } from '../../utils/animations';
import { useWorkoutHistory } from '../../context/WorkoutHistoryContext';

const HistoryPage = ({ onBack, onEdit }) => {

    // State for current view (defaults to current date)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [direction, setDirection] = useState(0);

    const handlePrevMonth = () => {
        setDirection(-1);
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setDirection(1);
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const { history } = useWorkoutHistory();

    // Helper to check if two dates are the same day
    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    // Find workout(s) for the selected date
    const selectedWorkout = history.find(w => isSameDay(new Date(w.date), selectedDate));

    // Formatted Date String for Header
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="pb-8 overflow-hidden">
            {/* 1. Top Navigation Bar */}
            <div className="flex justify-between items-center mb-6 pt-4 px-2">
                <button onClick={onBack} className="p-2 -ml-2 text-white hover:text-[#22c55e] transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Workout History</h1>
                <button
                    onClick={() => {
                        const today = new Date();
                        setCurrentDate(today);
                        setSelectedDate(today);
                    }}
                    className="p-2 -mr-2 text-white hover:text-[#22c55e] transition-colors"
                >
                    <Calendar size={24} />
                </button>
            </div>

            {/* 2. Calendar Section */}
            <div className="mb-0 relative min-h-[350px]">
                <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                    <motion.div
                        key={currentDate.toISOString()}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={swipeTransition}
                        className="w-full"
                    >
                        <CalendarComponent
                            currentDate={currentDate}
                            selectedDate={selectedDate}
                            onDayClick={(day) => {
                                const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                setSelectedDate(newDate);
                            }}
                            onPrevMonth={handlePrevMonth}
                            onNextMonth={handleNextMonth}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 3. Selected Date Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">{formattedDate}</h2>
            </div>

            {/* 4. Workout Summary Card - Conditional Rendering */}
            {selectedWorkout ? (
                <>
                    <div className="bg-[#1e1e1e] rounded-[2rem] p-6 border border-white/5 relative overflow-hidden mb-8 group hover:border-[#22c55e]/30 transition-colors">
                        {/* Subtle gradient overlay */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#22c55e]/5 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-[#22c55e]/10 text-[#22c55e] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                    Routine
                                </div>
                                <div className="flex space-x-3 text-gray-400">
                                    <button onClick={() => onEdit(selectedWorkout)} className="hover:text-white transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
                                {selectedWorkout.title}
                            </h3>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Clock size={16} className="text-gray-500" />
                                    <span className="text-sm font-medium text-gray-300">{selectedWorkout.duration}</span>
                                </div>



                                <div className="flex items-center space-x-2 ml-auto text-[#22c55e]">
                                    <CheckCircle2 size={16} />
                                    <span className="text-sm font-bold">Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Exercise List Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Exercises</h3>
                            <span className="text-[#22c55e] text-sm font-bold">{selectedWorkout.exercises.length} Total</span>
                        </div>

                        <div className="space-y-4">
                            {selectedWorkout.exercises.map((exercise) => (
                                <div key={exercise.id} className="bg-[#1e1e1e] rounded-2xl p-4 flex items-center border border-white/5">
                                    {/* Icon Placeholder */}
                                    <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mr-4 flex-shrink-0">
                                        <span className="text-gray-400 text-xs font-bold">EX</span>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-bold text-white text-sm mb-1">{exercise.name}</h4>
                                        <div className="text-gray-400 text-xs font-medium">
                                            Sets: <span className="text-white">{exercise.sets.filter(s => s.completed).length}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end space-y-1">
                                        <TrendingUp size={14} className="text-[#22c55e]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <p>No workout recorded for this day.</p>
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
