import React from 'react';
import { Plus } from 'lucide-react';
import { NAV_ITEMS } from '../../data/mockData';

const BottomNav = ({ currentTab, onTabChange, onOpenAdd }) => {

    const handleTabClick = (itemId, isFab) => {
        if (isFab) {
            onOpenAdd();
        } else {
            onTabChange(itemId);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-white/5 pb-safe px-4 h-20 flex items-center justify-between z-50">
            {NAV_ITEMS.map((item) => {
                const isActive = currentTab === item.id;

                if (item.isFab) {
                    return (
                        <div key={item.id} className="relative -top-8">
                            <button
                                onClick={() => handleTabClick(item.id, true)}
                                className="bg-[#22c55e] hover:bg-[#16a34a] text-black rounded-full p-4 shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all"
                            >
                                <Plus size={32} strokeWidth={2.5} />
                            </button>
                        </div>
                    );
                }

                return (
                    <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id, false)}
                        className={`flex flex-col items-center justify-center space-y-1 w-12 ${isActive ? 'text-[#22c55e]' : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        {/* Hide label for cleaner look or keep it small? Requirement implies simple icons/items. Keeping label as per original mocked items but small. */}
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
