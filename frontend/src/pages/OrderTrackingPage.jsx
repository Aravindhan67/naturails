import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../api/api';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';

export const OrderTrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (idToTrack) => {
    if (!idToTrack || !idToTrack.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.trackOrder(idToTrack.trim());
      setOrder(data);
    } catch (err) {
      console.error('Track Order Error:', err);
      setError(err.message || 'No order found with this tracking ID. Please verify the ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchTracking(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      setSearchParams({ id: orderIdInput.trim() });
      fetchTracking(orderIdInput.trim());
    }
  };

  const handleQuickDemoClick = (demoId) => {
    setOrderIdInput(demoId);
    setSearchParams({ id: demoId });
    fetchTracking(demoId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-botanical-700">
          Live Shipment Radar
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-botanical-900">
          Track Your Natural Harvest
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          Enter your unique order ID to track the real-time fulfillment, eco-packaging, 
          and transit progress of your pure botanical products.
        </p>
      </div>

      {/* Input Search Box */}
      <div className="bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-soft space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Package className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Enter Unique Order ID (e.g. NAT-20261113-1001)"
              required
              className="w-full text-xs sm:text-sm pl-12 pr-4 py-4 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 font-mono tracking-wide text-stone-800 placeholder:text-stone-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-botanical-700 hover:bg-botanical-800 active:scale-95 text-white px-8 py-4 rounded-2xl text-xs font-bold transition-all shadow-card disabled:bg-stone-300"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Locating...' : 'Track Order'}</span>
          </button>
        </form>

        {/* Demo ID helper tag */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-stone-500">
          <span>Quick Test Demo ID:</span>
          <button
            type="button"
            onClick={() => handleQuickDemoClick('NAT-20261113-1001')}
            className="font-mono text-[11px] font-bold bg-earth-100 hover:bg-earth-200 text-botanical-800 px-3 py-1 rounded-xl transition-colors border border-earth-200"
          >
            NAT-20261113-1001
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-3xl text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <p>{error}</p>
        </div>
      )}

      {/* Tracking Result */}
      {order && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <OrderStatusTimeline order={order} />

          {/* Ordered items summary */}
          <div className="bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-soft space-y-4">
            <h4 className="font-serif text-base font-bold text-botanical-900 pb-3 border-b border-earth-100">
              Items Included in this Harvest
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-earth-50/70 border border-earth-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-white border border-earth-200"
                  />
                  <div className="text-xs space-y-0.5">
                    <p className="font-serif font-bold text-botanical-900 line-clamp-1">{item.name}</p>
                    <p className="text-stone-500">Quantity: <strong>{item.qty}</strong></p>
                    <p className="text-stone-700 font-bold font-sans">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
