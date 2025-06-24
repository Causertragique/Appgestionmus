import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TeacherDashboard from './components/TeacherDashboard';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MusiqueConnectHome from './components/MusiqueConnectHome';
import PricingPage from '../stripe/PricingPage';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    // Si pas connecté, redirige vers /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/app" replace /> : <MusiqueConnectHome />} />
      <Route path="/login" element={user ? <Navigate to="/app" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/app" replace /> : <SignupPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/app" element={
        <PrivateRoute>
          <TeacherDashboard />
        </PrivateRoute>
      } />
      {/* Redirection catch-all vers la landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;