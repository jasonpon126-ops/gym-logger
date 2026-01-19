import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import GreetingHeader from './components/home/GreetingHeader';
import WeeklyStreak from './components/home/WeeklyStreak';
import StartWorkoutCarousel from './components/home/StartWorkoutCarousel';
import RecentPRs from './components/home/RecentPRs';
import LastWorkout from './components/home/LastWorkout';
import HistoryPage from './components/history/HistoryPage';
import AddMenuModal from './components/common/AddMenuModal';
import NewRoutine from './components/routines/NewRoutine';
import ExerciseLibrary from './components/library/ExerciseLibrary';
import Profile from './components/profile/Profile';
import ActiveWorkout from './components/workout/ActiveWorkout';
import ActiveRoutineSession from './components/workout/ActiveRoutineSession';
import SessionSummary from './components/history/SessionSummary';

import EditHistorySession from './components/history/EditHistorySession';
import ManageRoutines from './components/routines/ManageRoutines';
import { useRoutines } from './context/RoutineContext';

function App() {
  // Persist current tab
  const [currentTab, setCurrentTab] = useState(() => {
    const saved = localStorage.getItem('gym_log_current_tab');

    // Always restore active sessions
    if (saved === 'active-routine' || saved === 'active-workout') return saved;

    // Restore main navigation tabs
    const mainTabs = ['home', 'log', 'exercise', 'profile'];
    if (saved && mainTabs.includes(saved)) return saved;

    // Default to home for transient states (new-routine, session-summary, etc)
    return 'home';
  });

  // Save tab on change
  useEffect(() => {
    localStorage.setItem('gym_log_current_tab', currentTab);
  }, [currentTab]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [completedSessionData, setCompletedSessionData] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const { startRoutine, activeRoutine } = useRoutines();

  // Safety check: specific active tabs should only be active if data exists
  useEffect(() => {
    if (currentTab === 'active-routine' && !activeRoutine) {
      setCurrentTab('home');
    }
    if (currentTab === 'edit-history' && !editingSession) {
      setCurrentTab('log');
    }
  }, [currentTab, activeRoutine, editingSession]);

  const handleStartEmptyWorkout = () => {
    setCurrentTab('new-routine');
    setIsAddModalOpen(false);
  };

  const handleStartActiveWorkout = () => {
    setCurrentTab('active-workout');
    setIsAddModalOpen(false);
  };

  const handleStartRoutine = (routine) => {
    startRoutine(routine);
    setCurrentTab('active-routine');
  };

  const handleFinishSession = (data) => {
    setCompletedSessionData(data);
    setCurrentTab('session-summary');
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setCurrentTab('edit-history');
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <div className="px-6">
            <GreetingHeader />
            <WeeklyStreak />
            <StartWorkoutCarousel
              onStartRoutine={handleStartRoutine}
              onViewAll={() => setCurrentTab('manage-routines')}
            />
            <RecentPRs />
            <LastWorkout />
          </div>
        );
      case 'log':
        // Pass onBack to go home if needed, though log is a top-level tab now
        return (
          <div className="px-4">
            <HistoryPage
              onBack={() => setCurrentTab('home')}
              onEdit={handleEditSession}
            />
          </div>
        );
      case 'new-routine':
        return <NewRoutine onBack={() => setCurrentTab('home')} />;
      case 'active-workout':
        return <ActiveWorkout />;
      case 'active-routine':
        return (
          <ActiveRoutineSession
            onBack={() => setCurrentTab('home')}
            onFinish={handleFinishSession}
          />
        );
      case 'session-summary':
        return (
          <SessionSummary
            data={completedSessionData}
            onClose={() => setCurrentTab('home')}
            onDone={() => setCurrentTab('home')}
          />
        );
      case 'edit-history':
        return (
          <EditHistorySession
            sessionData={editingSession}
            onBack={() => setCurrentTab('log')}
            onSave={() => setCurrentTab('log')}
          />
        );
      case 'exercise':
        return <ExerciseLibrary />;
      case 'profile':
        return <Profile onBack={() => setCurrentTab('home')} />;
      case 'manage-routines':
        return (
          <ManageRoutines
            onBack={() => setCurrentTab('home')}
            onAdd={() => setCurrentTab('new-routine')}
          />
        );
      default:
        return (
          <div className="px-6 pt-10 text-center">
            <h2 className="text-2xl font-bold text-gray-500">Coming Soon</h2>
            <button
              onClick={() => setCurrentTab('home')}
              className="mt-4 text-[#22c55e] font-bold"
            >
              Go Home
            </button>
          </div>
        );
    }
  };

  return (
    <>
      <Layout
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAdd={() => setIsAddModalOpen(true)}
      >
        {renderContent()}
      </Layout>

      <AddMenuModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStartEmpty={handleStartEmptyWorkout}
        onStartActive={handleStartActiveWorkout}
      />
    </>
  );
}

export default App;
