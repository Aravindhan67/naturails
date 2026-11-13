import React from 'react';
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  Home,
  CheckCheck,
  AlertCircle,
  MapPin,
  Calendar,
} from 'lucide-react';

const STATUS_ICONS = {
  Placed: CheckCircle,
  Processing: Clock,
  Packed: Package,
  Shipped: Truck,
  'Out for Delivery': Truck,
  Delivered: Home,
  Cancelled: AlertCircle,
};

export const OrderStatusTimeline = ({ order }) => {
  if (!order || !order.trackingTimeline) return null;

  const currentStatus = order.orderStatus;
  const isCancelled = currentStatus === 'Cancelled';

  return (
    <div className="bg-white rounded-3xl border border-earth-200/80 p-6 md:p-8 shadow-soft">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-earth-100">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-botanical-600 block mb-1">
            Tracking Unique Order
          </span>
          <div className="flex items-center gap-3">
            <h3 className="font-mono text-xl md:text-2xl font-bold text-botanical-900 tracking-wide">
              {order.orderId}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                currentStatus === 'Delivered'
                  ? 'bg-botanical-100 text-botanical-800 border border-botanical-200'
                  : currentStatus === 'Cancelled'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              {currentStatus}
            </span>
          </div>
        </div>

        {order.estimatedDelivery && (
          <div className="bg-earth-50 px-4 py-2.5 rounded-2xl border border-earth-200/60 flex items-center gap-2.5 text-xs text-botanical-900">
            <Calendar className="w-4 h-4 text-botanical-600" />
            <div>
              <span className="text-stone-500 block text-[10px] uppercase font-bold tracking-wider">
                Estimated Delivery
              </span>
              <span className="font-semibold">
                {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Steps */}
      <div className="mt-8 relative">
        <div className="relative pl-6 md:pl-8 border-l-2 border-botanical-200 space-y-8">
          {order.trackingTimeline.map((step, idx) => {
            const Icon = STATUS_ICONS[step.status] || CheckCircle;
            const isDone = step.completed;
            const isCurrent = order.orderStatus === step.status;

            return (
              <div key={idx} className="relative group">
                {/* Checkpoint Node */}
                <div
                  className={`absolute -left-[35px] md:-left-[43px] top-0.5 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-botanical-700 text-white shadow-md ring-4 ring-botanical-100'
                      : 'bg-stone-100 text-stone-400 border border-stone-300'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-4.5 md:h-4.5" />
                </div>

                {/* Content */}
                <div
                  className={`p-4 rounded-2xl transition-all ${
                    isCurrent
                      ? 'bg-botanical-50/80 border border-botanical-200 shadow-sm'
                      : 'hover:bg-earth-50/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4
                      className={`font-serif text-base font-semibold ${
                        isDone ? 'text-botanical-900' : 'text-stone-400'
                      }`}
                    >
                      {step.title}
                    </h4>

                    {step.timestamp && (
                      <span className="text-xs text-stone-500 font-mono">
                        {new Date(step.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  <p className="text-xs md:text-sm text-stone-600 mt-1 leading-relaxed">
                    {step.description}
                  </p>

                  {step.location && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-botanical-600 flex-shrink-0" />
                      <span className="font-medium">{step.location}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipping destination summary */}
      {order.shippingAddress && (
        <div className="mt-8 pt-6 border-t border-earth-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-earth-50/70 p-4 rounded-2xl">
            <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Destination Address
            </span>
            <p className="font-semibold text-botanical-900">{order.customerName}</p>
            <p className="text-stone-600">{order.shippingAddress.street}</p>
            <p className="text-stone-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
              {order.shippingAddress.postalCode}
            </p>
            <p className="text-stone-600">{order.shippingAddress.country}</p>
          </div>

          <div className="bg-earth-50/70 p-4 rounded-2xl">
            <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Payment & Shipping
            </span>
            <p className="text-stone-700">
              <span className="font-medium text-stone-500">Method:</span>{' '}
              <strong className="text-botanical-900">{order.paymentMethod}</strong>
            </p>
            <p className="text-stone-700">
              <span className="font-medium text-stone-500">Payment Status:</span>{' '}
              <span className="font-semibold text-botanical-800">{order.paymentStatus}</span>
            </p>
            <p className="text-stone-700">
              <span className="font-medium text-stone-500">Total Paid:</span>{' '}
              <strong className="text-botanical-900 font-sans text-sm">
                ${order.totalPrice.toFixed(2)}
              </strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
