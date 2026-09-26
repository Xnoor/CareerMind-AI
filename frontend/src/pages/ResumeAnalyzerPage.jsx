import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  Layers,
  Wand2,
  FileCheck2,
  HelpCircle,
  FileUp
} from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [improvingSection, setImprovingSection] = useState(false);
  const [improvementResult, setImprovementResult] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await resumeAPI.getResumes();
      setResumes(res.data);
      if (res.data.length > 0) {
        setSelectedResume(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const res = await resumeAPI.uploadResume(file);
      setResumes([res.data, ...resumes]);
      setSelectedResume(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload and parse resume file.');
    } finally {
      setUploading(false);
    }
  };

  const handleImproveBullet = async () => {
    try {
      setImprovingSection(true);
      const res = await resumeAPI.improveSection({
        target_role: 'AI Engineer',
        section: 'summary'
      });
      setImprovementResult(res.data);
    } catch (err) {
      console.error('Error improving section:', err);
    } finally {
      setImprovingSection(false);
    }
  };

  const structured = selectedResume?.structured_data || {};
  const breakdown = selectedResume?.ats_breakdown || {};

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <FileText className="w-4 h-4" />
            <span>AI RESUME INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Resume Parser & Quality Analyzer</h1>
          <p className="text-xs text-gray-400 mt-1">
            Extracts technical skills, experience, and calculates a transparent CareerMind ATS-style quality breakdown.
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all">
          <UploadCloud className="w-4 h-4" />
          <span>{uploading ? 'Parsing File...' : 'Upload Resume (PDF/DOCX/TXT)'}</span>
          <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedResume ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ATS Score Breakdown Header */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">CareerMind ATS-Style Score</span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-4xl font-extrabold text-white">{selectedResume.ats_score}</span>
                  <span className="text-sm text-gray-400">/ 100</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  *Label: CareerMind ATS-style analysis. Evaluates keyword coverage, section completeness, action verb density, and formatting.
                </p>
              </div>

              {/* Progress Ring / Category breakdown */}
              <div className="w-full sm:w-auto grid grid-cols-2 gap-3 text-left">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Skills Coverage</span>
                  <span className="text-sm font-bold text-cyan-400">{breakdown.skill_coverage || 25} / 25</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Section Completeness</span>
                  <span className="text-sm font-bold text-indigo-400">{breakdown.section_completeness || 25} / 25</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Action Verbs & Impact</span>
                  <span className="text-sm font-bold text-violet-400">{breakdown.action_verbs_and_impact || 25} / 25</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Contact & Format</span>
                  <span className="text-sm font-bold text-emerald-400">{breakdown.formatting_and_contact || 25} / 25</span>
                </div>
              </div>
            </div>

            {/* Extracted Sections Card */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
              
              {/* Contact & Basic Info */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2 border-b border-gray-800/80 pb-2">
                  <FileCheck2 className="w-4 h-4 text-cyan-400" />
                  <span>Resume Overview</span>
                </h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block">Detected Name</span>
                    <span className="font-semibold text-white">{structured.name || 'Not detected'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Email Address</span>
                    <span className="font-semibold text-white">{structured.email || 'Not detected'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Phone Number</span>
                    <span className="font-semibold text-white">{structured.phone || 'Not detected'}</span>
                  </div>
                </div>
              </div>

              {/* Extracted Skills */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2 border-b border-gray-800/80 pb-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>Detected Technical Skills</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {structured.skills?.length > 0 ? (
                    structured.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600/20 text-cyan-300 border border-indigo-500/30">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">Not detected</span>
                  )}
                </div>
              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-300 mb-2">Education Section</h4>
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-gray-800 text-xs text-gray-300 whitespace-pre-line font-mono">
                    {structured.education || 'Not detected'}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-300 mb-2">Experience Section</h4>
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-gray-800 text-xs text-gray-300 whitespace-pre-line font-mono">
                    {structured.experience || 'Not detected'}
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="text-xs font-bold text-gray-300 mb-2">Projects Section</h4>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-gray-800 text-xs text-gray-300 whitespace-pre-line font-mono">
                  {structured.projects || 'Not detected'}
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar: Suggestions & AI Improver (1 col) */}
          <div className="space-y-6">
            
            {/* Suggestions Card */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Improvement Suggestions</span>
              </h3>

              <div className="space-y-3">
                {selectedResume.improvement_suggestions?.map((sug, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-3 rounded-xl border border-gray-800 text-xs text-gray-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Resume Bullet Improver */}
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Wand2 className="w-4 h-4 text-violet-400" />
                  <span>AI Resume Summary Improver</span>
                </h3>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Generates a quantified, action-verb-rich professional summary tailored for AI Engineer roles.
              </p>

              <button
                onClick={handleImproveBullet}
                disabled={improvingSection}
                className="w-full py-2.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 text-xs font-bold border border-violet-500/40 transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{improvingSection ? 'Generating...' : 'Generate Improved Summary'}</span>
              </button>

              {improvementResult && (
                <div className="mt-4 bg-slate-900 p-3.5 rounded-xl border border-gray-800 text-xs space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Generated Improved Output</span>
                  <p className="text-gray-200 leading-relaxed font-sans">{improvementResult.improved_text}</p>
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl border border-gray-800 text-center max-w-xl mx-auto">
          <FileUp className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-white">No Resume Uploaded Yet</h2>
          <p className="text-xs text-gray-400 mt-2 mb-6">
            Upload your resume PDF or DOCX file to run NLP skill extraction and view your transparent ATS quality score breakdown.
          </p>
          <label className="cursor-pointer inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25">
            <UploadCloud className="w-4 h-4" />
            <span>Select Resume File</span>
            <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

    </div>
  );
}
