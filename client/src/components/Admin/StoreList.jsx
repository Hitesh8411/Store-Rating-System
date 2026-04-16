// client/src/components/Admin/StoreList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, ArrowUp, ArrowDown, MapPin, Mail, Star, Store as StoreIcon } from 'lucide-react';
import { getApiUrl } from '../../utils/api';

const StoreList = ({ onAddClick, hideHeader = false }) => {
  const { token } = useAuth();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStores(); }, [search, sortBy, order]);

  const fetchStores = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/admin/stores?search=${search}&sortBy=${sortBy}&order=${order}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStores(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleSort = (field) => {
    if (sortBy === field) setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setOrder('ASC'); }
  };

  const StarRow = ({ value, size = 14 }) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} strokeWidth={2}
          fill={value >= i ? '#0070cc' : 'none'}
          className={value >= i ? 'text-ps-blue' : 'text-[#cccccc]'}
        />
      ))}
    </div>
  );

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return order === 'ASC' ? <ArrowUp size={12} className="text-ps-blue" /> : <ArrowDown size={12} className="text-ps-blue" />;
  };

  const cols = [
    { label: 'Name', id: 'name', grow: true },
    { label: 'Email', id: 'email' },
    { label: 'Address', id: 'address' },
    { label: 'Rating', id: 'overall_rating' },
  ];

  return (
    <div className="bg-white">
      {/* Toolbar */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 border-b border-[#f3f3f3]">
          <h3 className="text-ps-black uppercase tracking-widest text-xl font-bold">Stores</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search resources..."
                className="ps-input py-2 text-sm w-72"
                style={{ paddingLeft: '3.5rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f3f3]">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-8 py-6">
                    <div className="h-6 bg-surface rounded-full w-full" />
                  </td>
                </tr>
              ))
            ) : stores.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-muted text-sm font-medium italic">
                  No stores matching " {search} " found in database.
                </td>
              </tr>
            ) : stores.map((store) => (
              <tr key={store.id} className="hover:bg-surface/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-ps-blue/5 border border-ps-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-ps-blue/10 transition-colors">
                      <StoreIcon size={20} className="text-ps-blue opacity-60 group-hover:opacity-100" />
                    </div>
                    <div>
                      <p className="font-bold text-ps-black leading-tight mb-1 group-hover:text-ps-blue transition-colors">
                         {store.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-muted">
                  <span className="flex items-center gap-1.5"><Mail size={12} /> {store.email}</span>
                </td>
                <td className="px-8 py-5 text-sm text-muted">
                  <div className="flex items-start gap-2 max-w-xs">
                    <MapPin size={14} className="flex-shrink-0 mt-0.5 opacity-40" />
                    <span className="truncate">{store.address}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <StarRow value={Math.round(store.overall_rating)} />
                    <span className="text-sm font-bold text-ps-blue tabular-nums">
                      {store.overall_rating > 0 ? Number(store.overall_rating).toFixed(1) : '—'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreList;
