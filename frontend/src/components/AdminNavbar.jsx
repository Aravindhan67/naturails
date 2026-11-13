import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, ExternalLink, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-botanical-900 text-cream-light border-b border-botanical-800 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Admin Portal Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-botanical-800 text-cream-light flex items-center justify-center border border-botanical-700 shadow-soft">
              <ShieldCheck className="w-5 h-5 text-botanical-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-white">
                  Naturalis Operations
                </span>
                <span className="bg-botanical-800 border border-botanical-700 text-botanical-200 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Admin Only
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-cream-dark/70">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>MongoDB Atlas Cluster0 Active</span>
              </div>
            </div>
          </div>

          {/* Right Admin Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-botanical-200 hover:text-white bg-botanical-800/80 hover:bg-botanical-800 border border-botanical-700 px-3.5 py-2 rounded-xl transition-colors"
              title="Open Public Customer Storefront in New Tab"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-2.5 bg-botanical-950/60 border border-botanical-800 px-3 py-1.5 rounded-2xl">
              <div className="w-7 h-7 rounded-full bg-botanical-700 text-cream-light flex items-center justify-center text-xs font-bold">
                A
              </div>
              <div className="hidden md:block text-left pr-1">
                <span className="block text-xs font-bold text-white leading-tight">
                  {user?.name || 'Store Administrator'}
                </span>
                <span className="block text-[10px] text-cream-dark/60 leading-tight">
                  {user?.email || 'admin@naturalis.com'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
              title="Sign Out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
