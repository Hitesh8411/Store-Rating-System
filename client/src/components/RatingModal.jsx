// client/src/components/RatingModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Star, Send, MessageSquare } from 'lucide-react';
import { getApiUrl } from '../utils/api';

const RatingModal = ({ store, onClose, onSubmit }) => {
  const { token } = useAuth();
  const [rating, setRating] = useState(store.user_rating || 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(store.user_comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('A rating value is required to continue.');
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/user/ratings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ storeId: store.id, ratingValue: rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Transmission failed');
      onSubmit();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ps-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-hero animate-fade-up border border-[#f3f3f3]">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between border-b border-[#f3f3f3]">
          <div>
            <h2 className="text-ps-black uppercase tracking-widest text-lg font-bold">Feedback Terminal</h2>
            <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Gating: {store.name}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface text-muted hover:text-ps-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Star Selection */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-[1.3] active:scale-95 duration-200"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={42}
                    strokeWidth={2}
                    fill={(hover || rating) >= star ? '#0070cc' : 'none'}
                    className={(hover || rating) >= star ? 'text-ps-blue' : 'text-[#cccccc]'}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-ps-blue uppercase tracking-[0.2em] h-5">
              {rating === 1 && "Critical Level"}
              {rating === 2 && "Low Level"}
              {rating === 3 && "Standard"}
              {rating === 4 && "High Efficiency"}
              {rating === 5 && "Excellence"}
              {rating === 0 && <span className="text-muted opacity-40 font-normal normal-case italic">Awaiting selection</span>}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] flex items-center gap-2">
              <MessageSquare size={12} className="opacity-60" /> Detailed Transmission (Optional)
            </label>
            <textarea
              className="ps-input min-h-[120px] resize-none text-sm bg-surface/50 border-[#f3f3f3]"
              placeholder="Provide specific details about this entity's performance..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-danger/5 border border-danger/10 p-4 text-danger text-[11px] font-bold uppercase tracking-widest text-center">
              Error: {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-ps-ghost flex-1 py-3 text-sm font-bold uppercase tracking-widest">
              Abort
            </button>
            <button type="submit" disabled={loading} className="btn-ps-commerce flex-1 py-3 text-sm uppercase tracking-widest shadow-lg">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={16} /> Transmit</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
