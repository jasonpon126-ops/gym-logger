import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { MOCK_HISTORY_DATA } from '../../data/mockData';

const variants = {
    enter: (direction) => {
        return {
            x: direction > 0 ? -300 : 300, // If Prev (1), enter from Left (-300). If Next (-1), enter from Right (300).
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            x: direction < 0 ? -300 : 300, // If Next (-1), exit to Left (-300). If Prev (1), exit to Right (300).
            opacity: 0
        };
    }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

import { useWorkoutHistory } from '../../context/WorkoutHistoryContext';

const CalendarComponent = ({ currentDate, selectedDate, onPrevMonth, onNextMonth, onDayClick }) => {
    const [direction, setDirection] = useState(0);
    const { history } = useWorkoutHistory();
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Derive workout days from history for the current month
    const workoutDays = history
        .filter(w => {
            const d = new Date(w.date);
            return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
        })
        .map(w => new Date(w.date).getDate());

    const paginate = (newDirection) => {
        setDirection(newDirection);
        if (newDirection === 1) {
            onPrevMonth();
        } else {
            onNextMonth();
        }
    };

    const dayVariants = {
        initial: { opacity: 0, y: 10 },
        animate: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.01 }
        })
    };

    // Helper to get days
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days: numDaysInMonth, firstDay: startDayIndex } = getDaysInMonth(currentDate);
    const calendarDays = Array.from({ length: numDaysInMonth }, (_, i) => i + 1);
    const emptySlots = Array.from({ length: startDayIndex }, (_, i) => null);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="w-full relative overflow-hidden h-[340px]">
            {/* Explicit height wrapper to contain absolute positioned slides if needed, or relative for flow */}
            {/* Actually, AnimatePresence wraps the changing content. */}

            <div className="flex justify-between items-center mb-6 px-4 select-none">
                <button onClick={() => paginate(1)} className="text-gray-400 hover:text-white p-2 z-10">
                    <ArrowLeft size={20} className="opacity-50" />
                </button>
                <h2 className="text-lg font-bold w-40 text-center z-10">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button onClick={() => paginate(-1)} className="text-gray-400 hover:text-white p-2 z-10">
                    <ArrowLeft size={20} className="rotate-180 opacity-50" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-y-4 mb-2">
                {daysOfWeek.map(day => (
                    <div key={day} className="text-center text-xs text-gray-500 font-medium z-10">
                        {day}
                    </div>
                ))}
            </div>

            <div className="relative w-full h-64">
                <AnimatePresence initial={false} custom={direction} mode='popLayout'>
                    <motion.div
                        key={currentDate.toISOString()}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "tween", ease: "easeInOut", duration: 0.3 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(-1); // Next Month
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(1); // Prev Month
                            }
                        }}
                        className="absolute w-full grid grid-cols-7 gap-y-2 top-0 left-0"
                    >
                        {emptySlots.map((_, index) => (
                            <div key={`empty-${index}`} />
                        ))}
                        {calendarDays.map((day, i) => {
                            const isWorkoutDay = workoutDays.includes(day);
                            const isSelected = selectedDate &&
                                selectedDate.getDate() === day &&
                                selectedDate.getMonth() === currentDate.getMonth() &&
                                selectedDate.getFullYear() === currentDate.getFullYear();

                            return (
                                <motion.div
                                    key={day}
                                    custom={i}
                                    variants={dayVariants}
                                    onClick={() => onDayClick && onDayClick(day)}
                                    // initial="initial" // Optional internal animations
                                    // animate="animate"
                                    className="flex flex-col items-center justify-center relative h-10 cursor-pointer"
                                >
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-[#22c55e] rounded-xl z-0 m-0.5" />
                                    )}

                                    <span className={`relative z-10 text-sm font-medium ${isSelected ? 'text-black font-bold' : 'text-white'}`}>
                                        {day}
                                    </span>

                                    {isWorkoutDay && !isSelected && (
                                        <div className="w-1 h-1 rounded-full bg-[#22c55e] mt-1" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CalendarComponent;
