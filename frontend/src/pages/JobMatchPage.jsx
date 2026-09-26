import React, { useState, useEffect } from 'react';
import { jobAPI, matchingAPI } from '../services/api';
import {
  Briefcase,
  Target,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  ArrowRight,
  GitCompare,
  Sliders
} from 'lucide-react';

export default function JobMatchPage() {
  const [activeTab, setActiveTab] = useState('match'); // match, search, compare
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pastedJobText, setPastedJobText] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Job Comparison State
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (search = '') => {
    try {
      const res = await jobAPI.getJobs(search);
      setJobs(res.data);
      if (res.data.length > 0 && !selectedJob) {
        setSelectedJob(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleRunMatch = async () => {
    setLoadingMatch(true);
    try {
      const payload = selectedJob
        ? { job_description_id: selectedJob.id }
        : { raw_job_text: pastedJobText };

      const res = await matchingAPI.analyzeMatch(payload);
      setMatchResult(res.data);
    } catch (err) {
      console.error('Error running job match:', err);
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(searchQuery);
  };

  const toggleCompareJob = (jobId) => {
    if (selectedForCompare.includes(jobId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== jobId));
    } else {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, jobId]);
      }
    }
  };

  const handleRunComparison = async () => {
    if (selectedForCompare.length < 2) return;
    try {
      const res = await jobAPI.compareJobs(selectedForCompare);
      setComparisonResult(res.data);
    } catch (err) {
      console.error('Error comparing jobs:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Briefcase className="w-4 h-4" />
            <span>AI JOB MATCHING ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Job Compatibility & Semantic Search</h1>
          <p className="text-xs text-gray-400 mt-1">
            Uses TF-IDF & Text Embeddings cosine similarity to calculate transparent job compatibility scores.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-900 p-1.5 rounded-xl border border-gray-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('match')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'match' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Match Analyzer
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'search' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Semantic Search
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'compare' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Job Comparison
          </button>
        </div>
      </div>

      {/* Tab 1: Match Analyzer */}
      {activeTab === 'match' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Options (1 col) */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-2">1. Select or Paste Job Description</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Select Sample Job Posting</label>
              <div className="space-y-2">
                {jobs.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => { setSelectedJob(j); setPastedJobText(''); }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedJob?.id === j.id && !pastedJobText
                        ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                        : 'bg-slate-900/60 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <p className="font-bold text-white">{j.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{j.company} • {j.location}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">OR Paste Raw Job Description</label>
              <textarea
                rows={5}
                value={pastedJobText}
                onChange={(e) => { setPastedJobText(e.target.value); setSelectedJob(null); }}
                placeholder="Paste requirements, responsibilities, and required skills here..."
                className="w-full bg-slate-900 border border-gray-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <button
              onClick={handleRunMatch}
              disabled={loadingMatch}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loadingMatch ? 'Computing Embeddings...' : 'Calculate Job Compatibility'}</span>
            </button>
          </div>

          {/* Match Results View (2 cols) */}
          <div className="lg:col-span-2">
            {matchResult ? (
              <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
                
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-800">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">JOB COMPATIBILITY SCORE</span>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-4xl font-extrabold text-white">{matchResult.overall_score}%</span>
                      <span className="text-xs text-gray-400">Match Compatibility</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Target Role: <strong className="text-white">{matchResult.job_title}</strong> at {matchResult.company}
                    </p>
                  </div>

                  {/* Component Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center w-full sm:w-auto">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-800">
                      <span className="text-[10px] text-gray-400 block">Skill Coverage</span>
                      <span className="text-sm font-bold text-cyan-400">{matchResult.skill_coverage}%</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-800">
                      <span className="text-[10px] text-gray-400 block">Semantic Sim.</span>
                      <span className="text-sm font-bold text-indigo-400">{matchResult.semantic_similarity}</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-800">
                      <span className="text-[10px] text-gray-400 block">Exp. Alignment</span>
                      <span className="text-sm font-bold text-emerald-400">{matchResult.experience_alignment}%</span>
                    </div>
                  </div>
                </div>

                {/* Explainability Card */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Explainable AI Match Insight</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{matchResult.explanation}</p>
                </div>

                {/* Matched vs Missing Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-gray-800">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center space-x-2 mb-3">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Matched Skills You Have</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.matched_skills?.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 text-xs font-semibold border border-emerald-800/50">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-xl border border-gray-800">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center space-x-2 mb-3">
                      <XCircle className="w-4 h-4" />
                      <span>Missing Required Skills</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.missing_skills?.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 text-xs font-semibold border border-amber-800/50">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="glass-panel p-12 rounded-2xl border border-gray-800 text-center">
                <Target className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">Run AI Job Matching</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                  Select a job description on the left or paste a new job posting to compute your transparent compatibility score breakdown.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Semantic Search */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <form onSubmit={handleSearchSubmit} className="flex space-x-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs semantically e.g. 'AI jobs involving Python and NLP'..."
                className="w-full bg-slate-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20"
            >
              Search Roles
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((j) => (
              <div key={j.id} className="glass-card p-5 rounded-2xl border border-gray-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{j.title}</h3>
                    <p className="text-xs text-cyan-400">{j.company} • {j.location}</p>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-900 px-2 py-1 rounded text-gray-400 border border-gray-800">
                    {j.experience_required}
                  </span>
                </div>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{j.description_text}</p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-800/60">
                  {j.required_skills?.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-gray-300 text-[10px] border border-gray-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Factual Job Comparison */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-sm font-bold text-white mb-2">Select 2 or 3 Jobs to Compare</h3>
            <p className="text-xs text-gray-400 mb-4">Choose jobs from the list below to run a factual comparison of required skills and responsibilities.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {jobs.map((j) => {
                const selected = selectedForCompare.includes(j.id);
                return (
                  <button
                    key={j.id}
                    onClick={() => toggleCompareJob(j.id)}
                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                      selected
                        ? 'bg-indigo-600/30 border-indigo-500 text-cyan-300'
                        : 'bg-slate-900/60 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <p className="font-bold text-white">{j.title}</p>
                    <p className="text-[10px] text-gray-400">{j.company}</p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleRunComparison}
              disabled={selectedForCompare.length < 2}
              className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs"
            >
              Compare Selected Jobs
            </button>
          </div>

          {comparisonResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comparisonResult.jobs?.map((cj) => (
                <div key={cj.id} className="glass-card p-5 rounded-2xl border border-gray-800 space-y-4">
                  <h4 className="text-base font-bold text-white">{cj.title}</h4>
                  <p className="text-xs text-cyan-400">{cj.company}</p>
                  
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Required Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {cj.required_skills?.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-xs text-cyan-300 border border-gray-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Required Experience</span>
                    <p className="text-xs text-gray-300 font-mono">{cj.experience_required}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
