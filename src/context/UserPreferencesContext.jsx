import React, { createContext, useContext, useState } from 'react';

const UserPreferencesContext = createContext();

export const UserPreferencesProvider = ({ children }) => {
    const [unitSystem, setUnitSystem] = useState('LBS'); // 'LBS' or 'KG'
    const [defaultRest, setDefaultRest] = useState(90); // seconds
    const [restTimerEnabled, setRestTimerEnabled] = useState(true);

    const toggleUnitSystem = () => {
        setUnitSystem((prev) => (prev === 'LBS' ? 'KG' : 'LBS'));
    };

    const toggleRestTimer = () => {
        setRestTimerEnabled(prev => !prev);
    };

    const updateDefaultRest = (seconds) => {
        setDefaultRest(seconds);
    };

    return (
        <UserPreferencesContext.Provider
            value={{
                unitSystem,
                defaultRest,
                restTimerEnabled,
                toggleUnitSystem,
                toggleRestTimer,
                updateDefaultRest,
            }}
        >
            {children}
        </UserPreferencesContext.Provider>
    );
};

export const useUserPreferences = () => {
    const context = useContext(UserPreferencesContext);
    if (context === undefined) {
        throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
    }
    return context;
};
