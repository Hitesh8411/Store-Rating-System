// client/src/components/Admin/AddUserModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, UserPlus, Mail, Lock, User, MapPin, ShieldCheck, Briefcase } from 'lucide-react';
import { getApiUrl } from '../../utils/api';

const AddUserModal = ({ onClose, onSuccess }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/admin/users'), {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Identity creation failed');
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ps-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-hero animate-fade-up border border-[#f3f3f3] overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between border-b border-[#f3f3f3]">
          <div>
            <h2 className="text-ps-black uppercase tracking-widest text-lg font-bold">Identity Provisioning</h2>
            <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Register New Network Participant</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface text-muted hover:text-ps-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Participant Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted opacity-60" />
                <input
                  type="text"
                  required
                  className="ps-input text-sm"
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="Min. 20 characters"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Communication Link (Email)</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted opacity-60" />
                  <input
                    type="email"
                    required
                    className="ps-input text-sm"
                    style={{ paddingLeft: '3.5rem' }}
                    placeholder="user@network.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Security Key (Password)</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted opacity-60" />
                  <input
                    type="password"
                    required
                    className="ps-input text-sm"
                    style={{ paddingLeft: '3.5rem' }}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Geographic Tag (Address)</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted opacity-60" />
              <input
                type="text"
                className="ps-input text-sm"
                style={{ paddingLeft: '3.5rem' }}
                placeholder="Optional street address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Privilege Level Assignment</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'user',  label: 'Member',  icon: User,      color: 'border-ps-blue/10 text-muted' },
                { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'border-ps-orange/10 text-muted' },
                { id: 'owner', label: 'Owner', icon: Briefcase,   color: 'border-ps-blue/10 text-muted' },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.id })}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                    formData.role === role.id
                      ? (role.id === 'admin' ? 'bg-ps-orange/10 border-ps-orange/40 text-ps-orange' : 'bg-ps-blue/10 border-ps-blue/40 text-ps-blue')
                      : 'bg-surface border-[#f3f3f3] opacity-60 hover:opacity-100 hover:border-muted'
                  }`}
                >
                  <role.icon size={18} />
                  <span className="text-[9px] uppercase font-bold tracking-[0.2em]">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-danger/5 border border-danger/10 p-4 text-danger text-[11px] font-bold uppercase tracking-widest text-center italic">
              Access Denied: {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-ps-ghost flex-1 py-3 text-sm font-bold uppercase tracking-widest">
              Abort
            </button>
            <button type="submit" disabled={loading} className="btn-ps-primary flex-1 py-3 text-sm uppercase tracking-widest shadow-lg">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus size={18} /> Provision Access</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
