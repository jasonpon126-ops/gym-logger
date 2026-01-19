import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserPreferencesProvider } from './context/UserPreferencesContext.jsx'
import { RoutineProvider } from './context/RoutineContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { WorkoutHistoryProvider } from './context/WorkoutHistoryContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserPreferencesProvider>
      <AuthProvider>
        <WorkoutHistoryProvider>
          <RoutineProvider>
            <App />
          </RoutineProvider>
        </WorkoutHistoryProvider>
      </AuthProvider>
    </UserPreferencesProvider>
  </StrictMode>,
)
