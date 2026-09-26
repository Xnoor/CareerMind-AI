import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Target, Award, Sparkles, Check, ArrowRight } from 'lucide-react';

const TARGET_ROLES = [
  'AI Engineer',
  'ML Engineer',
  'Data Scientist',
  'Data Analyst',
  'Python Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Engineer',
  'Data Engineer',
  'Computer Vision Engineer',
  'NLP Engineer',
];

const PRESET_SKILLS = [
  'Python', 'Machine Learning', 'FastAPI', 'React', 'SQL', 'PyTorch',
  'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'Docker', 'PostgreSQL',
  'JavaScript', 'TypeScript', 'Node.js', 'Git', 'AWS', 'RAG', 'LLM'
];

export default function OnboardingPage() {
  const { profile, updateProfileData } = useAuth();
  const navigate = useNavigate();

  const [targetRole, setTargetRole] = useState(profile?.target_role || 'AI Engineer');
  const [customRole, setCustomRole] = useState('');
  const [education, setEducation] = useState(profile?.education || 'Master of Computer Applications (MCA)');
  const [experienceLevel, setExperienceLevel] = useState(profile?.experience_level || 'Entry Level');
  const [yearsOfExperience, setYearsOfExperience] = useState(profile?.years_of_experience || 0.5);
  const [selectedSkills, setSelectedSkills] = useState(profile?.skills || ['Python', 'Machine Learning', 'FastAPI']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !selectedSkills.includes(newSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const finalRole = targetRole === 'Custom' ? customRole || 'Software Engineer' : targetRole;

    try {
      await updateProfileData({
        target_role: finalRole,
        education,
        experience_level: experienceLevel,
        years_of_experience: parseFloat(yearsOfExperience),
        skills: selectedSkills,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update onboarding profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-card text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            <span>STEP 1 OF 1: CAREER DNA SETUP</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Select Your Target Role & Skills</h1>
          <p className="text-gray-400 text-xs mt-2 max-w-xl mx-auto">
            CareerMind AI uses this profile to generate your customized Skill Gap analysis, 6-Month Roadmap, and AI Mock Interview questions.
          </p>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-800 space-y-8">
          
          {/* Target Role Selection */}
          <div>
            <label className="block text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Select Target Career Role</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TARGET_ROLES.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setTargetRole(role)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                    targetRole === role
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                  }`}
                >
                  <span>{role}</span>
                  {targetRole === role && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Experience & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-800/80">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Education / Degree</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Master of Computer Applications (MCA)"
                className="w-full bg-slate-900 border border-gray-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-slate-900 border border-gray-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Entry Level">Entry Level / Fresh Graduate (0-1 yrs)</option>
                <option value="Intermediate">Intermediate Developer (1-3 yrs)</option>
                <option value="Senior">Senior Professional (3+ yrs)</option>
              </select>
            </div>
          </div>

          {/* Current Skills Selection */}
          <div className="pt-4 border-t border-gray-800/80">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-white flex items-center space-x-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Select Your Existing Skills</span>
              </label>
              <span className="text-xs text-cyan-400 font-mono">{selectedSkills.length} skills selected</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {PRESET_SKILLS.map((skill) => {
                const selected = selectedSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selected
                        ? 'bg-indigo-600/30 text-cyan-300 border-indigo-500/60 shadow-sm'
                        : 'bg-slate-900/80 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {skill} {selected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>

            {/* Custom Skill Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add custom skill (e.g. OpenCV, LangChain)..."
                className="flex-1 bg-slate-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg border border-gray-700"
              >
                Add Skill
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Initializing Career DNA...' : 'Save Profile & Launch Command Center'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>
      </div>
    </div>
  );
}
