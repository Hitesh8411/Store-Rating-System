// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { getApiUrl } from '../utils/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      login(data.user, data.token);
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'owner') navigate('/owner');
      else navigate('/stores');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ps-section-dark flex flex-col items-center justify-center p-6 bg-ps-black">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-12 text-center">
          <svg width="60" height="60" viewBox="0 0 500 500" className="text-ps-blue fill-current mx-auto mb-6">
            <path d="M112.5,416.7c-27.6,0-50-22.4-50-50s22.4-50,50-50s50,22.4,50,50S140.1,416.7,112.5,416.7z M112.5,333.3c-18.4,0-33.3,14.9-33.3,33.3s14.9,33.3,33.3,33.3s33.3-14.9,33.3-33.3S130.9,333.3,112.5,333.3z" />
            <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="40" fill="none" />
            <path d="M250,110L390,350H110L250,110z" fill="none" stroke="currentColor" strokeWidth="40" strokeLinejoin="round" />
          </svg>
          <h1 className="text-3xl font-display font-light text-white mb-2 uppercase tracking-widest">Sign In</h1>
          <p className="text-white/40 text-sm">Join the PlayStation Ratings community</p>
        </div>

        <div className="bg-[#1a1b1c] rounded-xl p-8 shadow-hero border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-widest text-white/60">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="email"
                  required
                  className="ps-input-dark ps-input-icon focus:border-ps-blue"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-widest text-white/60">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  className="ps-input-dark ps-input-icon pr-11 focus:border-ps-blue"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-danger text-sm font-bold bg-danger/10 p-3 rounded-xs border border-danger/20">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-ps-primary w-full h-14 mt-4">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={20} /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm mb-4">New to PlayStation Ratings?</p>
            <Link to="/signup">
              <button className="btn-ps-ghost w-full">Create Account</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
