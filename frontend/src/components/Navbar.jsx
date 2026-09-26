import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Brain,
  LayoutDashboard,
  FileText,
  Briefcase,
  Dna,
  Map,
  MessageSquareCode,
  ListTodo,
  Sparkles,
  LogOut,
  UserCheck,
  Menu,
  X,
  BarChart3
} from 'lucide-react';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Intelligence', path: '/resume-analyzer', icon: FileText },
    { name: 'Job Match', path: '/job-match', icon: Briefcase },
    { name: 'Career DNA & Gaps', path: '/skill-gaps', icon: Dna },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
    { name: 'AI Interview', path: '/interview', icon: MessageSquareCode },
    { name: 'Applications', path: '/applications', icon: ListTodo },
    { name: 'AI Assistant', path: '/assistant', icon: Sparkles },
    { name: 'Analytics', path: '/admin-analytics', icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">CAREERMIND</span>
                <span className="text-xs font-semibold uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">AI</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider block -mt-1">CAREER INTELLIGENCE PLATFORM</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-indigo-600/20 text-cyan-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-gray-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 border-l border-gray-800 pl-4">
                <div className="text-right">
                  <span className="block text-xs font-semibold text-white">{user.name}</span>
                  <span className="inline-block text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/50">
                    {profile?.target_role || 'AI Engineer'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth?mode=login"
                  className="text-xs font-medium text-gray-300 hover:text-white px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 px-4 py-2 rounded-lg shadow-md shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && user && (
        <div className="lg:hidden border-b border-gray-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-indigo-600/20 text-cyan-300 border border-indigo-500/40'
                    : 'text-gray-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 text-cyan-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-cyan-400">{profile?.target_role || 'AI Engineer'}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300 px-3 py-2 bg-red-950/40 rounded border border-red-800/40"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
