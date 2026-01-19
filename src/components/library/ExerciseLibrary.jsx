import React, { useState } from 'react';
import { Search, SlidersHorizontal, Info, UserCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { slideVariants, swipeTransition } from '../../utils/animations';
import { EXERCISE_DATABASE } from '../../data/exercisesData';
import ExerciseDetail from './ExerciseDetail';

const EXERCISE_DATA = EXERCISE_DATABASE;

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Cardio', 'Abs'];

const ExerciseLibrary = ({ isOpen, onClose, onSelectExercise }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState(null);

    const handleCategoryClick = (category, index) => {
        setDirection(index > activeTabIndex ? 1 : -1);
        setActiveTabIndex(index);
        setSelectedCategory(category);
    };

    // Filter Logic
    const filteredExercises = EXERCISE_DATA.filter(exercise => {
        const matchCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
        const matchSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exercise.muscles.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const handleExerciseClick = (exercise) => {
        setSelectedExerciseForDetail(exercise);
    };

    const handleAddToWorkout = (exercise) => {
        if (onSelectExercise) {
            onSelectExercise(exercise);
            setSelectedExerciseForDetail(null);
        }
    };

    // Conditional Styles for Modal vs Standalone
    const containerClasses = isOpen
        ? "fixed inset-0 z-50 bg-[#1c1a15] flex flex-col pt-safe-top pb-safe-bottom"
        : "flex flex-col h-full bg-[#1c1a15] text-white p-6 pb-24";

    // Header Content
    const renderHeader = () => {
        if (isOpen) {
            return (
                <header className="flex items-center justify-between mb-6 px-6 pt-6">
                    <button
                        onClick={onClose}
                        className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-white">Select Exercise</h1>
                    <div className="w-8" /> {/* Spacer */}
                </header>
            );
        }
        return (
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Exercise Library</h1>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <UserCircle size={32} />
                </button>
            </header>
        );
    };

    const handleSwipe = (event, { offset, velocity }) => {
        const swipeThreshold = 50;
        const swipePower = Math.abs(offset.x) * velocity.x;

        if (offset.x < -swipeThreshold) {
            // Swipe Left -> Next
            if (activeTabIndex < CATEGORIES.length - 1) {
                handleCategoryClick(CATEGORIES[activeTabIndex + 1], activeTabIndex + 1);
            }
        } else if (offset.x > swipeThreshold) {
            // Swipe Right -> Prev
            if (activeTabIndex > 0) {
                handleCategoryClick(CATEGORIES[activeTabIndex - 1], activeTabIndex - 1);
            }
        }
    };

    return (
        <div className={containerClasses}>
            {/* 1. Header */}
            {renderHeader()}

            {/* Content Container - add padding if modal because containerClasses removes p-6 */}
            <div className={isOpen ? "px-6 flex flex-col h-full overflow-hidden" : "contents"}>

                {/* 2. Search & Filter */}
                <div className="flex gap-3 mb-6 flex-shrink-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#2c2c2e] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#eab308]"
                        />
                    </div>
                    <button className="bg-[#eab308] hover:bg-[#ca9a04] text-black p-3 rounded-xl transition-colors min-w-[48px] flex items-center justify-center">
                        <SlidersHorizontal size={20} />
                    </button>
                </div>

                {/* 3. Category Chips */}
                <div className="flex gap-3 overflow-x-auto pb-2 mb-4 no-scrollbar -mx-6 px-6 flex-shrink-0">
                    {CATEGORIES.map((category, index) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category, index)}
                            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-colors ${selectedCategory === category
                                ? 'bg-[#eab308] text-black'
                                : 'bg-[#2c2c2e] text-gray-400 hover:bg-[#3a3a3c] hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* 4. Exercise List */}
                <div className="flex-1 -mx-2 px-2 pb-safe-bottom overflow-hidden relative">
                    <AnimatePresence initial={false} mode="wait" custom={direction}>
                        <motion.div
                            key={selectedCategory}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={swipeTransition}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleSwipe}
                            className="space-y-3 h-full overflow-y-auto touch-pan-y"
                        >
                            {filteredExercises.map(exercise => (
                                <div
                                    key={exercise.id}
                                    onClick={() => handleExerciseClick(exercise)}
                                    className="bg-[#2c2c2e]/50 hover:bg-[#2c2c2e] rounded-xl p-3 flex items-center gap-4 transition-colors group cursor-pointer"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg flex-shrink-0 overflow-hidden">
                                        {exercise.image ? (
                                            <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#252525] text-gray-600 font-bold text-xs uppercase">
                                                {exercise.name.slice(0, 2)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-md truncate">{exercise.name}</h3>
                                        <p className="text-gray-500 text-xs truncate">{exercise.muscles}</p>
                                    </div>

                                    {/* Action */}
                                    <button className="text-[#eab308] opacity-80 hover:opacity-100 p-2">
                                        <div className="w-6 h-6 rounded-full border border-[#eab308] flex items-center justify-center">
                                            <span className="text-xs font-serif font-bold italic">i</span>
                                        </div>
                                    </button>
                                </div>
                            ))}

                            {filteredExercises.length === 0 && (
                                <div className="text-center py-10 text-gray-500">
                                    No exercises found
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Exercise Detail Overlay */}
            <AnimatePresence>
                {selectedExerciseForDetail && (
                    <ExerciseDetail
                        exercise={selectedExerciseForDetail}
                        onClose={() => setSelectedExerciseForDetail(null)}
                        onAdd={() => handleAddToWorkout(selectedExerciseForDetail)}
                        showAdd={!!onSelectExercise}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExerciseLibrary;
