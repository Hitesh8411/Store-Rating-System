// client/src/components/ChangePasswordModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, KeyRound, CheckCircle } from 'lucide-react';
import { getApiUrl } from '../utils/api';

const ChangePasswordModal = ({ onClose }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(getApiUrl('/api/auth/update-password'), {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm glass-strong rounded-md overflow-hidden shadow-hero relative animate-fade-up">
        {/* Header */}
        <div className="p-6 pb-2 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ps-blue/20 border border-ps-blue/30 flex items-center justify-center">
              <KeyRound size={20} className="text-ps-cyan" />
            </div>
            <div>
              <h2 className="text-lg font-display font-medium text-white">Change Password</h2>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center animate-fade-in">
             <div className="w-16 h-16 bg-ps-blue/20 border border-ps-blue/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-ps-cyan" />
             </div>
             <p className="font-bold text-white text-lg">Password Changed</p>
             <p className="text-sm text-white/60 mt-1">Returning to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Current Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  required
                  className="input-dark text-sm"
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="••••••••"
                  value={formData.oldPassword}
                  onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">New Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  required
                  className="input-dark text-sm"
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="Min. 8 characters"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-md p-3 text-danger text-xs font-medium">
                {error}
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-all">Cancel</button>
              <button type="submit" disabled={loading} className="btn-ps-primary flex-1 py-3 text-sm flex items-center justify-center gap-2 !px-0">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
