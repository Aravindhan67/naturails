import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role !== 'admin') {
        setError('Access Denied: This account does not possess administrator privileges.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-botanical-900 text-cream-light flex items-center justify-center mx-auto shadow-card border border-botanical-700">
          <ShieldCheck className="w-7 h-7 text-botanical-300" />
        </div>
        <span className="text-[10px] uppercase tracking-widest font-bold text-botanical-800 bg-botanical-100 px-3 py-1 rounded-full">
          Store Operations Only
        </span>
        <h1 className="font-serif text-3xl font-bold text-botanical-900">
          Administrative Gateway
        </h1>
        <p className="text-xs text-stone-500">
          Restricted access for store managers, inventory control, and order fulfillment
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-card space-y-5">
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">
            Admin Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@naturalis.com"
              className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">
            Secret Admin Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-botanical-900 hover:bg-botanical-800 active:scale-95 text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-card disabled:bg-stone-300"
        >
          <span>{loading ? 'Verifying Admin Privileges...' : 'Access Admin Dashboard'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-botanical-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Storefront</span>
          </Link>
        </div>
      </form>
    </div>
  );
};
