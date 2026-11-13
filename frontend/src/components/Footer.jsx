import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, HeartHandshake, Recycle, Send } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-earth-100/70 border-t border-earth-200/80 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Botanical Values Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-earth-200/60 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-botanical-800 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-botanical-700" />
            </div>
            <h4 className="font-serif font-bold text-sm text-botanical-900">100% Botanical</h4>
            <p className="text-xs text-stone-600">Pure wild herbs, cold-pressed oils, zero fillers.</p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-botanical-800 flex items-center justify-center">
              <Recycle className="w-5 h-5 text-botanical-700" />
            </div>
            <h4 className="font-serif font-bold text-sm text-botanical-900">Plastic Negative</h4>
            <p className="text-xs text-stone-600">Compostable paper & glass amber packaging.</p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-botanical-800 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-botanical-700" />
            </div>
            <h4 className="font-serif font-bold text-sm text-botanical-900">Ethical Harvest</h4>
            <p className="text-xs text-stone-600">Direct fair-trade with regenerative tribal growers.</p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-botanical-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-botanical-700" />
            </div>
            <h4 className="font-serif font-bold text-sm text-botanical-900">Lab Certified</h4>
            <p className="text-xs text-stone-600">Third-party tested for purity & potency.</p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Intro */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="text-2xl">🌿</span>
              <span className="font-serif text-2xl font-bold tracking-tight text-botanical-900">
                Naturalis
              </span>
            </Link>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              Consciously crafted botanical care rooted in herbal wisdom and modern bio-clean science. 
              Gentle on human biology, harmonious with the living earth.
            </p>
            <div className="text-xs text-stone-500 pt-2 space-y-1">
              <p>📍 Central Botanical Sanctuary, Nilgiri Biosphere, India</p>
              <p>✉️ care@naturalis-botanicals.com • 📞 +91 98765 43210</p>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-botanical-900">
              Categories
            </h5>
            <ul className="space-y-2 text-xs text-stone-600">
              <li><Link to="/products?category=Skincare" className="hover:text-botanical-700">Herbal Skincare</Link></li>
              <li><Link to="/products?category=Haircare" className="hover:text-botanical-700">Organic Haircare</Link></li>
              <li><Link to="/products?category=Essential Oils" className="hover:text-botanical-700">Pure Essential Oils</Link></li>
              <li><Link to="/products?category=Wellness & Teas" className="hover:text-botanical-700">Wellness & Teas</Link></li>
              <li><Link to="/products?category=Handmade Soaps" className="hover:text-botanical-700">Artisan Soaps</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-botanical-900">
              Quick Navigation
            </h5>
            <ul className="space-y-2 text-xs text-stone-600">
              <li><Link to="/" className="hover:text-botanical-700">Home</Link></li>
              <li><Link to="/about" className="hover:text-botanical-700">About Our Story</Link></li>
              <li><Link to="/track" className="hover:text-botanical-700 font-medium text-botanical-700">Track Order</Link></li>
              <li><Link to="/contact" className="hover:text-botanical-700">Contact & Support</Link></li>
              <li><Link to="/login" className="hover:text-botanical-700">Member Sign In</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-botanical-900">
              Botanical Gazette
            </h5>
            <p className="text-xs text-stone-600">
              Subscribe for herbal wellness guides, harvest notes, and 10% off your first harvest.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Naturalis!'); }} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="w-full bg-white text-xs px-3.5 py-2.5 rounded-xl border border-earth-200 focus:outline-none focus:border-botanical-600 text-stone-700"
              />
              <button
                type="submit"
                className="bg-botanical-700 hover:bg-botanical-800 text-white p-2.5 rounded-xl transition-colors"
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-earth-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} Naturalis Organics. All rights reserved. Handcrafted with botanical care.</p>
          <div className="flex gap-4">
            <span>Clean Formulations</span>
            <span>•</span>
            <span>Zero Synthetic Perfumes</span>
            <span>•</span>
            <span>Cruelty-Free</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
