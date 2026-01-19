import React from 'react';
import BottomNav from './BottomNav';

const Layout = ({ children, currentTab, onTabChange, onOpenAdd }) => {
    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans antialiased overflow-x-hidden pb-24">
            <main className="max-w-md mx-auto min-h-screen relative">
                {children}
            </main>
            <div className="max-w-md mx-auto">
                {!['new-routine', 'active-workout', 'active-routine', 'session-summary', 'edit-history'].includes(currentTab) && (
                    <BottomNav currentTab={currentTab} onTabChange={onTabChange} onOpenAdd={onOpenAdd} />
                )}
            </div>
        </div>
    );
};

export default Layout;
