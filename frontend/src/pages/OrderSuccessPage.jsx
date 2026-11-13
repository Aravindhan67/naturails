import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Copy, Check, Package, ArrowRight, Truck } from 'lucide-react';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      {/* Celebration Icon */}
      <div className="w-20 h-20 rounded-full bg-botanical-100 border border-botanical-200 flex items-center justify-center mx-auto text-botanical-700 shadow-soft">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-botanical-700">
          Order Successfully Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-botanical-900">
          Thank You for Choosing Pure Nature.
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Your botanical selections have entered our clean apothecary queue. 
          A confirmation with tracking details has been sent to your email.
        </p>
      </div>

      {/* Unique Order ID Card */}
      <div className="bg-white rounded-3xl border border-earth-200 p-6 sm:p-8 shadow-card space-y-4 text-left">
        <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500 block">
          Your Unique Generated Order Identifier
        </span>

        <div className="flex items-center justify-between gap-3 bg-earth-50 p-4 rounded-2xl border border-earth-200">
          <span className="font-mono text-lg sm:text-xl font-bold text-botanical-900 tracking-wider">
            {orderId}
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-earth-100 text-botanical-900 border border-earth-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-2 text-xs text-stone-500 flex items-center gap-2">
          <Truck className="w-4 h-4 text-botanical-600 flex-shrink-0" />
          <span>You can use this unique ID at any time to track your live delivery status.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          to={`/track?id=${encodeURIComponent(orderId)}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-botanical-700 hover:bg-botanical-800 text-white px-7 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-card"
        >
          <Package className="w-4 h-4" />
          <span>Track Live Shipment Now</span>
        </Link>

        <Link
          to="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-earth-50 text-botanical-800 border border-earth-300 px-6 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-soft"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
