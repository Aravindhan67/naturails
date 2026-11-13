import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Check,
  ArrowLeft,
  Truck,
  RotateCcw,
  Sparkles,
  Leaf,
  Plus,
  Minus,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { api } from '../api/api';
import { useCart } from '../context/CartContext';
import { Rating } from '../components/Rating';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits');

  // Indian Pincode Facility
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await api.getProductById(id);
        setProduct(data);

        // Fetch related products from same category
        const all = await api.getProducts({ category: data.category });
        setRelatedProducts(all.filter((p) => p._id !== data._id).slice(0, 4));
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      setPincodeStatus({
        valid: true,
        message: 'Delivery available in 2-4 business days via Blue Dart / Delhivery Express. Cash on Delivery (COD) is available!',
      });
    } else {
      setPincodeStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian postal pincode.',
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-earth-100 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-earth-100 rounded-xl w-3/4" />
            <div className="h-4 bg-earth-100 rounded-xl w-1/4" />
            <div className="h-24 bg-earth-100 rounded-2xl w-full" />
            <div className="h-12 bg-earth-100 rounded-2xl w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-botanical-900">Ayurvedic Product not found</h2>
        <p className="text-xs text-stone-500">This classical item may have been moved or archived.</p>
        <Link
          to="/products"
          className="inline-block bg-botanical-700 text-white px-6 py-2.5 rounded-xl text-xs font-semibold"
        >
          Return to Botanical Catalog
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back Link */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-botanical-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Ayurvedic Catalog</span>
      </Link>

      {/* Main Details Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image Display (AI Generated & Stored in Database) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-earth-50 border border-earth-200/80 shadow-soft relative group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 bg-botanical-800 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                AYUSH Premium Harvest
              </span>
            )}
            {/* 100% Vegetarian Green Symbol */}
            <div className="absolute top-4 right-4 bg-white/95 p-1.5 rounded-md shadow-sm border border-earth-200" title="100% Vegetarian / Ayurvedic">
              <div className="w-4 h-4 border-2 border-emerald-700 flex items-center justify-center p-0.5 rounded-sm">
                <div className="w-2 h-2 bg-emerald-700 rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 px-2">
            <span className="flex items-center gap-1.5 text-botanical-700 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              AI Commercial Studio Render (Stored in Database)
            </span>
            {product.originRegion && (
              <span className="flex items-center gap-1 text-[11px] text-stone-500 bg-earth-100 px-2.5 py-1 rounded-md">
                <MapPin className="w-3 h-3 text-botanical-600" />
                {product.originRegion}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Buying Options & Indian Facilities */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-botanical-700 bg-botanical-50 px-2.5 py-1 rounded-md">
                {product.category}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  product.stock > 0
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800'
                }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-botanical-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <Rating value={product.rating} numReviews={product.numReviews} size="md" />
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-600 font-medium bg-earth-100 px-2 py-0.5 rounded">
                {product.volumeOrWeight}
              </span>
            </div>
          </div>

          {/* Pricing in INR (₹) */}
          <div className="pb-4 border-b border-earth-100 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="font-sans text-3xl font-bold text-botanical-900">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-stone-400 line-through">
                    ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-stone-500">
              * Inclusive of all taxes (18% GST included). Free shipping on orders above ₹499.
            </p>
          </div>

          {/* Short Narrative */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Indian Pincode Delivery Facility Checker */}
          <div className="bg-earth-50/80 p-4 rounded-2xl border border-earth-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-botanical-900">
              <MapPin className="w-4 h-4 text-botanical-700" />
              <span>Check Delivery & Cash on Delivery (COD) in India</span>
            </div>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit Pincode (e.g. 560001, 110001)"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-earth-200 focus:outline-none focus:border-botanical-600 font-mono"
              />
              <button
                type="submit"
                className="bg-botanical-800 hover:bg-botanical-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p
                className={`text-[11px] font-medium leading-snug ${
                  pincodeStatus.valid ? 'text-emerald-800 font-semibold' : 'text-rose-600'
                }`}
              >
                {pincodeStatus.message}
              </p>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-stone-700">Quantity</span>
              <div className="flex items-center border border-earth-200 rounded-2xl bg-white p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-1.5 rounded-xl hover:bg-earth-100 text-stone-600 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-botanical-900">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qty >= product.stock}
                  className="p-1.5 rounded-xl hover:bg-earth-100 text-stone-600 transition-colors disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product, qty)}
                disabled={product.stock <= 0}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-botanical-700 hover:bg-botanical-800 active:scale-95 text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-card disabled:bg-stone-300"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Basket (₹{(product.price * qty).toLocaleString('en-IN')})</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="inline-flex items-center justify-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white px-7 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-soft"
              >
                <span>Instant Buy Now</span>
              </button>
            </div>
          </div>

          {/* Indian Facilities Trust Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-earth-100 text-[11px] text-stone-600">
            <div className="flex items-center gap-2 bg-earth-50/80 p-3 rounded-2xl">
              <Truck className="w-4 h-4 text-botanical-700 flex-shrink-0" />
              <span>Blue Dart / Delhivery Express & COD</span>
            </div>
            <div className="flex items-center gap-2 bg-earth-50/80 p-3 rounded-2xl">
              <ShieldCheck className="w-4 h-4 text-botanical-700 flex-shrink-0" />
              <span>AYUSH Certified & Lab Tested</span>
            </div>
          </div>

          {/* WhatsApp Ayurvedic Vaidya Consultation Link */}
          <div className="pt-1">
            <a
              href="https://wa.me/919876543210?text=Hello%20Naturalis,%20I%20have%20a%20question%20about%20your%20Ayurvedic%20products."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-2xl transition-colors w-full justify-center"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Chat with an Ayurvedic Vaidya on WhatsApp (+91 98765 43210)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs: Benefits, Ingredients & Certifications */}
      <div className="bg-white rounded-3xl border border-earth-200 p-6 sm:p-10 shadow-soft space-y-6">
        <div className="flex border-b border-earth-200 gap-8 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'benefits'
                ? 'text-botanical-800 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-botanical-700'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Therapeutic Benefits
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'ingredients'
                ? 'text-botanical-800 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-botanical-700'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Classical Ayurvedic Herbs
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'certifications'
                ? 'text-botanical-800 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-botanical-700'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Indian Quality Standards
          </button>
        </div>

        {activeTab === 'benefits' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-botanical-900">
              Why Your Body & Dosha Thrives on This Formula
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.benefits?.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 bg-earth-50 p-4 rounded-2xl">
                  <Leaf className="w-4 h-4 text-botanical-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-stone-700 leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-botanical-900">
              100% Transparent Botanical Actives
            </h4>
            <div className="p-5 rounded-2xl bg-earth-50 border border-earth-200/60 font-mono text-xs text-stone-700 leading-relaxed">
              {product.ingredients}
            </div>
            <p className="text-[11px] text-stone-500 italic">
              * Formulated according to classical Ayurvedic Rasashastra methods. Unrefined, wood-pressed, zero liquid paraffin, zero synthetic colorants.
            </p>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-botanical-900">
              Certifications & Regulatory Compliances
            </h4>
            <div className="flex flex-wrap gap-3">
              {product.certifications?.map((cert, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 bg-botanical-50 text-botanical-900 px-4 py-2 rounded-2xl text-xs font-semibold border border-botanical-200"
                >
                  <Check className="w-3.5 h-3.5 text-botanical-600" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-botanical-700">
              Complete Your Daily Dinacharya
            </span>
            <h3 className="font-serif text-2xl font-semibold text-botanical-900">
              Complementary Ayurvedic Rituals
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
