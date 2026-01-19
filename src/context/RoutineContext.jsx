import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROUTINES as MOCK_ROUTINES } from '../data/mockData'; // Fallback
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, writeBatch } from 'firebase/firestore';

const RoutineContext = createContext();

export const useRoutines = () => {
    const context = useContext(RoutineContext);
    if (context === undefined) {
        throw new Error('useRoutines must be used within a RoutineProvider');
    }
    return context;
};

export const RoutineProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const storageKey = `routines_${currentUser?.uid || 'guest'}`;

    const [routines, setRoutines] = useState([]);

    // Track hidden mock routines to allow "deleting" them
    const [hiddenRoutineIds, setHiddenRoutineIds] = useState(() => {
        try {
            const saved = localStorage.getItem('gym_log_hidden_routines');
            return saved ? JSON.parse(saved).map(String) : [];
        } catch (e) { return []; }
    });

    // Save hidden IDs when they change
    useEffect(() => {
        localStorage.setItem('gym_log_hidden_routines', JSON.stringify(hiddenRoutineIds));
    }, [hiddenRoutineIds]);

    // Load routines (Firestore or LocalStorage)
    useEffect(() => {
        if (!currentUser) {
            // GUEST: LocalStorage
            const saved = localStorage.getItem(storageKey);
            let localRoutines = saved ? JSON.parse(saved) : MOCK_ROUTINES;

            // Apply order cache if exists
            const orderCacheRaw = localStorage.getItem(`${storageKey}_order_cache`);
            const orderCache = orderCacheRaw ? JSON.parse(orderCacheRaw) : [];

            // Ensure IDs are strings and filter hidden
            localRoutines = localRoutines
                .map(r => {
                    const id = String(r.id);
                    const cached = orderCache.find(o => String(o.id) === id);
                    return { ...r, id, order: cached ? cached.order : r.order };
                })
                .filter(r => !hiddenRoutineIds.includes(r.id));

            // Sort by order
            localRoutines.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

            setRoutines(localRoutines);
            return;
        }

        // USER: Firestore
        const routinesRef = collection(db, `users/${currentUser.uid}/routines`);
        // Simple query, maybe order by name or created date later if we add it
        const q = query(routinesRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedRoutines = snapshot.docs.map(doc => ({
                id: String(doc.id),
                ...doc.data()
            }));

            // Apply order cache to ALL routines for the local device priority
            const cacheKey = `${storageKey}_order_cache`;
            const orderCacheRaw = localStorage.getItem(cacheKey);
            const orderCache = orderCacheRaw ? JSON.parse(orderCacheRaw) : [];

            const getBestOrder = (routineId, existingOrder) => {
                const cached = orderCache.find(o => String(o.id) === String(routineId));
                if (cached && cached.order !== undefined) return cached.order;
                return existingOrder !== undefined ? existingOrder : 999;
            };

            const visibleMocks = MOCK_ROUTINES
                .map(r => ({
                    ...r,
                    id: String(r.id),
                    order: getBestOrder(r.id, r.order)
                }))
                .filter(r => !hiddenRoutineIds.includes(r.id));

            const processedCloud = fetchedRoutines.map(r => ({
                ...r,
                order: getBestOrder(r.id, r.order)
            }));

            let combined = [...visibleMocks, ...processedCloud];
            combined.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

            console.log(`[Routines] Loaded ${combined.length} total. Cache: ${orderCache.length}`);
            setRoutines(combined);
        });

        return () => unsubscribe();

    }, [currentUser, storageKey, hiddenRoutineIds]);

    // Persist custom routines (GUEST ONLY)
    useEffect(() => {
        if (currentUser) return;
        if (routines.length > 0) {
            // Filter out mocks before saving? Or just save all? 
            // Simple approach: Save all for guest
            localStorage.setItem(storageKey, JSON.stringify(routines));
        }
    }, [routines, storageKey, currentUser]);

    const addRoutine = async (routine) => {
        if (currentUser) {
            try {
                await addDoc(collection(db, `users/${currentUser.uid}/routines`), routine);
            } catch (e) {
                console.error("Error adding routine to cloud: ", e);
            }
        } else {
            setRoutines((prev) => [routine, ...prev]);
        }
    };
    // Active Routine State with Persistence
    const activeRoutineStorageKey = `active_routine_${currentUser?.uid || 'guest'}`;

    const [activeRoutine, setActiveRoutine] = useState(() => {
        try {
            const saved = localStorage.getItem(activeRoutineStorageKey);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Failed to load active routine", e);
            return null;
        }
    });

    useEffect(() => {
        if (activeRoutine) {
            localStorage.setItem(activeRoutineStorageKey, JSON.stringify(activeRoutine));
        } else {
            localStorage.removeItem(activeRoutineStorageKey);
        }
    }, [activeRoutine, activeRoutineStorageKey]);

    const startRoutine = (routine) => {
        setActiveRoutine(routine);
    };

    const deleteRoutine = async (routineId) => {
        // Optimistically remove from UI immediately (Local state)
        const previousRoutines = routines;
        setRoutines(prev => prev.filter(r => r.id !== routineId));

        // Check if it's a mock routine (numeric ID or matches MOCK_ROUTINES)
        const isMock = MOCK_ROUTINES.some(r => String(r.id) === String(routineId));

        if (isMock) {
            // "Hide" it locally
            setHiddenRoutineIds(prev => [...prev, String(routineId)]);
            return; // Don't try to delete from Firestore
        }

        if (currentUser) {
            try {
                // Ensure ID is a string, Firestore SDK expects path segments to be strings
                const idString = String(routineId);
                await deleteDoc(doc(db, `users/${currentUser.uid}/routines`, idString));
            } catch (e) {
                console.error("Error deleting routine from cloud:", e);
                alert(`Cloud delete failed (${e.message}). Removed locally.`);
            }
        }
    };

    const reorderRoutines = async (newRoutines) => {
        // optimistically update state
        const reorderedWithIndices = newRoutines.map((r, i) => ({ ...r, order: i }));
        setRoutines(reorderedWithIndices);

        if (currentUser) {
            try {
                const batch = writeBatch(db);
                reorderedWithIndices.forEach((routine) => {
                    // Only update Firestore for non-mock routines
                    const isMock = MOCK_ROUTINES.some(mr => String(mr.id) === String(routine.id));
                    if (!isMock) {
                        const ref = doc(db, `users/${currentUser.uid}/routines`, String(routine.id));
                        batch.update(ref, { order: routine.order });
                    }
                });
                await batch.commit();
            } catch (e) {
                console.error("Error reordering routines:", e);
            }
        } else {
            // Guest logic is handled by setting state and the secondary useEffect for localStorage
        }

        // Persist mock routine order specifically if we want them to stick for logged in users too
        // Actually, the simplest way is to save the entire state in storage as a cache
        localStorage.setItem(`${storageKey}_order_cache`, JSON.stringify(reorderedWithIndices.map(r => ({ id: r.id, order: r.order }))));
    };

    return (
        <RoutineContext.Provider value={{ routines, addRoutine, activeRoutine, startRoutine, deleteRoutine, reorderRoutines }}>
            {children}
        </RoutineContext.Provider>
    );
};


