// client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, LogOut, KeyRound, ChevronDown, User } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!user) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ps-black text-white px-6">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <svg width="32" height="32" viewBox="0 0 500 500" className="text-white fill-current">
              <path d="M112.5,416.7c-27.6,0-50-22.4-50-50s22.4-50,50-50s50,22.4,50,50S140.1,416.7,112.5,416.7z M112.5,333.3c-18.4,0-33.3,14.9-33.3,33.3s14.9,33.3,33.3,33.3s33.3-14.9,33.3-33.3S130.9,333.3,112.5,333.3z" />
              <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="40" fill="none" />
              <path d="M250,110L390,350H110L250,110z" fill="none" stroke="currentColor" strokeWidth="40" strokeLinejoin="round" />
            </svg>
            <span className="font-display font-light text-xl tracking-tight">
              PlayStation <span className="opacity-60 text-lg">Ratings</span>
            </span>
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 py-2 px-3 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
            >
              <div className="w-8 h-8 rounded-full bg-ps-blue flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold leading-none">{user.name?.split(' ')[0]}</p>
                <p className="text-[10px] uppercase tracking-wider opacity-60 mt-0.5">{user.role}</p>
              </div>
              <ChevronDown size={14} className={`opacity-60 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white text-ps-black rounded-md shadow-grid overflow-hidden z-20 animate-fade-up border border-[#f3f3f3]">
                  <div className="px-4 py-3 bg-[#f5f7fa] border-b border-[#f3f3f3]">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => { setShowMenu(false); setShowPwModal(true); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-[#f5f7fa] rounded-sm transition-colors text-ps-black"
                    >
                      <KeyRound size={14} className="text-muted" />
                      Change Password
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-danger/5 rounded-sm transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="h-16" />

      {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)} />}
    </>
  );
};

export default Navbar;
