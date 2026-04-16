import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Star, Search, MapPin, Mail, Store as StoreIcon, TrendingUp } from 'lucide-react';
import { getApiUrl } from '../utils/api';
import RatingModal from '../components/RatingModal';

const UserDashboard = () => {
  const { token, user } = useAuth();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => { fetchStores(); }, [search]);

  const fetchStores = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/user/stores?search=${search}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStores(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const StarRating = ({ value, size = 16 }) => (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} strokeWidth={2}
          fill={value >= i ? '#0070cc' : 'none'}
          className={value >= i ? 'text-ps-blue' : 'text-[#cccccc]'}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* SECTION 1: DARK HERO */}
      <section className="ps-section-dark pt-12 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center animate-fade-up">
          <h1 className="mb-4 uppercase tracking-widest text-white">Browser Stores</h1>
          <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto">
            Hello, {user?.name?.split(' ')[0]}. Discover and rate the best stores in the PlayStation ecosystem.
          </p>
          
          <div className="relative max-w-3xl mx-auto group">
            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-ps-blue transition-colors" />
            <input
              type="text"
              placeholder="Search by store name, address, or email..."
              className="w-full bg-white/10 border border-white/20 rounded-full pl-16 pr-6 py-5 text-lg text-white placeholder:text-white/30 focus:outline-none focus:border-ps-blue focus:bg-ps-black transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: WHITE CONTENT */}
      <section className="ps-section-light flex-grow py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-ps-black uppercase tracking-wider text-2xl font-bold">Featured Retailers</h2>
            <div className="bg-ps-blue/10 text-ps-blue px-4 py-1.5 rounded-full font-bold text-sm tracking-wide">
              {stores.length} STORES AVAILABLE
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="ps-card h-80 animate-pulse bg-surface-2" />
              ))}
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-32 bg-surface rounded-xl border border-[#f3f3f3]">
              <StoreIcon size={64} className="text-[#cccccc] mx-auto mb-6 opacity-40" strokeWidth={1} />
              <h3 className="text-ps-black mb-2">No results found</h3>
              <p className="text-muted">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {stores.map((store, idx) => (
                <div
                  key={store.id}
                  className="group relative flex flex-col animate-fade-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Card Container */}
                  <div className="ps-card flex-grow hover:shadow-grid hover:border-ps-blue/20 transition-all cursor-pointer overflow-hidden p-0"
                       onClick={() => setSelectedStore(store)}>
                    {/* Placeholder image aspect ratio */}
                    <div className="aspect-[16/9] bg-ps-black relative overflow-hidden">
                       <div className="absolute inset-0 flex items-center justify-center">
                          <StoreIcon size={48} className="text-white/20" strokeWidth={1} />
                       </div>
                       {store.user_rating && (
                         <div className="absolute top-4 left-4 bg-ps-blue text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                           Your Rating: {store.user_rating}★
                         </div>
                       )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-ps-blue uppercase tracking-widest">Store Profile</span>
                        <StarRating value={Math.round(store.overall_rating)} />
                      </div>
                      <h3 className="text-xl font-bold text-ps-black mb-4 group-hover:text-ps-blue transition-colors truncate">
                        {store.name}
                      </h3>
                      <div className="space-y-2 mb-6">
                        <p className="text-sm text-muted flex items-center gap-2">
                          <MapPin size={14} className="opacity-60" /> <span className="truncate">{store.address}</span>
                        </p>
                        <p className="text-sm text-muted flex items-center gap-2">
                          <Mail size={14} className="opacity-60" /> <span className="truncate">{store.email}</span>
                        </p>
                      </div>
                      
                      <button className="btn-ps-commerce w-full py-2.5 text-sm uppercase tracking-widest group-hover:scale-[1.1] transition-transform">
                        {store.user_rating ? 'Edit Your Rating' : 'Rate Store Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ps-blue text-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div>
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
               <svg width="24" height="24" viewBox="0 0 500 500" className="text-white fill-current">
                <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="40" fill="none" />
                <path d="M250,110L390,350H110L250,110z" fill="none" stroke="currentColor" strokeWidth="40" strokeLinejoin="round" />
              </svg>
              <h2 className="text-xl font-display font-light text-white tracking-widest">PLAYSTATION RATINGS</h2>
            </div>
            <p className="text-white/60 text-sm max-w-sm">
              The official platform for rating and reviewing your favorite electronics retailers and gaming hubs.
            </p>
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-white/80">
            <span className="hover:text-white cursor-pointer transition-colors">About</span>
            <span className="hover:text-white cursor-pointer transition-colors">Legal</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-[10px] text-white/40 uppercase tracking-widest text-center">
          © 2026 Store Rating Inc. All trademarks property of their respective owners.
        </div>
      </footer>

      {selectedStore && (
        <RatingModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
          onSubmit={() => { setSelectedStore(null); fetchStores(); }}
        />
      )}
    </div>
  );
};

export default UserDashboard;
