import React from 'react';
import { ArrowLeft, Settings, Scale, Timer, LogOut, ExternalLink, BadgeCheck, LogIn } from 'lucide-react';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import { useAuth } from '../../context/AuthContext';

const Profile = ({ onBack }) => {
    const { unitSystem, defaultRest, restTimerEnabled, toggleUnitSystem, toggleRestTimer, updateDefaultRest } = useUserPreferences();
    const { currentUser, signInWithGoogle, logout } = useAuth();

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Login failed", error);
            alert(`Login Failed: ${error.message}\n\nCheck if "Google" is enabled in Firebase Authentication settings.`);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#2e0249] to-[#0a0a0a] text-white font-sans">
            {/* 1. Header */}
            <header className="flex items-center justify-between px-6 py-6 sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-sm font-bold tracking-[0.2em] text-purple-200/80">PROFILE</h1>
                <button className="p-2 -mr-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5">
                    <Settings size={20} />
                </button>
            </header>

            {/* Main Scrollable Content */}
            <main className="flex-1 px-6 pb-24 overflow-y-auto">

                {/* 2. User Avatar Section */}
                <div className="flex flex-col items-center mt-4 mb-10">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-b from-purple-500 to-purple-900 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                            <div className="w-full h-full rounded-full bg-[#1a1a1a] overflow-hidden flex items-center justify-center">
                                {currentUser?.photoURL ? (
                                    <img
                                        src={currentUser.photoURL}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-gray-400">
                                        {currentUser?.displayName?.[0] || "?"}
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Verification Badge - Only show if logged in */}
                        {currentUser && (
                            <div className="absolute bottom-1 right-1 bg-[#2e0249] rounded-full p-1 border border-purple-500/30">
                                <BadgeCheck className="text-purple-400" size={20} fill="currentColor" color="#2e0249" />
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">
                        {currentUser?.displayName || "Guest User"}
                    </h2>
                    <p className="text-purple-300/60 text-xs font-bold tracking-wider uppercase">
                        {currentUser ? "Elite Athlete • Level 42" : "Not Signed In"}
                    </p>
                </div>

                {/* 3. Connected Account Card */}
                {currentUser ? (
                    <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4 mb-10 flex items-center justify-between group cursor-pointer hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Connected Account</p>
                                <p className="text-sm font-medium text-gray-200">{currentUser.email}</p>
                            </div>
                        </div>
                        <ExternalLink size={16} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
                    </div>
                ) : (
                    <div
                        onClick={handleLogin}
                        className="bg-[#18181b] border border-white/5 rounded-2xl p-4 mb-10 flex items-center justify-between group cursor-pointer hover:border-[#4285F4] transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center">
                                <LogIn size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Action Required</p>
                                <p className="text-sm font-medium text-gray-200">Connect Google Account</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Workout Config Section */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">
                        Workout Config
                    </h3>

                    <div className="space-y-4">
                        {/* Unit System Card */}
                        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                    <Scale size={18} />
                                </div>
                                <span className="text-sm font-medium text-gray-200">Unit System</span>
                            </div>

                            {/* Custom Segmented Control */}
                            <div className="flex bg-black rounded-lg p-1 border border-white/5">
                                <button
                                    onClick={() => unitSystem !== 'LBS' && toggleUnitSystem()}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${unitSystem === 'LBS'
                                        ? 'bg-[#a855f7] text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    LBS
                                </button>
                                <button
                                    onClick={() => unitSystem !== 'KG' && toggleUnitSystem()}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${unitSystem === 'KG'
                                        ? 'bg-[#a855f7] text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    KG
                                </button>
                            </div>
                        </div>

                        {/* Default Rest Card */}
                        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <Timer size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-200">Rest Timer</span>
                                </div>

                                {/* Toggle Switch */}
                                <button
                                    onClick={toggleRestTimer}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${restTimerEnabled ? 'bg-[#a855f7]' : 'bg-zinc-700'}`}
                                >
                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${restTimerEnabled ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>

                            {restTimerEnabled && (
                                <div className="ml-11">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={defaultRest}
                                            onChange={(e) => updateDefaultRest(Number(e.target.value))}
                                            className="w-16 bg-black border border-white/10 rounded-lg px-2 py-1 text-center text-sm font-bold text-white focus:outline-none focus:border-purple-500"
                                        />
                                        <span className="text-xs text-gray-500 font-bold uppercase">Seconds</span>
                                    </div>
                                    <p className="text-[10px] text-gray-600 mt-2">
                                        Timer will auto-start after completing a set.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 5. Footer */}
                <div className="mt-8 flex flex-col items-center gap-6">
                    {currentUser && (
                        <button
                            onClick={handleLogout}
                            className="w-full py-4 rounded-xl border border-white/10 flex items-center justify-center gap-3 text-sm font-bold tracking-wide hover:bg-white/5 transition-colors group"
                        >
                            <LogOut size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                            LOG OUT OF ACCOUNT
                        </button>
                    )}

                    <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">
                        Version 3.12.0 • Pro Build
                    </p>
                </div>

            </main>
        </div>
    );
};

export default Profile;
