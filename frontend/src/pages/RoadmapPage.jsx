import React, { useState, useEffect } from 'react';
import { roadmapAPI } from '../services/api';
import {
  Map,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  Code,
  FolderGit2,
  Check
} from 'lucide-react';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await roadmapAPI.getRoadmap();
      setRoadmap(res.data);
    } catch (err) {
      console.error('Error fetching roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId, currentStatus) => {
    const nextStatus =
      currentStatus === 'Not Started'
        ? 'In Progress'
        : currentStatus === 'In Progress'
        ? 'Completed'
        : 'Not Started';

    try {
      await roadmapAPI.updateItemStatus(itemId, nextStatus);
      fetchRoadmap();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const completedCount = roadmap?.items?.filter(i => i.status === 'Completed').length || 0;
  const progressPct = roadmap?.items?.length ? Math.round((completedCount / roadmap.items.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Map className="w-4 h-4" />
            <span>PERSONALIZED CAREER ROADMAP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{roadmap?.title || '6-Month Career Roadmap'}</h1>
          <p className="text-xs text-gray-400 mt-1">
            Tailored month-by-month actionable learning objectives, practice projects, and status tracking.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-gray-800 flex items-center space-x-4 min-w-[220px]">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 font-bold text-sm">
            {progressPct}%
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Roadmap Completion</span>
            <span className="text-[11px] text-gray-400">{completedCount} of {roadmap?.items?.length || 6} months done</span>
          </div>
        </div>
      </div>

      {/* 6-Month Timeline List */}
      <div className="space-y-6">
        {roadmap?.items?.map((item) => {
          const isDone = item.status === 'Completed';
          const isInProg = item.status === 'In Progress';

          return (
            <div
              key={item.id || item.month}
              className={`glass-panel p-6 rounded-2xl border transition-all ${
                isDone
                  ? 'border-emerald-500/40 bg-slate-950/60'
                  : isInProg
                  ? 'border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                  : 'border-gray-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/80 pb-4">
                
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm border ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : isInProg
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                      : 'bg-slate-900 text-gray-400 border-gray-800'
                  }`}>
                    M{item.month}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-white">{item.skill}</h3>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.why_it_matters}</p>
                  </div>
                </div>

                {/* Status Toggle Button */}
                <button
                  onClick={() => handleStatusChange(item.id, item.status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                      : isInProg
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/30'
                      : 'bg-slate-900 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4" />}
                  <span>Status: {item.status}</span>
                </button>

              </div>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-gray-800/80 space-y-1">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                    <FolderGit2 className="w-4 h-4" />
                    <span>Practice Project Idea</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed font-sans">{item.project_idea}</p>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-gray-800/80 space-y-1">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                    <Code className="w-4 h-4" />
                    <span>Practice Task</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed font-sans">{item.practice_task}</p>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
