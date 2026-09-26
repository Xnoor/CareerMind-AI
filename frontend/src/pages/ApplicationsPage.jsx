import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../services/api';
import {
  ListTodo,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  CheckCircle2,
  Briefcase
} from 'lucide-react';

const STATUSES = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Saved');
  const [notes, setNotes] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [editingApp, setEditingApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await applicationAPI.getApplications();
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleSaveApp = async (e) => {
    e.preventDefault();
    try {
      if (editingApp) {
        await applicationAPI.updateApplication(editingApp.id, {
          company, role, status, notes, job_url: jobUrl, next_action: nextAction
        });
      } else {
        await applicationAPI.createApplication({
          company, role, status, notes, job_url: jobUrl, next_action: nextAction
        });
      }
      setShowModal(false);
      resetForm();
      fetchApplications();
    } catch (err) {
      console.error('Error saving application:', err);
    }
  };

  const handleDeleteApp = async (id) => {
    try {
      await applicationAPI.deleteApplication(id);
      fetchApplications();
    } catch (err) {
      console.error('Error deleting application:', err);
    }
  };

  const resetForm = () => {
    setCompany('');
    setRole('');
    setStatus('Saved');
    setNotes('');
    setJobUrl('');
    setNextAction('');
    setEditingApp(null);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setCompany(app.company);
    setRole(app.role);
    setStatus(app.status);
    setNotes(app.notes || '');
    setJobUrl(app.job_url || '');
    setNextAction(app.next_action || '');
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <ListTodo className="w-4 h-4" />
            <span>JOB APPLICATION TRACKER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Application Pipeline</h1>
          <p className="text-xs text-gray-400 mt-1">
            Track your target job applications, interviews, offers, and next follow-up actions.
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-gray-800 text-center">
          <span className="text-xs text-gray-400 block">Total Tracked</span>
          <span className="text-2xl font-extrabold text-white mt-1">{applications.length}</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-gray-800 text-center">
          <span className="text-xs text-gray-400 block">Applied</span>
          <span className="text-2xl font-extrabold text-cyan-400 mt-1">
            {applications.filter(a => a.status === 'Applied').length}
          </span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-gray-800 text-center">
          <span className="text-xs text-gray-400 block">Interviews</span>
          <span className="text-2xl font-extrabold text-indigo-400 mt-1">
            {applications.filter(a => a.status === 'Interview').length}
          </span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-gray-800 text-center">
          <span className="text-xs text-gray-400 block">Offers</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1">
            {applications.filter(a => a.status === 'Offer').length}
          </span>
        </div>
      </div>

      {/* Kanban / Table View */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 font-mono uppercase tracking-wider">
                <th className="pb-3 font-semibold">Company & Role</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Next Action</th>
                <th className="pb-3 font-semibold">Applied Date</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-4">
                    <p className="font-bold text-white">{app.role}</p>
                    <p className="text-gray-400 text-[11px]">{app.company}</p>
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                      app.status === 'Offer' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                      app.status === 'Interview' ? 'bg-indigo-950 text-cyan-300 border-indigo-800' :
                      app.status === 'Assessment' ? 'bg-violet-950 text-violet-300 border-violet-800' :
                      'bg-slate-900 text-gray-300 border-gray-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-300">{app.next_action || 'None set'}</td>
                  <td className="py-4 text-gray-400 font-mono">{new Date(app.applied_date).toLocaleDateString()}</td>
                  <td className="py-4 text-right space-x-2">
                    <button onClick={() => openEditModal(app)} className="p-1.5 text-gray-400 hover:text-white">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteApp(app.id)} className="p-1.5 text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">{editingApp ? 'Edit Application' : 'Add New Application'}</h3>

            <form onSubmit={handleSaveApp} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-900 border border-gray-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-gray-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-gray-800 rounded-lg p-2.5 text-white"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Next Action</label>
                <input
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  placeholder="e.g., Prepare system design demo"
                  className="w-full bg-slate-900 border border-gray-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-800 text-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-lg">Save Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
