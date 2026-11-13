import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-botanical-200 border-t-botanical-800 rounded-full animate-spin" />
        <span className="text-xs font-semibold text-stone-500">Verifying administrative credentials...</span>
      </div>
    );
  }

  // Not signed in at all -> redirect to Admin Login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Signed in, but standard customer account (not admin) -> strictly forbid
  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600 shadow-soft">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-rose-700 bg-rose-100/70 px-3 py-1 rounded-full">
            403 Forbidden • Access Restricted
          </span>
          <h1 className="font-serif text-3xl font-bold text-botanical-900">
            Administrative Portal Only
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            This dashboard is strictly reserved for store owners and authorized inventory personnel. 
            Your current logged-in account (<strong>{user?.email}</strong>) does not have administrative privileges.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-botanical-700 hover:bg-botanical-800 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-card"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>

          <Link
            to="/admin/login"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-earth-100 text-botanical-900 border border-earth-300 px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-soft"
          >
            <Lock className="w-4 h-4" />
            <span>Switch to Admin Account</span>
          </Link>
        </div>
      </div>
    );
  }

  // Authorized Admin -> render protected dashboard
  return children;
};
