import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { skillsAPI, matchingAPI, roadmapAPI, applicationAPI } from '../services/api';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from 'recharts';
import {
  Brain,
  Target,
  FileCheck,
  Dna,
  Briefcase,
  MessageSquareCode,
  Map,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ListTodo
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [dnaData, setDnaData] = useState(null);
  const [skillGaps, setSkillGaps] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dnaRes, gapRes, roadRes, appRes] = await Promise.all([
        skillsAPI.getCareerDNA(),
        skillsAPI.getSkillGaps(),
        roadmapAPI.getRoadmap(),
        applicationAPI.getApplications()
      ]);
      setDnaData(dnaRes.data);
      setSkillGaps(gapRes.data);
      setRoadmap(roadRes.data);
      setApplications(appRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const targetRole = profile?.target_role || dnaData?.target_role || 'AI Engineer';
  const readinessScore = dnaData?.readiness_score || 78.0;

  const appStats = {
    applied: applications.filter(a => a.status === 'Applied').length,
    interviews: applications.filter(a => a.status === 'Interview').length,
    offers: applications.filter(a => a.status === 'Offer').length,
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner Header */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>CAREER COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Good morning, <span className="electric-gradient-text">{user?.name || 'Developer'}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
            <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-gray-800 text-gray-300 font-semibold">
              Target Role: <strong className="text-cyan-400">{targetRole}</strong>
            </span>
            <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-gray-800 text-gray-300">
              Stage: <strong className="text-indigo-400">{dnaData?.career_readiness_stage || 'Learning & Building'}</strong>
            </span>
          </div>
        </div>

        {/* Readiness Badge Ring */}
        <div className="flex items-center space-x-4 bg-slate-950/80 p-4 rounded-xl border border-gray-800 shadow-inner">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" className="text-slate-800" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-cyan-400 transition-all duration-1000"
                fill="transparent"
                strokeDasharray="163"
                strokeDashoffset={163 - (163 * readinessScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">{readinessScore}%</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Career Readiness</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">+4% vs last week</span>
          </div>
        </div>
      </div>

      {/* 4 Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-xl border border-gray-800 relative">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Career DNA Score</span>
            <Dna className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{readinessScore}%</p>
          <p className="text-[11px] text-gray-400 mt-1">Calculated from user profile & skills</p>
        </div>

        <div className="glass-card p-5 rounded-xl border border-gray-800 relative">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Resume Health</span>
            <FileCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">82.5%</p>
          <p className="text-[11px] text-emerald-400 mt-1">High ATS formatting & keyword match</p>
        </div>

        <div className="glass-card p-5 rounded-xl border border-gray-800 relative">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Job Compatibility</span>
            <Briefcase className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">74.0%</p>
          <p className="text-[11px] text-gray-400 mt-1">Average across target job postings</p>
        </div>

        <div className="glass-card p-5 rounded-xl border border-gray-800 relative">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Interview Readiness</span>
            <MessageSquareCode className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">68.0%</p>
          <p className="text-[11px] text-cyan-400 mt-1">Technical explanation depth score</p>
        </div>

      </div>

      {/* Main Grid: Radar Chart + Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Radar Skill Visualization (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Dna className="w-5 h-5 text-cyan-400" />
                <span>Career DNA Skill Graph</span>
              </h2>
              <p className="text-xs text-gray-400">Radar mapping across technical dimensions vs {targetRole} baseline.</p>
            </div>
            <Link to="/skill-gaps" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center space-x-1">
              <span>View Skill Gaps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full">
            {dnaData?.radar_data ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={dnaData.radar_data}>
                  <PolarGrid stroke="#1F2937" />
                  <PolarAngleAxis dataKey="category" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#374151" />
                  <Radar name="Your Score" dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.4} />
                  <Radar name="Role Target" dataKey="target" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-xs">Loading Radar Graph...</div>
            )}
          </div>
        </div>

        {/* Top Skill Gaps (1 col) */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Top Skill Gaps</span>
              </h2>
              <span className="text-[11px] text-amber-400 font-mono font-semibold">Action Required</span>
            </div>

            <div className="space-y-3">
              {skillGaps?.priority_skills?.slice(0, 4).map((skill, idx) => (
                <div key={idx} className="bg-slate-900/90 p-3 rounded-xl border border-gray-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{skill.name}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Priority #{skill.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{skill.why_it_matters}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800/80">
            <Link
              to="/roadmap"
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
            >
              <Map className="w-4 h-4" />
              <span>Start Priority Skill Roadmap</span>
            </Link>
          </div>
        </div>

      </div>

      {/* AI Recommendation Banner */}
      <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-950 to-slate-950 relative">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>AI CAREER RECOMMENDATION</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded">EXPLAINABLE ML</span>
            </h3>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              "Your next highest-priority skill to master is <strong className="text-cyan-300">{skillGaps?.priority_skills?.[0]?.name || 'PyTorch'}</strong> because it appears frequently in over 70% of analyzed target {targetRole} roles and will directly boost your job match score."
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Job Matches + Interview Practice + App Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recent Job Matches */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Target Role Matches</span>
            </h3>
            <Link to="/job-match" className="text-xs text-cyan-400 hover:underline">Match Engine</Link>
          </div>

          <div className="space-y-3">
            {[
              { role: 'AI Engineer (LLM & RAG)', company: 'Cognitive Cloud AI', match: '82%' },
              { role: 'Machine Learning Engineer', company: 'DataPulse Analytics', match: '76%' },
              { role: 'Junior Python Developer', company: 'Nexus Web Systems', match: '71%' },
            ].map((j, idx) => (
              <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-gray-800/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{j.role}</p>
                  <p className="text-[11px] text-gray-400">{j.company}</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/40">
                  {j.match}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Mock Interview Practice */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <MessageSquareCode className="w-4 h-4 text-violet-400" />
              <span>Interview Practice</span>
            </h3>
            <span className="text-xs text-gray-400">Last Score: 78%</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Take an AI Mock Interview session tailored to {targetRole} technical concepts and behavioral STAR frameworks.
          </p>
          <Link
            to="/interview"
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 font-bold text-xs border border-violet-500/40 transition-all"
          >
            <span>Continue AI Interview</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Job Application Tracker Stats */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ListTodo className="w-4 h-4 text-emerald-400" />
              <span>Application Tracker</span>
            </h3>
            <Link to="/applications" className="text-xs text-cyan-400 hover:underline">Tracker</Link>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center my-2">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-gray-800">
              <span className="text-lg font-bold text-white">{appStats.applied}</span>
              <span className="block text-[10px] text-gray-400">Applied</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-gray-800">
              <span className="text-lg font-bold text-cyan-400">{appStats.interviews}</span>
              <span className="block text-[10px] text-gray-400">Interviews</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-gray-800">
              <span className="text-lg font-bold text-emerald-400">{appStats.offers}</span>
              <span className="block text-[10px] text-gray-400">Offers</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
