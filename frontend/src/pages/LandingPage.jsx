import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  FileSearch,
  Target,
  Dna,
  Map,
  MessageSquareCode,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronDown
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does CareerMind AI calculate my Career DNA?',
      a: 'CareerMind AI parses your resume skills, experience, and projects using NLP and compares them against target role benchmarks (e.g., AI Engineer, ML Engineer). It generates a radar profile mapping your technical strengths and skill gaps.'
    },
    {
      q: 'Is my resume data kept private and secure?',
      a: 'Yes. Uploaded files are processed in isolated text extraction pipelines, parsed strictly as data to prevent prompt injection, and protected under JWT authentication.'
    },
    {
      q: 'How does the AI Mock Interview system evaluate my answers?',
      a: 'The system evaluates your answers based on observable criteria: technical depth, keyword concept coverage, answer relevance, and communication indicators, without scientific psychological claims.'
    },
    {
      q: 'Can I use CareerMind AI out-of-the-box without external API keys?',
      a: 'Absolutely! The application features a robust local intelligent LLM provider abstraction layer and TF-IDF/Sentence Embeddings fallback, so all features run out-of-the-box.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 selection:bg-cyan-500 selection:text-black">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Glowing Gradient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-violet-600/20 blur-[130px] rounded-full pointer-events-none animate-glow" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass-card border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner shadow-cyan-500/10">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI-POWERED CAREER INTELLIGENCE PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Build Skills. Find Direction. <br />
            <span className="electric-gradient-text">Get Career Ready.</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-300 font-normal leading-relaxed mb-10">
            An AI-powered career intelligence platform that analyzes your skills, matches you with opportunities, identifies gaps and builds a personalized path toward your target role.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/auth?mode=register"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <FileSearch className="w-5 h-5" />
              <span>Analyze My Resume</span>
            </Link>
            <Link
              to="/auth?mode=register"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-xl glass-card text-gray-200 hover:text-white hover:border-cyan-500/50 font-semibold text-base transition-all"
            >
              <span>Explore Career Paths</span>
              <ArrowRight className="w-5 h-5 text-cyan-400" />
            </Link>
          </div>

          {/* Platform Preview Banner */}
          <div className="mt-16 max-w-5xl mx-auto glass-panel rounded-2xl p-4 sm:p-6 border border-gray-800 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4 text-xs font-mono text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 text-gray-300 font-semibold">CAREER COMMAND CENTER v1.0</span>
              </div>
              <span className="text-cyan-400 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>AI MATCH ENGINE ACTIVE</span>
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-400">Career DNA Score</p>
                <p className="text-2xl font-bold text-cyan-400 mt-1">78% Ready</p>
                <p className="text-[11px] text-gray-400 mt-1">Target: AI Engineer</p>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-400">ATS Quality Score</p>
                <p className="text-2xl font-bold text-indigo-400 mt-1">82.5 / 100</p>
                <p className="text-[11px] text-emerald-400 mt-1">High Keyword Match</p>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-xl border border-gray-800">
                <p className="text-xs text-gray-400">Top Skill Gap</p>
                <p className="text-2xl font-bold text-violet-400 mt-1">PyTorch & RAG</p>
                <p className="text-[11px] text-cyan-400 mt-1">Month 3 Roadmap Focus</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 border-t border-gray-800/60 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">How CareerMind AI Works</h2>
            <p className="text-gray-400 mt-3 text-base">A continuous intelligent operating system loop tailored to your career trajectory.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Profile & Resume Analysis', desc: 'Upload your resume (PDF/DOCX). NLP extracts skills, projects, education, and ATS score.' },
              { step: '02', title: 'Career DNA & Skill Gaps', desc: 'Generate a radar profile matching your skills against target role benchmarks like AI Engineer.' },
              { step: '03', title: 'Personalized Roadmap', desc: 'Receive a month-by-month actionable roadmap with practice projects and priority topics.' },
              { step: '04', title: 'AI Mock Interview & Prep', desc: 'Practice role-adaptive interview questions and coding challenges with instant evaluation.' },
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-6 rounded-xl border border-gray-800 relative">
                <span className="text-4xl font-extrabold text-indigo-500/20 block mb-3 font-mono">{item.step}</span>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 border-t border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">PRODUCTION-STYLE ARCHITECTURE</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Comprehensive Career Intelligence Suite</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="glass-card p-6 rounded-2xl border border-gray-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-5 border border-cyan-500/20">
                <Dna className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Career DNA Profile</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Interactive radial skill visualization mapping technical strengths, experience level, domain interests, and job-readiness stage.
              </p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Radar charts across 6 tech dimensions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Transparent readiness scoring</span>
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-gray-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-5 border border-indigo-500/20">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Job Matching Engine</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Compares your resume against job descriptions using TF-IDF & text embeddings cosine similarity, skill coverage, and experience alignment.
              </p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Transparent match score breakdown</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Semantic search over sample roles</span>
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-gray-800">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-5 border border-violet-500/20">
                <MessageSquareCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Mock Interview Simulator</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Adaptive interview questions matching your target role and difficulty, with observable evaluation of technical depth and clarity.
              </p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400" />
                  <span>Technical, HR & Mixed rounds</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400" />
                  <span>Sandboxed Coding Challenge runner</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-gray-800/60 bg-slate-950/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card rounded-xl border border-gray-800 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-white hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-gray-300 leading-relaxed border-t border-gray-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-800/60 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            Ready to Launch Your AI & Engineering Career?
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join students, fresh graduates, and developers using CareerMind AI to master priority skills and land top roles.
          </p>
          <Link
            to="/auth?mode=register"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all"
          >
            <span>Launch Career Command Center</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
