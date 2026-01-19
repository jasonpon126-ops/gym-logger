import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const WorkoutHistoryContext = createContext();

export const useWorkoutHistory = () => {
    return useContext(WorkoutHistoryContext);
};

export const WorkoutHistoryProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const storageKey = `workout_history_${currentUser?.uid || 'guest'}`;

    // Initialize from localStorage
    const [history, setHistory] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load history when user changes (LocalStorage vs Firestore)
    useEffect(() => {
        setIsLoaded(false); // Reset on key change

        // GUEST USER: Use LocalStorage
        if (!currentUser) {
            try {
                const saved = localStorage.getItem(storageKey);
                setHistory(saved ? JSON.parse(saved) : []);
            } catch (e) {
                console.error("Failed to load history", e);
                setHistory([]);
            } finally {
                setIsLoaded(true);
            }
            return;
        }

        // LOGGED IN USER: Use Firestore
        const workoutsRef = collection(db, `users/${currentUser.uid}/workouts`);
        const q = query(workoutsRef, orderBy("date", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const cloudWorkouts = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.data().id, // Explicitly keep timestamp ID
                firestoreId: doc.id // Capture the real document ID for updates
            }));

            // Merge with local storage (offline) workouts
            // We keep local items that are NOT in cloud (by ID check? Cloud IDs are hashes, Local are Timestamps usually)
            // Ideally we'd sync them up, but for now just showing them is enough.
            let localWorkouts = [];
            try {
                localWorkouts = JSON.parse(localStorage.getItem(storageKey) || "[]");
            } catch (e) {
                console.error("Error reading local backup", e);
            }

            // Simple merge: Concat and dedup by ID just in case
            // Assuming cloud is authority, but we want pending local ones.
            const cloudIds = new Set(cloudWorkouts.map(w => w.id));
            const uniqueLocal = localWorkouts.filter(w => !cloudIds.has(w.id));

            // Sort merged list by date descending
            const merged = [...uniqueLocal, ...cloudWorkouts].sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );

            setHistory(merged);
            setIsLoaded(true);
        }, (error) => {
            console.error("Error fetching workouts:", error);
            // If cloud completely fails (permission/network), fallback to local only
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved) setHistory(JSON.parse(saved));
            } catch (e) { }
            setIsLoaded(true);
        });

        return () => unsubscribe();
    }, [currentUser, storageKey]);

    // Persist to localStorage on change (ONLY FOR GUEST OR BACKUP)
    // We already manually save to LS on failure, so we don't need this effect to run for users automatically
    // or it might overwrite our specific backup logic with stale state if we aren't careful.
    // Let's keep it restricted to Guest for now, OR make it 'cache' everything.
    // If we make it cache everything, we basically implement our own offline cache.
    // Let's stick to the manual backup in addWorkout for safety.
    useEffect(() => {
        if (!isLoaded || currentUser) return;
        localStorage.setItem(storageKey, JSON.stringify(history));
    }, [history, storageKey, isLoaded, currentUser]);

    const addWorkout = async (workoutData) => {
        const newWorkout = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...workoutData
        };

        if (currentUser) {
            console.log("Attempting to save to Firestore for user:", currentUser.uid);

            // FIRESTORE ADD with TIMEOUT
            try {
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Request timed out (15s). Check your internet connection or Firewall rules.")), 15000)
                );

                await Promise.race([
                    addDoc(collection(db, `users/${currentUser.uid}/workouts`), {
                        ...newWorkout
                    }),
                    timeoutPromise
                ]);

                console.log("Firestore save successful!");
                return true;
            } catch (e) {
                console.error("Error adding workout to cloud: ", e);

                // FALLBACK: Save locally
                alert(`Cloud Save Failed (${e.message}). Saving to device storage only.`);

                try {
                    const currentLocal = JSON.parse(localStorage.getItem(storageKey) || "[]");
                    const updatedLocal = [newWorkout, ...currentLocal];
                    localStorage.setItem(storageKey, JSON.stringify(updatedLocal));

                    // Update state immediately so user sees it
                    setHistory(prev => [newWorkout, ...prev]); // optimistic update
                } catch (localError) {
                    console.error("Local backup failed too", localError);
                    alert("Critical Error: Could not save to device either.");
                    return false;
                }

                return true; // Return true so the app proceeds to "Finished" state
            }
        } else {
            // LOCAL STORAGE ADD
            setHistory(prev => [newWorkout, ...prev]);
            return true;
        }
    };

    const updateWorkout = async (updatedWorkout) => {
        // Optimistic Local Update first (for immediate UI response)
        setHistory(prev => prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));

        if (currentUser) {
            try {
                // Find reference. If we have the ID, we can update it directly.
                // NOTE: If the ID is a timestamp (from guest mode migration), this might fail if it's not the Document ID.
                // Ideally, when loading from Firestore, we mapped doc.id to the object.
                // If updatedWorkout.id is the document ID, we are good.

                // We use doc() with the collection path. Prefer firestoreId if available.
                const docId = updatedWorkout.firestoreId || updatedWorkout.id;
                const workoutRef = doc(db, `users/${currentUser.uid}/workouts`, docId);
                await updateDoc(workoutRef, updatedWorkout);
                console.log("Firestore update successful");
                return true;
            } catch (e) {
                console.error("Error updating workout in cloud", e);
                // If it fails (maybe it was a local-only workout pending sync?), we might want to alert
                // Or fallback to local storage logic if we support hybrid offline
                // For now, let's assume it might be a local-created workout that hasn't synced yet, 
                // but our context logic separates them strictly right now.

                // Fallback attempt: purely local storage update?
                // This is risky if we are in cloud mode but failing.
                alert("Failed to save changes to cloud. Changes are local-only for now.");
                return false;
            }
        } else {
            // Guest Mode Logic
            const currentLocal = JSON.parse(localStorage.getItem(storageKey) || "[]");
            const updatedLocal = currentLocal.map(w => w.id === updatedWorkout.id ? updatedWorkout : w);
            localStorage.setItem(storageKey, JSON.stringify(updatedLocal));
            return true;
        }
    };

    // Helper to upload local guest data to cloud (One-time migration could go here)

    const clearHistory = () => {
        if (!currentUser) setHistory([]);
        // For firestore we usually don't provide a "Clear All" easily to avoid accidents
    };

    const value = {
        history,
        addWorkout,
        updateWorkout,
        clearHistory,
        isLoaded
    };

    return (
        <WorkoutHistoryContext.Provider value={value}>
            {children}
        </WorkoutHistoryContext.Provider>
    );
};
