import React from 'react';
import { Dumbbell, Copy, Calendar, X, Timer } from 'lucide-react';

const MenuButton = ({ icon: Icon, label, color, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#2a2a2a] hover:bg-[#333] transition-colors border border-white/5 group active:scale-95"
    >
        <div className={`p-3 rounded-xl mb-3 ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <span className="text-xs font-bold text-gray-300">{label}</span>
    </button>
);

const AddMenuModal = ({ isOpen, onClose, onStartEmpty, onStartActive }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e] rounded-t-3xl p-6 z-50 animate-slide-up">
                <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-8" />

                <h2 className="text-xl font-bold text-white mb-6">Quick Add</h2>

                <div className="grid grid-cols-4 gap-4 mb-8">
                    <MenuButton
                        icon={Dumbbell}
                        label="Empty Workout"
                        color="bg-emerald-500/20 text-emerald-500"
                        onClick={onStartEmpty}
                    />
                    <MenuButton
                        icon={Timer}
                        label="Quick Start"
                        color="bg-blue-500/20 text-blue-500"
                        onClick={onStartActive}
                    />
                    <MenuButton
                        icon={Copy}
                        label="Paste Routine"
                        color="bg-purple-500/20 text-purple-500"
                    />
                    <MenuButton
                        icon={Calendar}
                        label="Log Past"
                        color="bg-orange-500/20 text-orange-500"
                    />
                </div>
            </div>
        </>
    );
};

export default AddMenuModal;
