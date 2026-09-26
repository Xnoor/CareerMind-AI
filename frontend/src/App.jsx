import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import JobMatchPage from './pages/JobMatchPage';
import SkillGapPage from './pages/SkillGapPage';
import RoadmapPage from './pages/RoadmapPage';
import InterviewPage from './pages/InterviewPage';
import ApplicationsPage from './pages/ApplicationsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex items-center justify-center font-mono text-xs">
        <div className="flex items-center space-x-2 text-cyan-400">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <span>Validating CareerMind Credentials...</span>
        </div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>} />
              <Route path="/job-match" element={<ProtectedRoute><JobMatchPage /></ProtectedRoute>} />
              <Route path="/skill-gaps" element={<ProtectedRoute><SkillGapPage /></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
              <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
              <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
              <Route path="/assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
              <Route path="/admin-analytics" element={<ProtectedRoute><AdminAnalyticsPage /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
