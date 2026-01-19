
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkoutHistory } from '../../context/WorkoutHistoryContext';

const getLastSessionText = (history) => {
    if (!history || history.length === 0) return "No sessions yet";

    const lastDate = new Date(history[0].date); // Assuming history[0] is newest
    const today = new Date();

    // Reset hours to compare just dates
    const d1 = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
};

const GreetingHeader = () => {
    const { currentUser } = useAuth();
    const { history } = useWorkoutHistory();

    // Fallback if not logged in
    const displayName = currentUser?.displayName || "Guest";
    const avatarUrl = currentUser?.photoURL;
    const initial = displayName[0] || "G";

    const lastSessionText = getLastSessionText(history);

    return (
        <div className="flex justify-between items-start mb-8 pt-4">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Welcome back,
                </h1>
                <h2 className="text-4xl font-black text-[#22c55e] mt-1 tracking-tight">
                    {displayName}
                </h2>
                <div className="flex items-center mt-2 text-gray-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-gray-600 mr-2"></span>
                    Last session: {lastSessionText}
                </div>
            </div>

            <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="User" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#22c55e] to-black flex items-center justify-center text-xs font-bold">
                            {initial}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GreetingHeader;
