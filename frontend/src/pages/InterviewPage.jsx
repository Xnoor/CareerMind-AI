import React, { useState, useEffect } from 'react';
import { interviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquareCode,
  Sparkles,
  Award,
  Play,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Terminal,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export default function InterviewPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('mock'); // mock, coding
  
  // Mock Interview State
  const [targetRole, setTargetRole] = useState(profile?.target_role || 'AI Engineer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [interviewType, setInterviewType] = useState('Technical');
  
  const [interviewSession, setInterviewSession] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evalResult, setEvalResult] = useState(null);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Coding Challenges State
  const [codingChallenges, setCodingChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [codingResult, setCodingResult] = useState(null);
  const [runningCode, setRunningCode] = useState(false);

  useEffect(() => {
    fetchCodingChallenges();
  }, []);

  const fetchCodingChallenges = async () => {
    try {
      const res = await interviewAPI.getCodingChallenges();
      setCodingChallenges(res.data);
      if (res.data.length > 0) {
        setSelectedChallenge(res.data[0]);
        setUserCode(res.data[0].starter_code);
      }
    } catch (err) {
      console.error('Error fetching coding challenges:', err);
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    setInterviewCompleted(false);
    setFinalReport(null);
    setCurrentQuestionIdx(0);
    try {
      const res = await interviewAPI.startInterview({
        target_role: targetRole,
        difficulty,
        interview_type: interviewType
      });
      setInterviewSession(res.data);
      setUserAnswer('');
      setEvalResult(null);
    } catch (err) {
      console.error('Error starting interview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!interviewSession) return;
    const currentQ = interviewSession.questions[currentQuestionIdx];
    try {
      setLoading(true);
      const res = await interviewAPI.submitAnswer(interviewSession.interview_id, {
        question_id: currentQ.id,
        user_answer: userAnswer
      });
      setEvalResult(res.data);
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < interviewSession.questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setUserAnswer('');
      setEvalResult(null);
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    try {
      setLoading(true);
      const res = await interviewAPI.getResults(interviewSession.interview_id);
      setFinalReport(res.data);
      setInterviewCompleted(true);
    } catch (err) {
      console.error('Error finishing interview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCoding = async () => {
    if (!selectedChallenge) return;
    setRunningCode(true);
    try {
      const res = await interviewAPI.submitCoding({
        challenge_id: selectedChallenge.id,
        code: userCode
      });
      setCodingResult(res.data);
    } catch (err) {
      console.error('Error running code:', err);
    } finally {
      setRunningCode(false);
    }
  };

  const currentQ = interviewSession?.questions?.[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <MessageSquareCode className="w-4 h-4" />
            <span>AI MOCK INTERVIEW & ASSESSMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Role-Adaptive Mock Interview</h1>
          <p className="text-xs text-gray-400 mt-1">
            Practice technical & behavioral questions or run sandboxed coding challenges.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 p-1.5 rounded-xl border border-gray-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('mock')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'mock' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            AI Mock Interview
          </button>
          <button
            onClick={() => setActiveTab('coding')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'coding' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Coding Assessment
          </button>
        </div>
      </div>

      {/* Tab 1: AI Mock Interview Simulator */}
      {activeTab === 'mock' && (
        <div className="space-y-6">
          
          {/* Interview Config Setup Header if not active */}
          {!interviewSession && !interviewCompleted && (
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Configure Interview Session</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-slate-900 border border-gray-800 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-slate-900 border border-gray-800 rounded-lg p-2.5 text-xs text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Interview Type</label>
                    <select
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                      className="w-full bg-slate-900 border border-gray-800 rounded-lg p-2.5 text-xs text-white"
                    >
                      <option value="Technical">Technical Round</option>
                      <option value="HR">HR / Behavioral</option>
                      <option value="Mixed">Mixed Comprehensive</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleStartInterview}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{loading ? 'Generating Session...' : 'Start AI Interview Session'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Question Screen */}
          {interviewSession && !interviewCompleted && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-800 space-y-6 max-w-3xl mx-auto">
              
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <span className="text-xs font-mono text-cyan-400">
                  Question {currentQuestionIdx + 1} of {interviewSession.questions.length}
                </span>
                <span className="text-xs font-mono bg-slate-900 px-2.5 py-1 rounded text-gray-300 border border-gray-800">
                  Category: {currentQ?.category}
                </span>
              </div>

              {/* Question Text */}
              <div className="bg-slate-900/90 p-5 rounded-xl border border-gray-800">
                <p className="text-base font-bold text-white leading-relaxed">{currentQ?.question_text}</p>
              </div>

              {/* User Answer Textarea */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Your Answer</label>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Explain your technical solution, trade-offs, architecture, or experience using clear concepts..."
                  className="w-full bg-slate-900 border border-gray-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
                />
              </div>

              {/* Submit & Next Controls */}
              {!evalResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={loading || !userAnswer.trim()}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all"
                >
                  {loading ? 'Evaluating Answer...' : 'Submit & Evaluate Answer'}
                </button>
              ) : (
                <div className="space-y-4">
                  
                  {/* Evaluation Feedback */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-gray-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400">AI Evaluation Feedback</span>
                      <span className="text-sm font-extrabold text-white">Score: {evalResult.score}%</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-950 p-2.5 rounded border border-gray-800">
                        <span className="text-gray-400 block">Relevance Score</span>
                        <span className="font-bold text-emerald-400">{evalResult.relevance_score}%</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded border border-gray-800">
                        <span className="text-gray-400 block">Technical Depth</span>
                        <span className="font-bold text-cyan-400">{evalResult.technical_depth}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{evalResult.feedback}</p>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{currentQuestionIdx + 1 < interviewSession.questions.length ? 'Next Question' : 'View Final Interview Performance Report'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>
              )}

            </div>
          )}

          {/* Post-Interview Final Performance Analysis */}
          {interviewCompleted && finalReport && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-800 space-y-6 max-w-3xl mx-auto">
              
              <div className="text-center border-b border-gray-800 pb-6">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">FINAL PERFORMANCE ANALYSIS</span>
                <h2 className="text-3xl font-extrabold text-white mt-1">Interview Overall Score: {finalReport.overall_score}%</h2>
                <p className="text-xs text-gray-400 mt-1">Suggested Next Level: <strong className="text-cyan-400">{finalReport.next_recommended_level}</strong></p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Technical Depth</span>
                  <span className="text-sm font-bold text-cyan-400">{finalReport.technical_score}%</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Relevance</span>
                  <span className="text-sm font-bold text-indigo-400">{finalReport.answer_relevance}%</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Concept Coverage</span>
                  <span className="text-sm font-bold text-violet-400">{finalReport.concept_coverage}%</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-gray-800">
                  <span className="text-[10px] text-gray-400 block">Communication</span>
                  <span className="text-sm font-bold text-emerald-400">{finalReport.communication_score}%</span>
                </div>
              </div>

              {/* Strong vs Weak Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Strong Areas</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-300">
                    {finalReport.strong_areas?.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Concepts to Revise</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-300">
                    {finalReport.concepts_to_revise?.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setInterviewSession(null)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Another Mock Interview</span>
              </button>

            </div>
          )}

        </div>
      )}

      {/* Tab 2: Sandboxed Coding Assessment */}
      {activeTab === 'coding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Challenge Selector & Description (1 col) */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-2">Select Coding Challenge</h3>

            <div className="space-y-2">
              {codingChallenges.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedChallenge(c); setUserCode(c.starter_code); setCodingResult(null); }}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedChallenge?.id === c.id
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                      : 'bg-slate-900/60 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <p className="font-bold text-white">{c.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{c.category} • {c.difficulty}</p>
                </button>
              ))}
            </div>

            {selectedChallenge && (
              <div className="bg-slate-900/90 p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
                <span className="font-bold text-white block">{selectedChallenge.title}</span>
                <p className="text-gray-300 leading-relaxed font-sans">{selectedChallenge.problem_statement}</p>
              </div>
            )}
          </div>

          {/* Code Editor & Output (2 cols) */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 flex items-center space-x-2">
                <Code2 className="w-4 h-4" />
                <span>SANDBOXED PYTHON EVALUATOR</span>
              </span>

              <button
                onClick={handleRunCoding}
                disabled={runningCode}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{runningCode ? 'Evaluating...' : 'Run Code'}</span>
              </button>
            </div>

            {/* Code Textarea */}
            <textarea
              rows={12}
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full bg-slate-950 border border-gray-800 rounded-xl p-4 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />

            {/* Execution Result Terminal */}
            {codingResult && (
              <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-gray-400 text-[11px] border-b border-gray-800 pb-2">
                  <span className="flex items-center space-x-1.5 text-cyan-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Execution Output</span>
                  </span>
                  <span className={`font-bold ${codingResult.status === 'Passed' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {codingResult.status} ({codingResult.passed_test_cases}/{codingResult.total_test_cases} test cases passed)
                  </span>
                </div>
                
                <pre className="text-gray-300 text-[11px] whitespace-pre-wrap">{codingResult.stdout}</pre>
                <p className="text-xs text-gray-400 pt-1 font-sans">{codingResult.feedback}</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
