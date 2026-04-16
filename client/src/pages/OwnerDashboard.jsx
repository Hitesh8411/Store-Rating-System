import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Star, MessageSquare, TrendingUp, Calendar, Mail, User, Store as StoreIcon } from 'lucide-react';
import { getApiUrl } from '../utils/api';

const OwnerDashboard = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOwnerData(); }, []);

  const fetchOwnerData = async () => {
    try {
      const res = await fetch(getApiUrl('/api/owner/dashboard'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      setData(result);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const StarRow = ({ value, size = 16 }) => (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} strokeWidth={2}
          fill={value >= i ? '#0070cc' : 'none'}
          className={value >= i ? 'text-ps-blue' : 'text-[#cccccc]'}
        />
      ))}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen ps-section-dark flex items-center justify-center p-6 bg-ps-black">
      <div className="w-10 h-10 border-2 border-white/20 border-t-ps-blue rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* SECTION 1: DARK HERO (STORE INFO) */}
      <section className="ps-section-dark pt-12 pb-24 px-6">
        <div className="max-w-7xl mx-auto animate-fade-up">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-ps-blue flex items-center justify-center shadow-lg border border-white/10">
                <StoreIcon size={32} strokeWidth={1.5} className="text-white" />
              </div>
              <div>
                <h1 className="text-white uppercase tracking-widest mb-2 font-light">{data?.storeName}</h1>
                <p className="text-white/40 text-lg uppercase tracking-wider font-bold text-sm">Official Store Dashboard</p>
              </div>
            </div>

            {/* Stats - Massive Numbers */}
            <div className="flex gap-12">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Total Reviews</p>
                <p className="text-6xl font-display font-light text-white leading-none">{data?.totalRatings}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Network Score</p>
                <div className="flex items-center gap-4">
                   <p className="text-6xl font-display font-light text-ps-blue leading-none">{data?.averageRating?.toFixed(1)}</p>
                   <div className="hidden sm:block">
                      <StarRow value={Math.round(data?.averageRating)} size={20} />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHITE CONTENT (REVIEWS) */}
      <section className="ps-section-light flex-grow py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 border-b border-[#f3f3f3] pb-6">
            <h2 className="text-ps-black uppercase tracking-widest text-2xl font-bold flex items-center gap-4">
              <MessageSquare size={24} className="text-ps-blue" />
              Intelligence Feed
            </h2>
            <span className="text-xs font-bold text-muted uppercase tracking-widest">{data?.ratings?.length} Activity Found</span>
          </div>

          {data?.ratings?.length === 0 ? (
            <div className="text-center py-32 bg-surface rounded-xl border border-[#f3f3f3]">
              <Star size={64} className="text-[#cccccc] mx-auto mb-6 opacity-30" strokeWidth={1} />
              <h3 className="text-ps-black mb-2 uppercase tracking-widest font-light">Zero Feedback Units</h3>
              <p className="text-muted">No communication received from network users yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data?.ratings?.map((rating, idx) => (
                <div
                  key={idx}
                  className="ps-card hover:shadow-grid hover:border-ps-blue/10 transition-all group animate-fade-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-surface border border-[#f3f3f3] flex items-center justify-center group-hover:bg-ps-blue/5 transition-colors">
                        <User size={20} className="text-muted group-hover:text-ps-blue" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ps-black group-hover:text-ps-blue transition-colors">{rating.name}</p>
                        <p className="text-xs text-muted font-medium">{rating.email}</p>
                      </div>
                    </div>
                    <StarRow value={rating.rating_value} />
                  </div>

                  {rating.comment ? (
                    <div className="bg-surface rounded-lg p-5 mb-6 border border-[#f3f3f3] relative">
                      <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold text-ps-blue uppercase tracking-widest">Message</span>
                      <p className="text-sm text-foreground leading-relaxed italic">"{rating.comment}"</p>
                    </div>
                  ) : (
                    <div className="h-4" />
                  )}

                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="opacity-60" />
                      {new Date(rating.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-ps-blue">Verified Transmission</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ps-blue text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
             <svg width="28" height="28" viewBox="0 0 500 500" className="text-white fill-current">
              <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="40" fill="none" />
              <path d="M250,110L390,350H110L250,110z" fill="none" stroke="currentColor" strokeWidth="40" strokeLinejoin="round" />
            </svg>
            <h2 className="text-xl font-display font-light text-white tracking-[0.2em]">OWNER TERMINAL</h2>
          </div>
          <div className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">
            Data provided for commercial analysis only
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OwnerDashboard;
