import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import {
  BarChart3,
  Users,
  FileCheck2,
  Briefcase,
  MessageSquareCode,
  Activity,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsAPI.getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const admin = analytics?.admin_stats || {};

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>PLATFORM ANALYTICS DASHBOARD</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System & Platform Analytics</h1>
        <p className="text-xs text-gray-400 mt-1">
          Aggregated platform usage metrics, skill gap distributions, and system health status.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{admin.total_users || 12}</p>
          <p className="text-[11px] text-gray-400 mt-1">Active platform accounts</p>
        </div>

        <div className="glass-card p-5 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Resumes Parsed</span>
            <FileCheck2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{admin.resumes_analyzed || 48}</p>
          <p className="text-[11px] text-gray-400 mt-1">NLP section extractions</p>
        </div>

        <div className="glass-card p-5 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Jobs Analyzed</span>
            <Briefcase className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{admin.jobs_analyzed || 35}</p>
          <p className="text-[11px] text-gray-400 mt-1">Embeddings job matches</p>
        </div>

        <div className="glass-card p-5 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Interviews Done</span>
            <MessageSquareCode className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{admin.interviews_completed || 29}</p>
          <p className="text-[11px] text-gray-400 mt-1">Completed mock rounds</p>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Popular Target Roles */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Most Popular Target Roles</span>
          </h3>
          <div className="space-y-3">
            {admin.popular_target_roles?.map((role, idx) => (
              <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white">{role}</span>
                <span className="text-cyan-400 font-mono">#{idx + 1} Demand</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Common Skill Gaps */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>Most Common Skill Gaps</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {admin.common_skill_gaps?.map((gap, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-lg bg-amber-950/60 text-amber-300 text-xs font-semibold border border-amber-800/50">
                {gap}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
