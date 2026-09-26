import React, { useState } from 'react';
import { assistantAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Send,
  Brain,
  BookOpen,
  User,
  Bot,
  Terminal
} from 'lucide-react';

export default function AIAssistantPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your CareerMind RAG Assistant. I am configured with your Career DNA profile for ${profile?.target_role || 'AI Engineer'}. How can I guide your career prep today?`,
      sources: []
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Am I ready for an AI Engineer internship?",
    "What should I learn next?",
    "Improve my resume summary.",
    "Give me a project for my missing PyTorch skill."
  ];

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    try {
      const res = await assistantAPI.chat(text);
      const assistantMessage = {
        role: 'assistant',
        content: res.data.response,
        sources: res.data.retrieved_sources || []
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-80px)]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>RAG CAREER KNOWLEDGE SYSTEM</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">AI Career Assistant</h1>
        </div>
        <div className="text-right text-xs">
          <span className="text-gray-400">Context: </span>
          <span className="font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            {profile?.target_role || 'AI Engineer'}
          </span>
        </div>
      </div>

      {/* Quick Prompts Chips */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-gray-800 hover:border-cyan-500/50 text-xs text-gray-300 hover:text-white transition-all text-left"
          >
            💬 "{qp}"
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 glass-panel rounded-2xl border border-gray-800 p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
              m.role === 'user'
                ? 'bg-indigo-600/30 border border-indigo-500/40 text-white'
                : 'bg-slate-900/90 border border-gray-800 text-gray-200'
            }`}>
              <p className="whitespace-pre-line">{m.content}</p>

              {m.sources?.length > 0 && (
                <div className="pt-2 border-t border-gray-800/80 flex items-center space-x-2 text-[10px] text-cyan-400 font-mono">
                  <BookOpen className="w-3 h-3" />
                  <span>Grounded Knowledge Citation: {m.sources.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3 text-xs text-gray-400 font-mono">
            <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Retrieving vector embeddings & composing response...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex space-x-3">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about your career path, resume, or PyTorch skill gaps..."
          className="flex-1 bg-slate-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputMsg.trim()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
