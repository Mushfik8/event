import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { MessageProvider } from './contexts/MessageContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import EventsPage from './pages/EventsPage';
import MessagesPage from './pages/MessagesPage';
import Navigation from './components/Navigation';
import './index.css';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-200">
        {user && <Navigation />}
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <LoginPage /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/" 
            element={user ? <HomePage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/events" 
            element={user ? <EventsPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/messages" 
            element={user ? <MessagesPage /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <MessageProvider>
            <AppContent />
          </MessageProvider>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;