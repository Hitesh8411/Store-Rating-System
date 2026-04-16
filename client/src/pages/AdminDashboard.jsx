// client/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Store, Star, LayoutGrid, UserCog, PlusCircle } from 'lucide-react';
import { getApiUrl } from '../utils/api';
import StoreList from '../components/Admin/StoreList';
import UserList from '../components/Admin/UserList';
import AddStoreModal from '../components/Admin/AddStoreModal';
import AddUserModal from '../components/Admin/AddUserModal';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [activeTab, setActiveTab] = useState('stores');
  const [loading, setLoading] = useState(true);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(getApiUrl('/api/admin/stats'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* SECTION 1: DARK HERO (STATS) */}
      <section className="ps-section-dark pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto animate-fade-up">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h1 className="text-white uppercase tracking-widest mb-2 font-light">System Control</h1>
              <p className="text-white/40 text-lg">Central management interface for PlayStation Ratings</p>
            </div>
            <div className="flex gap-4">
               <button onClick={() => setShowStoreModal(true)} className="btn-ps-primary text-sm py-2 group">
                 <PlusCircle size={16} className="group-hover:scale-[1.2] transition-transform" /> Add Store
               </button>
               <button onClick={() => setShowUserModal(true)} className="btn-ps-commerce text-sm py-2 group">
                 <PlusCircle size={16} className="group-hover:scale-[1.2] transition-transform" /> Add User
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Network Users', value: stats.totalUsers, icon: Users, accent: 'bg-ps-blue' },
              { label: 'Verified Stores', value: stats.totalStores, icon: Store, accent: 'bg-ps-cyan' },
              { label: 'Global Ratings', value: stats.totalRatings, icon: Star, accent: 'bg-ps-orange' }
            ].map((s, i) => (
              <div key={i} className="ps-card-dark border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">{s.label}</p>
                   <p className="text-5xl font-display font-light text-white">
                     {loading ? '...' : s.value}
                   </p>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${s.accent} flex items-center justify-center shadow-lg group-hover:scale-[1.1] transition-transform`}>
                  <s.icon size={26} className="text-white" strokeWidth={1.5} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: WHITE CONTENT (TABLES) */}
      <section className="ps-section-light flex-grow py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-[#f3f3f3] mb-10 overflow-x-auto">
            {[
              { id: 'stores', label: 'Store Management', icon: LayoutGrid },
              { id: 'users', label: 'User Directory', icon: UserCog }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-ps-blue text-ps-blue'
                    : 'border-transparent text-muted hover:text-ps-black hover:bg-surface'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="ps-card p-0 overflow-hidden min-h-[500px]">
            {activeTab === 'stores' ? (
              <StoreList onAddClick={() => setShowStoreModal(true)} />
            ) : (
              <UserList onAddClick={() => setShowUserModal(true)} />
            )}
          </div>
        </div>
      </section>

      {/* Shared Footer matches UserDashboard */}
      <footer className="bg-ps-blue text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 500 500" className="text-white fill-current">
              <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="40" fill="none" />
              <path d="M250,110L390,350H110L250,110z" fill="none" stroke="currentColor" strokeWidth="40" strokeLinejoin="round" />
            </svg>
            <span className="font-display font-light text-lg tracking-widest uppercase">Admin System</span>
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-widest">
            Sony Entertainment Interaction © 2026
          </p>
        </div>
      </footer>

      {showStoreModal && (
        <AddStoreModal
          onClose={() => setShowStoreModal(false)}
          onSuccess={() => { setShowStoreModal(false); fetchStats(); }}
        />
      )}
      {showUserModal && (
        <AddUserModal
          onClose={() => setShowUserModal(false)}
          onSuccess={() => { setShowUserModal(false); fetchStats(); }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
