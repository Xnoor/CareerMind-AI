import React from 'react';
import { Brain, Code, Shield, Cpu, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 bg-slate-950 text-gray-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span className="font-extrabold text-white text-base">CAREERMIND AI</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              An advanced AI-powered career intelligence operating system for students, fresh graduates, and tech job seekers.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-cyan-400 font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>Engineered with FastAPI + RAG + PyTorch</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">AI Modules</h4>
            <ul className="space-y-2">
              <li><a href="/resume-analyzer" className="hover:text-cyan-400 transition-colors">Resume Intelligence Engine</a></li>
              <li><a href="/job-match" className="hover:text-cyan-400 transition-colors">Semantic Job Matcher</a></li>
              <li><a href="/skill-gaps" className="hover:text-cyan-400 transition-colors">Career DNA & Skill Gap Analyzer</a></li>
              <li><a href="/roadmap" className="hover:text-cyan-400 transition-colors">Personalized 6-Month Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Practice & Prep</h4>
            <ul className="space-y-2">
              <li><a href="/interview" className="hover:text-cyan-400 transition-colors">AI Mock Interview Simulator</a></li>
              <li><a href="/interview" className="hover:text-cyan-400 transition-colors">Coding Assessment Sandbox</a></li>
              <li><a href="/applications" className="hover:text-cyan-400 transition-colors">Job Application Tracker</a></li>
              <li><a href="/assistant" className="hover:text-cyan-400 transition-colors">RAG AI Career Assistant</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">System Security & Trust</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-lg border border-gray-800">
                <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-[11px] text-gray-300">Untrusted Document Data Isolation & JWT Encrypted Auth</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Suitable for MCA Major Projects, AI/ML Engineering & Full Stack Portfolios.
              </p>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-gray-800/60 flex flex-col md:flex-row items-center justify-between text-gray-400 text-[11px]">
          <p>© 2026 CAREERMIND AI. All rights reserved. Built for Production AI Applications.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Backend API Status: Healthy (v1.0.0)</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
