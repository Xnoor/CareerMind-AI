import React, { useState, useEffect } from 'react';
import { skillsAPI, recommendationAPI } from '../services/api';
import {
  Dna,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Code,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SkillGapPage() {
  const [dna, setDna] = useState(null);
  const [skillGaps, setSkillGaps] = useState(null);
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dnaRes, gapRes, projRes] = await Promise.all([
        skillsAPI.getCareerDNA(),
        skillsAPI.getSkillGaps(),
        recommendationAPI.getProjects()
      ]);
      setDna(dnaRes.data);
      setSkillGaps(gapRes.data);
      setRecommendedProjects(projRes.data.recommendations || []);
    } catch (err) {
      console.error('Error fetching skill gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
          <Dna className="w-4 h-4" />
          <span>CAREER DNA & SKILL GAP ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Target Role Skill Gap Analysis</h1>
        <p className="text-xs text-gray-400 mt-1">
          Benchmarking your profile against target role posting statistics to rank high-priority missing skills.
        </p>
      </div>

      {/* Career DNA Summary Card */}
      {dna && (
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-4 gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">CAREER DNA PROFILE</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{dna.target_role} Benchmark</h2>
              <p className="text-xs text-gray-400">Readiness Stage: <strong className="text-indigo-400">{dna.career_readiness_stage}</strong></p>
            </div>
            <div className="bg-slate-900 px-4 py-3 rounded-xl border border-gray-800 text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Target Role Readiness</span>
              <span className="text-2xl font-extrabold text-cyan-400">{dna.readiness_score}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h3 className="text-xs font-bold text-emerald-400 flex items-center space-x-2 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Technical Strengths (Skills You Have)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {dna.strong_areas?.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 text-xs font-semibold border border-emerald-800/50">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-amber-400 flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Identified Skill Gaps</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {dna.skill_gaps?.map((s, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-amber-950/60 text-amber-300 text-xs font-semibold border border-amber-800/50">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Priority Skills Breakdown Table */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>High-Priority Skill Recommendations</span>
          </h2>
          <span className="text-xs text-gray-400">Ranked by Target Job Market Demand</span>
        </div>

        <div className="space-y-4">
          {skillGaps?.priority_skills?.map((item, idx) => (
            <div key={idx} className="bg-slate-900/90 p-5 rounded-xl border border-gray-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/30">
                    #{item.priority}
                  </span>
                  <h3 className="text-base font-bold text-white">{item.name}</h3>
                </div>
                <span className="text-xs font-semibold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40">
                  {item.importance} Importance
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">{item.why_it_matters}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-800/60 text-xs">
                <div className="flex items-start space-x-2">
                  <BookOpen className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-200 block">Suggested Learning Path</span>
                    <span className="text-gray-400">{item.learning_path}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Code className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-200 block">Suggested Practice Project</span>
                    <span className="text-gray-400">{item.suggested_project}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Portfolio Projects */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Recommended Portfolio Projects</span>
          </h2>
          <Link to="/roadmap" className="text-xs text-cyan-400 hover:underline">View 6-Month Roadmap</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedProjects.map((p) => (
            <div key={p.id} className="glass-card p-5 rounded-xl border border-gray-800 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-bold text-white">{p.title}</h3>
                <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {p.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{p.description}</p>
              
              <div className="flex flex-wrap gap-1.5 pt-2">
                {p.skills_demonstrated?.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-indigo-300 text-[10px] border border-gray-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
