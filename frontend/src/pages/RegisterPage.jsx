import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, AlertCircle, Navigation, CheckCircle2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { detectLiveLocation } from '../utils/locationService';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    coordinates: null,
    googleMapsUrl: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);
  const [locationError, setLocationError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLiveLocation = async () => {
    setDetectingLocation(true);
    setLocationError('');
    try {
      const res = await detectLiveLocation();
      setFormData((prev) => ({
        ...prev,
        street: res.address.street || prev.street,
        city: res.address.city || prev.city,
        state: res.address.state || prev.state,
        postalCode: res.address.postalCode || prev.postalCode,
        coordinates: { lat: res.latitude, lng: res.longitude },
        googleMapsUrl: res.googleMapsUrl,
      }));
      setLocationInfo({
        city: res.address.city,
        state: res.address.state,
        latitude: res.latitude,
        longitude: res.longitude,
        googleMapsUrl: res.googleMapsUrl,
      });
    } catch (err) {
      setLocationError(err.message || 'Could not fetch live location.');
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          coordinates: formData.coordinates || undefined,
          googleMapsUrl: formData.googleMapsUrl || '',
        },
      });

      navigate(redirect.startsWith('/') ? redirect : `/${redirect}`);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-botanical-700 text-white flex items-center justify-center mx-auto text-xl shadow-soft">
          🌱
        </div>
        <h1 className="font-serif text-3xl font-semibold text-botanical-900">
          Create Your Member Account
        </h1>
        <p className="text-xs text-stone-500">
          Join the conscious botanical community to track orders and save favorites
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Elena Vance"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="elena@example.com"
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Password (min 6 characters) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
              />
            </div>
          </div>

          {/* Optional Delivery Address */}
          <div className="pt-2 border-t border-earth-100 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Default Shipping Address (Optional)
              </span>
              <button
                type="button"
                onClick={handleGetLiveLocation}
                disabled={detectingLocation}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-botanical-800 bg-botanical-100/80 hover:bg-botanical-200 border border-botanical-300 px-3 py-1 rounded-xl transition-all shadow-sm active:scale-95 disabled:bg-stone-100"
                title="Detect GPS coordinates and auto-fill address"
              >
                <Navigation className={`w-3.5 h-3.5 ${detectingLocation ? 'animate-spin text-botanical-600' : 'text-botanical-700'}`} />
                <span>{detectingLocation ? 'Detecting GPS...' : '📍 Auto-Detect Live Location'}</span>
              </button>
            </div>

            {locationInfo && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl text-[11px] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>
                    <strong>Live Location:</strong> {locationInfo.city}, {locationInfo.state}
                  </span>
                </div>
                {locationInfo.googleMapsUrl && (
                  <a
                    href={locationInfo.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-900 underline font-semibold flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>Maps Pin</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            )}

            {locationError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>{locationError}</span>
              </div>
            )}

            <div>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street Address, Apt / Suite"
                className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
              />
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-botanical-700 hover:bg-botanical-800 active:scale-95 text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-card disabled:bg-stone-300 mt-4"
        >
          <span>{loading ? 'Creating Account...' : 'Register & Join'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-stone-500">
            Already have an account?{' '}
            <Link
              to={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="font-bold text-botanical-700 hover:underline"
            >
              Sign In Instead
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
