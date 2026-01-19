import React from 'react';
import { ChevronLeft, MoreVertical, Target, Dumbbell, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const ExerciseDetail = ({ exercise, onClose, onAdd, showAdd }) => {
    if (!exercise) return null;

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black text-white flex flex-col pt-safe-top pb-safe-bottom"
        >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4">
                <button
                    onClick={onClose}
                    className="p-2 -ml-2 text-[#00f2ff] hover:opacity-80 transition-opacity"
                >
                    <ChevronLeft size={28} />
                </button>
                <h1 className="text-sm font-black tracking-[0.2em] uppercase text-center flex-1">
                    {exercise.name}
                </h1>
                <button className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
                    <MoreVertical size={24} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 pb-12">
                {/* Image Container */}
                <div className="relative aspect-square w-full bg-[#111] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl border border-white/5">
                    {exercise.image ? (
                        <div className="relative w-full h-full flex items-center justify-center p-8">
                            {/* Watermark/Logo placeholder in background as seen in ref */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                <Activity size={240} className="text-white" />
                            </div>

                            <img
                                src={exercise.image}
                                alt={exercise.name}
                                className="w-full h-full object-contain relative z-10 scale-110"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] text-gray-700">
                            <Dumbbell size={80} />
                        </div>
                    )}

                    {/* Badge */}
                    <div className="absolute bottom-6 left-6">
                        <div className="bg-black/40 backdrop-blur-md border border-[#00f2ff]/30 px-4 py-1.5 rounded-lg">
                            <span className="text-[10px] font-black tracking-widest uppercase text-[#00f2ff]">
                                Technical Render
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Target Card */}
                    <div className="bg-[#141414] border border-white/5 rounded-[2rem] p-6 flex flex-col gap-3 group hover:border-[#00f2ff]/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-[#00f2ff]/20">
                            <Target size={20} className="text-[#00f2ff]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Target</p>
                            <h3 className="text-lg font-bold leading-tight line-clamp-2">
                                {exercise.muscles || "Full Body"}
                            </h3>
                        </div>
                    </div>

                    {/* Type Card */}
                    <div className="bg-[#141414] border border-white/5 rounded-[2rem] p-6 flex flex-col gap-3 group hover:border-[#00f2ff]/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-[#00f2ff]/20">
                            <Dumbbell size={20} className="text-[#00f2ff]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Type</p>
                            <h3 className="text-lg font-bold leading-tight line-clamp-2">
                                {exercise.equipment || "Standard"}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Additional Details (Bonus UX) */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Zap size={16} className="text-[#00f2ff]" />
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Execution Guide</h4>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            {exercise.description || "Maintain proper form and controlled movement throughout the entire range of motion. Focus on the mind-muscle connection for optimal results."}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Activity size={16} className="text-[#00f2ff]" />
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</h4>
                        </div>
                        <div className="inline-block px-4 py-2 rounded-full bg-[#141414] border border-white/5 text-sm font-bold">
                            {exercise.category}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            {showAdd && (
                <div className="p-6 pt-2 border-t border-white/5">
                    <button
                        onClick={onAdd}
                        className="w-full bg-[#00f2ff] hover:bg-[#00d8e6] text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)] active:scale-[0.98]"
                    >
                        ADD TO WORKOUT
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default ExerciseDetail;
