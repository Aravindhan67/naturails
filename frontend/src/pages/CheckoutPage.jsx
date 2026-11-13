import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  QrCode,
  Building,
  ArrowRight,
  AlertCircle,
  UserCheck,
  CheckCircle,
  MapPin,
  Navigation,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../api/api';
import { detectLiveLocation } from '../utils/locationService';

const INDIAN_STATES = [
  'Tamil Nadu',
  'Karnataka',
  'Maharashtra',
  'Delhi NCR',
  'Kerala',
  'Telangana',
  'Andhra Pradesh',
  'Gujarat',
  'Rajasthan',
  'West Bengal',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Odisha',
  'Assam',
  'Goa',
  'Uttarakhand',
  'Himachal Pradesh',
  'Jammu & Kashmir',
];

export const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, subtotal, shipping, discount, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    street: user?.address?.street || '',
    landmark: '',
    city: user?.address?.city || '',
    state: user?.address?.state || 'Tamil Nadu',
    postalCode: user?.address?.postalCode || '',
    country: 'India',
    coordinates: user?.address?.coordinates || null,
    googleMapsUrl: user?.address?.googleMapsUrl || '',
    paymentMethod: 'UPI',
    upiApp: 'Google Pay',
    upiId: '',
    bankName: 'State Bank of India',
    notes: '',
  });

  const [showQrModal, setShowQrModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);
  const [locationError, setLocationError] = useState('');

  const handleGetLiveLocation = async () => {
    setDetectingLocation(true);
    setLocationError('');
    try {
      const res = await detectLiveLocation();
      const matchedState =
        INDIAN_STATES.find(
          (s) => s.toLowerCase() === (res.address.state || '').toLowerCase()
        ) ||
        res.address.state ||
        formData.state;

      setFormData((prev) => ({
        ...prev,
        street: res.address.street || prev.street,
        landmark: res.address.landmark || prev.landmark,
        city: res.address.city || prev.city,
        state: matchedState,
        postalCode: res.address.postalCode || prev.postalCode,
        coordinates: { lat: res.latitude, lng: res.longitude },
        googleMapsUrl: res.googleMapsUrl,
      }));

      setLocationInfo({
        city: res.address.city,
        state: matchedState,
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

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || '',
        customerEmail: prev.customerEmail || user.email || '',
        customerPhone: prev.customerPhone || user.phone || '',
        street: prev.street || user.address?.street || '',
        city: prev.city || user.address?.city || '',
        state: prev.state || user.address?.state || 'Tamil Nadu',
        postalCode: prev.postalCode || user.address?.postalCode || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      setError('Please provide your complete name, email, and 10-digit mobile number');
      return;
    }

    if (!formData.street || !formData.city || !formData.state || !formData.postalCode) {
      setError('Please provide complete Indian shipping address including 6-digit Pincode');
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(formData.postalCode.trim())) {
      setError('Please provide a valid 6-digit Indian postal Pincode');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: {
          street: formData.landmark ? `${formData.street} (Near ${formData.landmark})` : formData.street,
          landmark: formData.landmark || '',
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: 'India',
          coordinates: formData.coordinates || undefined,
          googleMapsUrl: formData.googleMapsUrl || '',
        },
        paymentMethod: formData.paymentMethod,
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image,
        })),
        notes: formData.notes,
      };

      const result = await api.createOrder(orderPayload);
      clearCart();
      navigate(`/order-success/${result.orderId}`);
    } catch (err) {
      console.error('Order Submission Error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-botanical-900">
          Secure Indian Checkout & Dispatch
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Fast Pan-India delivery via Blue Dart, Delhivery & India Post • GST Invoice Included
        </p>
      </div>

      {/* Authentication Notice if Guest */}
      {!isAuthenticated && (
        <div className="bg-botanical-50 border border-botanical-200 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-botanical-700 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-botanical-900">
                Sign in for 1-Click Saved Addresses & GST Invoices
              </p>
              <p className="text-[11px] text-stone-600">
                Log in to link this order to your account or continue directly as guest.
              </p>
            </div>
          </div>
          <Link
            to="/login?redirect=checkout"
            className="bg-botanical-700 hover:bg-botanical-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            Sign In Before Buying
          </Link>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Details & Address */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Contact */}
          <div className="bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-botanical-900 pb-3 border-b border-earth-100 flex items-center justify-between">
              <span>1. Contact & Dispatch Details</span>
              <span className="text-[11px] font-normal text-stone-400">All fields required</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Aravindhan / Elena"
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Email Address (for GST invoice & tracking) *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  10-Digit Mobile Number (for delivery agent SMS/call) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 bg-earth-100 border border-r-0 border-earth-200 rounded-l-2xl text-xs font-bold text-stone-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    name="customerPhone"
                    value={formData.customerPhone.replace('+91', '').trim()}
                    onChange={handleChange}
                    required
                    placeholder="98765 43210"
                    className="w-full text-xs px-4 py-3 rounded-r-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-earth-100 flex-wrap gap-2">
              <div>
                <h2 className="font-serif text-lg font-bold text-botanical-900">
                  2. Indian Shipping Address
                </h2>
                <span className="text-[11px] font-normal text-stone-400">
                  Pan-India Express Delivery
                </span>
              </div>
              <button
                type="button"
                onClick={handleGetLiveLocation}
                disabled={detectingLocation}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-botanical-800 bg-botanical-100/90 hover:bg-botanical-200/90 border border-botanical-300 px-3.5 py-1.5 rounded-full transition-all shadow-sm active:scale-95 disabled:bg-stone-100"
                title="Detect GPS coordinates and auto-fill address"
              >
                <Navigation
                  className={`w-3.5 h-3.5 ${
                    detectingLocation ? 'animate-spin text-botanical-600' : 'text-botanical-700'
                  }`}
                />
                <span>{detectingLocation ? 'Fetching GPS...' : '📍 Auto-Detect Live Location'}</span>
              </button>
            </div>

            {locationInfo && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-2xl text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    <strong>Live GPS Detected:</strong> {locationInfo.city}, {locationInfo.state} ({locationInfo.latitude.toFixed(4)}, {locationInfo.longitude.toFixed(4)})
                  </span>
                </div>
                {locationInfo.googleMapsUrl && (
                  <a
                    href={locationInfo.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900 whitespace-nowrap flex items-center gap-1"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {locationError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{locationError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Flat / House No., Building, Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  placeholder="Plot 14, Lotus Gardens, 2nd Cross"
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Opposite Shivalaya Temple / Near Metro Pillar 124"
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Coimbatore / Bengaluru"
                    className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    State / UT *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    6-Digit Pincode *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="641001"
                    className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 font-mono tracking-wider"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Indian Payment Facility Selection */}
          <div className="bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-soft space-y-4">
            <h2 className="font-serif text-lg font-bold text-botanical-900 pb-3 border-b border-earth-100 flex items-center justify-between">
              <span>3. Payment Facility (Indian Gateways)</span>
              <span className="text-[11px] text-emerald-700 font-bold">100% Encrypted & Safe</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'UPI',
                  title: 'UPI (GPay / PhonePe / Paytm / QR)',
                  subtitle: 'Instant approval via any UPI App or QR code',
                  icon: QrCode,
                  recommended: true,
                },
                {
                  id: 'COD',
                  title: 'Cash on Delivery (Doorstep COD)',
                  subtitle: 'Pay cash or UPI at delivery doorstep',
                  icon: Banknote,
                },
                {
                  id: 'Credit/Debit Card',
                  title: 'RuPay / Visa / Mastercard',
                  subtitle: 'All Indian debit & credit cards accepted',
                  icon: CreditCard,
                },
                {
                  id: 'NetBanking',
                  title: 'Indian Net Banking',
                  subtitle: 'SBI, HDFC, ICICI, Axis, Kotak, PNB',
                  icon: Building,
                },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = formData.paymentMethod === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-botanical-700 bg-botanical-50/70 shadow-sm'
                        : 'border-earth-200 bg-earth-50/40 hover:bg-earth-100/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={isSelected}
                      onChange={handleChange}
                      className="mt-1 accent-botanical-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-4 h-4 text-botanical-700" />
                          <span className="text-xs font-bold text-botanical-900">
                            {opt.title}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">{opt.subtitle}</p>
                      {opt.recommended && (
                        <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Fastest Checkout
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* UPI Sub-options when UPI is selected */}
            {formData.paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-earth-50 border border-earth-200/80 space-y-3">
                <span className="text-xs font-bold text-botanical-900 block">
                  Select Your Preferred UPI Option:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM / Any UPI'].map((app) => (
                    <button
                      type="button"
                      key={app}
                      onClick={() => setFormData({ ...formData, upiApp: app })}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                        formData.upiApp === app
                          ? 'border-botanical-700 bg-botanical-700 text-white shadow-sm'
                          : 'border-earth-200 bg-white text-stone-700 hover:bg-earth-100'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="Enter UPI ID (e.g. mobile@paytm or name@oksbi)"
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-white border border-earth-200 focus:outline-none focus:border-botanical-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="bg-earth-200 hover:bg-earth-300 text-botanical-900 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Show Dynamic UPI QR</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary: Items & Place Order */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-soft space-y-6 sticky top-28">
          <h2 className="font-serif text-xl font-bold text-botanical-900 pb-3 border-b border-earth-100 flex items-center justify-between">
            <span>Order Summary ({cartItems.length} Items)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              INR (₹)
            </span>
          </h2>

          <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-earth-100">
            {cartItems.map((item) => (
              <div key={item._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-earth-50 border border-earth-200"
                  />
                  <div>
                    <p className="font-semibold text-botanical-900 line-clamp-1">{item.name}</p>
                    <p className="text-stone-500 text-[11px]">Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <span className="font-bold text-botanical-900 font-sans">
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-earth-100 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total</span>
              <span className="font-semibold text-botanical-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Pan-India Delivery</span>
              <span className="font-semibold text-botanical-900">
                {shipping === 0 ? <strong className="text-emerald-700">FREE (Orders &gt; ₹499)</strong> : `₹${shipping}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-terracotta-600 font-semibold">
                <span>Herbal Special Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-500 text-[11px] pt-1 border-t border-earth-100/60">
              <span>GST Compliance (18% Included)</span>
              <span>₹{Math.round((totalPrice * 18) / 118).toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-3 border-t border-earth-100 flex justify-between items-baseline text-base">
              <span className="font-serif font-bold text-botanical-900">Total Payable</span>
              <span className="font-sans text-2xl font-bold text-botanical-900">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-botanical-700 hover:bg-botanical-800 active:scale-95 text-white py-4 rounded-2xl text-xs font-bold transition-all shadow-card disabled:bg-stone-300"
          >
            {submitting ? (
              <span>Generating Unique Order ID & Dispatching...</span>
            ) : (
              <>
                <span>Place Order • ₹{totalPrice.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="space-y-1.5 text-center text-[10px] text-stone-500">
            <p>🌿 Packed in plastic-free recyclable honeycomb paper with zero fillers.</p>
            <p>🇮🇳 Made with pride in India • Ministry of AYUSH Standards Compliant</p>
          </div>
        </div>
      </form>

      {/* DYNAMIC UPI QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-botanical-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-earth-200 max-w-sm w-full p-6 text-center space-y-4 shadow-card">
            <h3 className="font-serif text-lg font-bold text-botanical-900">
              Scan & Pay with Any UPI App
            </h3>
            <p className="text-xs text-stone-500">
              Scan using Google Pay, PhonePe, Paytm, or BHIM UPI
            </p>

            {/* Simulated Dynamic UPI QR Code */}
            <div className="w-48 h-48 mx-auto bg-earth-50 rounded-2xl border-2 border-dashed border-botanical-600 flex flex-col items-center justify-center p-3">
              <QrCode className="w-24 h-24 text-botanical-800 mb-1" />
              <span className="text-[10px] font-mono font-bold text-botanical-900">
                naturalis@upi
              </span>
              <span className="text-xs font-bold text-botanical-900 mt-0.5">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-[11px] text-emerald-800 font-semibold">
              ✓ Instant payment confirmation upon scan
            </p>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full bg-botanical-700 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-botanical-800 transition-colors"
            >
              Done & Return to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
