// client/src/components/Admin/AddStoreModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Send, Store, MapPin, Mail, User } from 'lucide-react';
import { getApiUrl } from '../../utils/api';

const AddStoreModal = ({ onClose, onSuccess }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', address: '', ownerEmail: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/admin/stores'), {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Entity registration failed');
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
            <h2 className="text-ps-black uppercase tracking-widest text-lg font-bold">Resource Provisioning</h2>
            <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Register New Store Entity</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface text-muted hover:text-ps-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Entity Designation</label>
              <div className="relative">
                <Store size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted opacity-60" />
                <input
                  type="text"
                  required
                  className="ps-input text-sm"
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="Official Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Comms Channel</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted opacity-60" />
                <input
                  type="email"
                  required
                  className="ps-input text-sm"
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="store@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Physical Coordinates</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted opacity-60" />
              <input
                type="text"
                required
                className="ps-input text-sm"
                style={{ paddingLeft: '3.5rem' }}
                placeholder="Full Street Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Authorized Operator (Owner Email)</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted opacity-60" />
              <input
                type="email"
                required
                className="ps-input text-sm"
                style={{ paddingLeft: '3.5rem' }}
                placeholder="Must be an existing Store Owner account"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
              />
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
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={16} /> Deploy Entity</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreModal;
