import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FirebaseDataProvider } from './contexts/FirebaseDataContext';
import { SettingsProvider } from './contexts/SettingsContext';
import FirebaseInitializer from './components/FirebaseInitializer';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <FirebaseInitializer>
      <Routes>
        <Route 
          path="/" 
          element={
            user.role === 'teacher' ? (
              <Navigate to="/teacher" replace />
            ) : (
              <Navigate to="/student" replace />
            )
          } 
        />
        <Route 
          path="/teacher" 
          element={
            user.role === 'teacher' ? (
              <TeacherDashboard />
            ) : (
              <Navigate to="/student" replace />
            )
          } 
        />
        <Route 
          path="/student" 
          element={
            user.role === 'student' ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/teacher" replace />
            )
          } 
        />
      </Routes>
    </FirebaseInitializer>
  );
}

function App() {
  return (
    <Router>
      <SettingsProvider>
        <AuthProvider>
          <FirebaseDataProvider>
            <div className="min-h-screen bg-gray-50">
              <AppRoutes />
            </div>
          </FirebaseDataProvider>
        </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;