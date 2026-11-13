import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Calendar, ArrowRight, Clock } from 'lucide-react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

export const UserOrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch user orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-botanical-900">Sign in to view orders</h2>
        <p className="text-xs text-stone-500">
          Please log in to your account to review past purchases and track active deliveries.
        </p>
        <Link
          to="/login?redirect=my-orders"
          className="inline-block bg-botanical-700 text-white px-6 py-2.5 rounded-xl text-xs font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-botanical-900">
          Your Order History
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Track and review all your botanical wellness purchases
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-earth-100 rounded-3xl" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord._id}
              className="bg-white rounded-3xl border border-earth-200 p-6 shadow-soft hover:shadow-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-base font-bold text-botanical-900">
                    {ord.orderId}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      ord.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {ord.orderStatus}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      {new Date(ord.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span>•</span>
                  <span>{ord.orderItems?.length || 0} item(s)</span>
                  <span>•</span>
                  <span className="font-bold text-botanical-900 font-sans">
                    ${ord.totalPrice?.toFixed(2)}
                  </span>
                </div>

                {/* Items preview preview thumbnails */}
                <div className="flex items-center gap-2 pt-1">
                  {ord.orderItems?.slice(0, 4).map((item, idx) => (
                    <img
                      key={idx}
                      src={item.image}
                      alt={item.name}
                      title={item.name}
                      className="w-10 h-10 rounded-xl object-cover bg-earth-50 border border-earth-200"
                    />
                  ))}
                  {ord.orderItems?.length > 4 && (
                    <span className="text-[11px] text-stone-400 font-semibold">
                      +{ord.orderItems.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 pt-2 md:pt-0">
                <Link
                  to={`/track?id=${encodeURIComponent(ord.orderId)}`}
                  className="inline-flex items-center justify-center gap-2 bg-botanical-700 hover:bg-botanical-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Live Delivery</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-earth-200 p-8 space-y-4">
          <span className="text-4xl">📦</span>
          <h3 className="font-serif text-lg font-bold text-botanical-900">
            You haven't placed any orders yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Explore our curated collection of botanical care and your placed orders will appear here.
          </p>
          <Link
            to="/products"
            className="inline-block bg-botanical-700 text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-botanical-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};
