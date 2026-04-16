// client/src/components/Admin/UserList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, ArrowUp, ArrowDown, User, Shield, Briefcase, MapPin, Mail, Star, X } from 'lucide-react';
import { getApiUrl } from '../../utils/api';

const UserList = ({ onAddClick, hideHeader = false }) => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [search, sortBy, order]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/admin/users?search=${search}&sortBy=${sortBy}&order=${order}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setOrder('ASC');
    }
  };

  const getRoleBadge = (role) => {
    const roles = {
      admin: { label: 'ADMIN', color: 'bg-ps-orange text-white', icon: Shield },
      owner: { label: 'STORE OWNER', color: 'bg-ps-blue text-white', icon: Briefcase },
      user:  { label: 'MEMBER', color: 'bg-[#cccccc] text-ps-black', icon: User }
    };
    const r = roles[role] || roles.user;
    const Icon = r.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${r.color}`}>
        <Icon size={10} /> {r.label}
      </span>
    );
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return order === 'ASC' ? <ArrowUp size={12} className="text-ps-blue" /> : <ArrowDown size={12} className="text-ps-blue" />;
  };

  const cols = [
    { label: 'Name', id: 'name' },
    { label: 'Email', id: 'email' },
    { label: 'Address', id: 'address' },
    { label: 'Role', id: 'role' },
  ];

  return (
    <div className="bg-white">
      {/* Toolbar */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 border-b border-[#f3f3f3]">
          <h3 className="text-ps-black uppercase tracking-widest text-xl font-bold font-light">User Directory</h3>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search directory..."
              className="ps-input py-2 text-sm w-72"
              style={{ paddingLeft: '3.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#f3f3f3] bg-surface">
              {cols.map((col) => (
                <th
                  key={col.id}
                  onClick={() => toggleSort(col.id)}
                  className="px-8 py-5 text-[10px] font-bold text-muted uppercase tracking-[0.2em] cursor-pointer hover:text-ps-black transition-colors select-none"
                >
                  <div className="flex items-center gap-2">
                    {col.label} <SortIcon field={col.id} />
                  </div>
                </th>
              ))}
              <th className="px-8 py-5 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Store Rating</th>
              <th className="px-8 py-5 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f3f3]">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-8 py-6">
                    <div className="h-6 bg-surface rounded-full w-full" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-muted text-sm font-medium italic">
                  Database query for " {search} " returned zero records.
                </td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-surface/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-ps-black/5 border border-ps-black/5 flex items-center justify-center flex-shrink-0 group-hover:bg-ps-blue/10 group-hover:border-ps-blue/20 transition-all">
                      <User size={20} className="text-muted group-hover:text-ps-blue transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-ps-black leading-tight mb-1 group-hover:text-ps-blue transition-colors">
                         {u.name}
                      </p>
                      <p className="text-xs text-muted flex items-center gap-1.5"><Mail size={12} className="opacity-60" /> {u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-muted">
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} className="opacity-60" /> {u.email}
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-muted">
                  <div className="flex items-start gap-2 max-w-xs">
                    <MapPin size={14} className="flex-shrink-0 mt-0.5 opacity-40" />
                    <span className="truncate">{u.address || 'Not Protocol Tagged'}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  {getRoleBadge(u.role)}
                </td>
                <td className="px-8 py-5">
                  {u.role === 'owner' ? (
                    <div className="flex items-center gap-3">
                       <Star size={14} fill="#0070cc" strokeWidth={2} className="text-ps-blue" />
                       <span className="text-sm font-bold text-ps-blue tabular-nums">{u.store_rating || '0.0'}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-[#cccccc] uppercase tracking-widest">N/A</span>
                  )}
                </td>
                <td className="px-8 py-5">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(u)}
                    className="text-xs font-bold uppercase tracking-widest text-ps-blue hover:text-ps-black transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ps-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-hero border border-[#f3f3f3] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#f3f3f3]">
              <div>
                <h3 className="text-ps-black uppercase tracking-widest text-lg font-bold">User Details</h3>
                <p className="text-xs text-muted uppercase tracking-widest mt-1">Full account profile</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface text-muted hover:text-ps-black transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">Name</p>
                <p className="text-sm text-ps-black font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">Email</p>
                <p className="text-sm text-ps-black font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">Address</p>
                <p className="text-sm text-ps-black font-medium">{selectedUser.address || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">Role</p>
                {getRoleBadge(selectedUser.role)}
              </div>
              {selectedUser.role === 'owner' && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">Store Rating</p>
                  <div className="flex items-center gap-3">
                    <Star size={14} fill="#0070cc" strokeWidth={2} className="text-ps-blue" />
                    <span className="text-sm font-bold text-ps-blue">{selectedUser.store_rating || '0.0'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
