import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirect.startsWith('/') ? redirect : `/${redirect}`);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-botanical-700 text-white flex items-center justify-center mx-auto text-xl shadow-soft">
          🌿
        </div>
        <h1 className="font-serif text-3xl font-semibold text-botanical-900">
          Customer Sign In
        </h1>
        <p className="text-xs text-stone-500">
          Sign in to your member account to checkout, save addresses & track orders
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-soft space-y-5">
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="elena@example.com"
              className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-botanical-700 hover:bg-botanical-800 active:scale-95 text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-card disabled:bg-stone-300"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In as Customer'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-stone-500">
            Don't have an account yet?{' '}
            <Link
              to={`/register${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="font-bold text-botanical-700 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Discreet link for Store Administrators */}
        <div className="pt-3 border-t border-earth-100 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-[11px] text-stone-500 hover:text-botanical-800 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
            <span>Store Administrator Sign In</span>
          </Link>
        </div>
      </form>
    </div>
  );
};
