import React from 'react';
import TeacherDashboard from './components/TeacherDashboard';
import LoginPage from './components/LoginPage';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return <TeacherDashboard />;
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;