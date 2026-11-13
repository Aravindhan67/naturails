import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const { cartItems, updateQty, removeFromCart, subtotal, shipping, discount, totalPrice, totalItems } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const navigate = useNavigate();

  const freeShippingThreshold = 499;
  const distanceToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AYURVEDA10' || promoCode.trim().toUpperCase() === 'ORGANIC10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon. Try AYURVEDA10 for 10% instant discount!');
    }
  };

  const extraDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const finalDiscount = discount + extraDiscount;
  const finalTotal = Math.max(0, subtotal + shipping - finalDiscount);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-earth-100 flex items-center justify-center mx-auto text-4xl shadow-inner">
          🌿
        </div>
        <h1 className="font-serif text-3xl font-semibold text-botanical-900">
          Your Ayurvedic Basket is Empty
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
          Nourish your skin and senses with freshly harvested pure Indian botanical extracts, hair elixirs, and adaptogens.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-botanical-700 hover:bg-botanical-800 text-white px-7 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-card"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Ayurvedic Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-botanical-900">
          Your Shopping Basket
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review your authentic botanical selections ({totalItems} items)
        </p>
      </div>

      {/* Free Shipping Progress Indicator (₹499 threshold for India) */}
      <div className="bg-earth-100/70 p-4 rounded-3xl border border-earth-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-botanical-900">
          <span>
            {distanceToFreeShipping > 0
              ? `Add ₹${distanceToFreeShipping.toLocaleString('en-IN')} more to unlock FREE Pan-India Delivery!`
              : '🎉 You have unlocked FREE Pan-India Express Delivery!'}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-earth-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-botanical-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item Rows */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-earth-200 p-6 shadow-soft divide-y divide-earth-100">
          {cartItems.map((item) => (
            <div key={item._id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-earth-50 border border-earth-200/80 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-botanical-700">
                    {item.category}
                  </span>
                  <Link
                    to={`/products/${item._id}`}
                    className="font-serif text-sm font-semibold text-botanical-900 hover:text-botanical-700 block line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs font-bold text-stone-700 font-sans">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                <div className="flex items-center border border-earth-200 rounded-2xl bg-earth-50 p-1">
                  <button
                    onClick={() => updateQty(item._id, item.qty - 1)}
                    className="p-1 rounded-xl hover:bg-earth-200/60 text-stone-600"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-botanical-900">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item._id, item.qty + 1)}
                    className="p-1 rounded-xl hover:bg-earth-200/60 text-stone-600"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-sans text-sm font-bold text-botanical-900 w-24 text-right">
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </span>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-stone-400 hover:text-rose-600 transition-colors p-1.5 rounded-xl hover:bg-rose-50"
                  title="Remove from basket"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-soft space-y-6">
          <h2 className="font-serif text-xl font-bold text-botanical-900 pb-3 border-b border-earth-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total</span>
              <span className="font-semibold text-botanical-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Delivery Charges</span>
              <span className="font-semibold text-botanical-900">
                {shipping === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  `₹${shipping}`
                )}
              </span>
            </div>

            {finalDiscount > 0 && (
              <div className="flex justify-between text-terracotta-600 font-semibold">
                <span>Discounts & Coupons</span>
                <span>-₹{finalDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="pt-3 border-t border-earth-100 flex justify-between items-baseline text-sm">
              <span className="font-serif font-bold text-botanical-900">Final Payable</span>
              <span className="font-sans text-xl font-bold text-botanical-900">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-stone-400 text-right">* All taxes included</p>
          </div>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
              Ayurvedic Promo Coupon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Try AYURVEDA10"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 uppercase"
              />
              <button
                type="submit"
                className="bg-earth-200 hover:bg-earth-300 text-botanical-900 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <p className="text-[11px] text-emerald-700 font-semibold">
                ✓ Coupon AYURVEDA10 applied: 10% Extra Discount!
              </p>
            )}
            {promoError && (
              <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>
            )}
          </form>

          {/* Checkout Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full inline-flex items-center justify-center gap-2 bg-botanical-700 hover:bg-botanical-800 active:scale-95 text-white py-4 rounded-2xl text-xs font-bold transition-all shadow-card"
          >
            <span>Proceed to Checkout (₹{finalTotal.toLocaleString('en-IN')})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-botanical-600" />
            <span>UPI, RuPay, Cards & Doorstep COD Accepted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
