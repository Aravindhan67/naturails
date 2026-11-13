import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Menu,
  X,
  Package,
  ShieldCheck,
  LogOut,
  Sparkles,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Ayurvedic Catalog', path: '/products' },
    { name: 'Our Heritage', path: '/about' },
    { name: 'Contact & Vaidya Care', path: '/contact' },
    { name: 'Track Order', path: '/track' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-earth-200/70 transition-all duration-300">
      {/* Top Banner Tailored for Indian Users */}
      <div className="bg-botanical-900 text-cream-light py-2 px-4 text-center text-[11px] sm:text-xs tracking-wide font-medium flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span className="flex items-center gap-1 text-botanical-300 font-bold">
          <span>🌿</span> 100% Classical AYUSH Certified
        </span>
        <span className="hidden sm:inline text-botanical-600">•</span>
        <span>Free Express Delivery across India on orders above ₹499</span>
        <span className="hidden sm:inline text-botanical-600">•</span>
        <span className="text-amber-300 font-semibold">Cash on Delivery (COD) & UPI Available</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-botanical-800 text-cream-light flex items-center justify-center shadow-soft group-hover:bg-botanical-700 transition-colors">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-botanical-900 group-hover:text-botanical-700 transition-colors">
                Naturalis
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-earth-700 font-semibold -mt-1">
                Ayurveda & Botanicals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-semibold tracking-wide transition-colors relative py-1 ${
                    isActive
                      ? 'text-botanical-800 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-botanical-600 after:rounded-full'
                      : 'text-stone-600 hover:text-botanical-800'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* WhatsApp Quick Consultation */}
            <a
              href="https://wa.me/919876543210?text=Hello%20Naturalis,%20I%20would%20like%20a%20consultation%20on%20Ayurvedic%20products."
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold hover:bg-emerald-100 transition-colors"
              title="Chat with Ayurvedic Vaidya"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vaidya Help</span>
            </a>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-earth-100 hover:bg-earth-200/80 transition-colors text-xs font-semibold text-botanical-900"
                >
                  <div className="w-6 h-6 rounded-full bg-botanical-700 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-earth-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-earth-100">
                      <p className="text-xs font-semibold text-botanical-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 bg-botanical-100 text-botanical-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Admin Privileges
                        </span>
                      )}
                    </div>

                    <Link
                      to="/my-orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-700 hover:bg-earth-50 transition-colors"
                    >
                      <Package className="w-4 h-4 text-botanical-600" />
                      <span>My Orders</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-botanical-800 font-semibold hover:bg-botanical-50 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-botanical-700" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-earth-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-botanical-800 bg-earth-100 hover:bg-earth-200 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-2xl bg-botanical-50 hover:bg-botanical-100 text-botanical-800 transition-all active:scale-95 flex items-center justify-center"
              aria-label="View Shopping Basket"
            >
              <ShoppingBag className="w-5 h-5 text-botanical-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-2xl text-stone-700 hover:bg-earth-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream-light border-b border-earth-200 px-6 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium py-1.5 ${
                    isActive ? 'text-botanical-700 font-bold' : 'text-stone-700'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="text-base font-semibold text-emerald-800 py-1.5 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Chat with Vaidya (WhatsApp)
            </a>
            {isAuthenticated && (
              <>
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-stone-700 py-1.5 flex items-center gap-2"
                >
                  <Package className="w-4 h-4 text-botanical-600" />
                  My Orders
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-bold text-botanical-700 py-1.5 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-base font-medium text-rose-600 py-1.5 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
