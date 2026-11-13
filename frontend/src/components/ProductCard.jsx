import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Rating } from './Rating';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group bg-white rounded-3xl border border-earth-200/70 p-4 transition-all duration-300 hover:shadow-card hover:-translate-y-1 flex flex-col justify-between">
      {/* Clickable Image Container */}
      <Link
        to={`/products/${product._id}`}
        className="relative aspect-square w-full rounded-2xl overflow-hidden bg-earth-50 mb-4 block cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.bestSeller && (
            <span className="inline-flex items-center gap-1 bg-botanical-800 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-botanical-200" />
              Best Seller
            </span>
          )}
          {discountPercent && (
            <span className="bg-terracotta-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Indian Green Vegetarian Symbol */}
        <div className="absolute top-3 right-3 bg-white/95 p-1 rounded-md shadow-sm border border-earth-200" title="100% Vegetarian / Pure Botanical">
          <div className="w-3.5 h-3.5 border-2 border-emerald-700 flex items-center justify-center p-0.5 rounded-sm">
            <div className="w-1.5 h-1.5 bg-emerald-700 rounded-full" />
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          <span className="font-semibold tracking-wide uppercase text-botanical-700 text-[10px]">
            {product.category}
          </span>
          {product.volumeOrWeight && (
            <span className="bg-earth-100 px-2 py-0.5 rounded-md text-stone-600 font-medium text-[10px]">
              {product.volumeOrWeight}
            </span>
          )}
        </div>

        <Link
          to={`/products/${product._id}`}
          className="font-serif text-sm font-semibold text-botanical-900 hover:text-botanical-700 transition-colors line-clamp-2 mb-1.5 leading-snug"
        >
          {product.name}
        </Link>

        {product.originRegion && (
          <div className="flex items-center gap-1 text-[10px] text-stone-400 mb-2">
            <MapPin className="w-3 h-3 text-botanical-600 flex-shrink-0" />
            <span className="truncate">{product.originRegion}</span>
          </div>
        )}

        <div className="mb-3">
          <Rating value={product.rating} numReviews={product.numReviews} />
        </div>

        {/* Price & Action in INR (₹) */}
        <div className="mt-auto pt-3 border-t border-earth-100 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-botanical-900 font-sans">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through ml-1.5">
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              product.stock > 0
                ? 'bg-botanical-700 text-white hover:bg-botanical-800 active:scale-95 shadow-sm'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock > 0 ? 'Add' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
