import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Droplets,
  Search,
  CheckCircle,
  Truck,
  Package,
  MapPin,
  QrCode,
} from 'lucide-react';
import { api } from '../api/api';
import { ProductCard } from '../components/ProductCard';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickTrackId, setQuickTrackId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getProducts();
        setFeaturedProducts(data.filter((p) => p.isFeatured).slice(0, 4));
        setBestSellers(data.filter((p) => p.bestSeller).slice(0, 4));
      } catch (err) {
        console.error('Error loading home products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(quickTrackId.trim())}`);
    }
  };

  const categories = [
    { name: 'Skincare', icon: '🌿', count: 'Kumkumadi & Ubtan Glow', bg: 'bg-botanical-50' },
    { name: 'Haircare', icon: '🍃', count: 'Kerala Bhringraj & Coconut', bg: 'bg-earth-100' },
    { name: 'Essential Oils', icon: '💧', count: 'Nilgiri Blue Eucalyptus & Camphor', bg: 'bg-cream-dark' },
    { name: 'Wellness & Teas', icon: '☕', count: 'Himalayan Shilajit & Malabar Spices', bg: 'bg-terracotta-50' },
    { name: 'Handmade Soaps', icon: '🧼', count: 'Cold-Pressed Neem & Tulsi Bars', bg: 'bg-botanical-100' },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-earth-100/70 via-cream-light to-cream-light py-16 md:py-24 border-b border-earth-200/50">
        {/* Organic decorative backdrop shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-botanical-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-terracotta-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-botanical-100/90 text-botanical-800 text-xs font-semibold tracking-wide border border-botanical-200/80">
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
                <span>100% Classical Ayurvedic & AYUSH Standard Heritage</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-botanical-900 leading-[1.15] tracking-tight">
                Authentic Indian Botanicals,{' '}
                <span className="italic font-normal text-botanical-700 block mt-1">
                  Rooted in Sacred Earth.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Cold-pressed Kashmiri Saffron, Wayanad Bhringraj, Mysore Sandalwood, and 18,000 ft Himalayan Shilajit. 
                Preserved with classical Kshirapaka & wood-ghani cold extraction.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-botanical-700 hover:bg-botanical-800 active:scale-95 text-white px-7 py-3.5 rounded-2xl text-sm font-semibold shadow-card transition-all"
                >
                  <span>Explore Harvest</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-white hover:bg-earth-50 text-botanical-800 border border-earth-300/80 px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-soft"
                >
                  <span>Our Vedic Ethos</span>
                </Link>
              </div>

              {/* Quick Indian Order Tracking Bar */}
              <div className="pt-6 max-w-md mx-auto lg:mx-0">
                <form
                  onSubmit={handleQuickTrack}
                  className="bg-white p-2 rounded-2xl shadow-soft border border-earth-200 flex items-center gap-2"
                >
                  <Package className="w-5 h-5 text-botanical-600 ml-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={quickTrackId}
                    onChange={(e) => setQuickTrackId(e.target.value)}
                    placeholder="Enter Unique Order ID (e.g. NAT-20261113-1001)"
                    className="w-full text-xs bg-transparent focus:outline-none text-stone-700 px-2 placeholder:text-stone-400 font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-earth-200 hover:bg-earth-300 text-botanical-900 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                  >
                    Track
                  </button>
                </form>
              </div>
            </div>

            {/* Right Visual Composition: AI Generated Product Imagery */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-earth-200/60 shadow-card border-4 border-white">
                  {featuredProducts.length > 0 ? (
                    <img
                      src={featuredProducts[0].image}
                      alt="Featured Kashmiri Kumkumadi Oil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      🌿
                    </div>
                  )}
                </div>

                {/* Floating highlight card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-earth-200 shadow-card max-w-[240px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-botanical-100 flex items-center justify-center text-xs">
                      🇮🇳
                    </div>
                    <span className="text-xs font-bold text-botanical-900">100% Made in India</span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    Zero chemical adulteration • AYUSH Approved.
                  </p>
                </div>

                <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-earth-200 shadow-soft">
                  <span className="text-xs font-bold text-terracotta-600">Pampore Kesar • Nilgiri Herbs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-botanical-700">
            Apothecary Disciplines
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-botanical-900">
            Formulated by Classical Ayurvedic Science
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`p-5 rounded-3xl ${cat.bg} border border-earth-200/70 hover:shadow-card hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 group`}
            >
              <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <h3 className="font-serif font-bold text-sm text-botanical-900 group-hover:text-botanical-700">
                {cat.name}
              </h3>
              <span className="text-[11px] text-stone-500">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-earth-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-botanical-700">
              Curated AYUSH Formulations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-botanical-900">
              Seasonal Ayurvedic Highlights
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-botanical-800 hover:text-botanical-900 group"
          >
            <span>View All Ayurvedic Harvests</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-earth-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Indian Facilities Trust Banner */}
      <section className="bg-botanical-900 text-cream-light py-16 md:py-20 rounded-[2.5rem] max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-botanical-700/20 rounded-full blur-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs uppercase tracking-widest text-botanical-300 font-bold">
              Pan-India Delivery & Trust
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-snug">
              Delivered safely to 28 States & 8 Union Territories.
            </h2>
            <p className="text-sm sm:text-base text-cream-dark/80 font-normal leading-relaxed">
              Every package is fulfilled from our regional fulfillment centers via Blue Dart, Delhivery Express, 
              and India Post Speed Post. Enjoy flexible Cash on Delivery (COD), UPI, and RuPay card payments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-botanical-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-cream-light">Doorstep Cash on Delivery</h4>
                  <p className="text-xs text-cream-dark/70">Pay via cash or UPI to the courier agent upon arrival.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-botanical-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-cream-light">GST Tax Compliant</h4>
                  <p className="text-xs text-cream-dark/70">Proper GST B2C invoice included with every order.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-botanical-800/80 p-8 rounded-3xl border border-botanical-700/60 text-center space-y-4">
            <span className="text-4xl">🇮🇳</span>
            <h3 className="font-serif text-xl font-semibold">Ayurvedic Vaidya Assistance</h3>
            <p className="text-xs text-cream-dark/80 leading-relaxed">
              Need personalized herbal recommendations for your Prakriti / Dosha? Connect with our certified herbalists directly on WhatsApp.
            </p>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-earth-100 hover:bg-white text-botanical-900 font-bold text-xs px-6 py-3 rounded-2xl transition-all shadow-md"
            >
              Consult on WhatsApp (+91 98765 43210)
            </a>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-botanical-700">
            Indian Customer Favorites
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-botanical-900">
            Beloved Ayurvedic Best Sellers
          </h2>
          <p className="text-xs text-stone-500">
            Trusted by over 45,000+ conscious families across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
