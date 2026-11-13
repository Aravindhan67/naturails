import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Pencil,
  RefreshCw,
  X,
  Sparkles,
  Upload,
  CheckCircle,
  Wand2,
} from 'lucide-react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'messages'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdateForm, setStatusUpdateForm] = useState({
    status: 'Processing',
    location: '',
    note: '',
  });

  // AI Studio Image Generation presets for Indian Ayurvedic products
  const AI_STUDIO_PRESETS = [
    {
      title: 'Kashmiri Saffron Kumkumadi Tailam',
      imagePath: '/images/products/kumkumadi.jpg',
      category: 'Skincare',
      defaultPrice: 1299,
      desc: 'Authentic Kashmiri Saffron and blue lotus glow oil.',
    },
    {
      title: 'Kerala Bhringraj & Coconut Hair Oil',
      imagePath: '/images/products/bhringraj.jpg',
      category: 'Haircare',
      defaultPrice: 749,
      desc: 'Classical Kshirapaka hair regrowth and anti-dandruff oil.',
    },
    {
      title: 'Kashmiri Saffron & Sandalwood Ubtan',
      imagePath: '/images/products/ubtan.jpg',
      category: 'Skincare',
      defaultPrice: 899,
      desc: 'Royal Mysore Chandan and Kasturi Manjal tan removal mask.',
    },
    {
      title: 'Handmade Neem, Tulsi & Turmeric Soap',
      imagePath: '/images/products/soap.jpg',
      category: 'Handmade Soaps',
      defaultPrice: 349,
      desc: 'Cold-pressed artisan bar for clear, breakout-free skin.',
    },
    {
      title: 'Pure Himalayan Shilajit Gold Resin',
      imagePath: '/images/products/shilajit.jpg',
      category: 'Wellness & Teas',
      defaultPrice: 1999,
      desc: '18,000 ft Himalayan Shilajit with KSM-66 Ashwagandha.',
    },
    {
      title: 'Nilgiri Eucalyptus & Bhimseni Camphor Oil',
      imagePath: '/images/products/eucalyptus.jpg',
      category: 'Essential Oils',
      defaultPrice: 499,
      desc: 'Steam-distilled pain relief and respiratory clearing oil.',
    },
    {
      title: 'Malabar Cardamom & Lemongrass Herbal Tea',
      imagePath: '/images/products/tea.jpg',
      category: 'Wellness & Teas',
      defaultPrice: 449,
      desc: 'Organic Idukki green cardamom and lemongrass digestive tea.',
    },
    {
      title: 'Virgin Sesame & Ashwagandha Abhyanga Oil',
      imagePath: '/images/products/abhyanga.jpg',
      category: 'Body Care',
      defaultPrice: 649,
      desc: 'Traditional wood-ghani pressed daily self-massage oil.',
    },
  ];

  // New Product Form with Base64 Image Upload to Database
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Skincare',
    price: '',
    originalPrice: '',
    stock: 25,
    volumeOrWeight: '100 ml',
    originRegion: 'Kerala, India',
    description: '',
    ingredients: '',
    benefits: '',
    certifications: 'AYUSH Certified, 100% Ayurvedic, Made in India',
    image: '',
    isFeatured: false,
    bestSeller: false,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [notification, setNotification] = useState('');

  // Edit Product Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: 'Skincare',
    price: '',
    originalPrice: '',
    stock: 25,
    volumeOrWeight: '100 ml',
    originRegion: 'Kerala, India',
    description: '',
    ingredients: '',
    benefits: '',
    certifications: 'AYUSH Certified, 100% Ayurvedic, Made in India',
    image: '',
    isFeatured: false,
    bestSeller: false,
  });
  const [editImagePreview, setEditImagePreview] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, productsData, contactsData] = await Promise.all([
        api.getAllOrders(),
        api.getProducts(),
        api.getContacts(),
      ]);
      setOrders(ordersData);
      setProducts(productsData);
      setContacts(contactsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login?redirect=admin');
      return;
    }
    loadData();
  }, [isAdmin, navigate]);

  // Handle local image file to Base64 conversion (Stored directly in Database)
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setNewProduct((prev) => ({ ...prev, image: base64Data }));
        setImagePreview(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Image preset picker
  const handleApplyAiPreset = async (preset) => {
    try {
      // Fetch the preset image and convert to Base64 to store in database
      const res = await fetch(preset.imagePath);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setNewProduct((prev) => ({
          ...prev,
          name: prev.name || preset.title,
          category: preset.category,
          price: prev.price || preset.defaultPrice,
          description: prev.description || preset.desc,
          image: base64Data,
        }));
        setImagePreview(base64Data);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Error applying AI preset:', err);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmittingProduct(true);
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
        stock: Number(newProduct.stock),
        benefits: newProduct.benefits
          ? newProduct.benefits.split('\n').filter((b) => b.trim() !== '')
          : ['Formulated with 100% active classical Ayurvedic botanicals'],
        certifications: newProduct.certifications
          ? newProduct.certifications.split(',').map((c) => c.trim())
          : ['AYUSH Certified', '100% Vegetarian (Green Dot)', 'Made in India'],
      };

      await api.createProduct(payload);
      setShowProductModal(false);
      setNewProduct({
        name: '',
        category: 'Skincare',
        price: '',
        originalPrice: '',
        stock: 25,
        volumeOrWeight: '100 ml',
        originRegion: 'Kerala, India',
        description: '',
        ingredients: '',
        benefits: '',
        certifications: 'AYUSH Certified, 100% Ayurvedic, Made in India',
        image: '',
        isFeatured: false,
        bestSeller: false,
      });
      setImagePreview('');
      setNotification('Product created successfully and image saved directly in MongoDB Atlas!');
      setTimeout(() => setNotification(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message || 'Error creating product');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this Ayurvedic product from MongoDB?')) {
      try {
        await api.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        alert(err.message || 'Error deleting product');
      }
    }
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || '',
      category: product.category || 'Skincare',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      stock: product.stock !== undefined ? product.stock : 25,
      volumeOrWeight: product.volumeOrWeight || '100 ml',
      originRegion: product.originRegion || 'Kerala, India',
      description: product.description || '',
      ingredients: product.ingredients || '',
      benefits: Array.isArray(product.benefits)
        ? product.benefits.join('\n')
        : product.benefits || '',
      certifications: Array.isArray(product.certifications)
        ? product.certifications.join(', ')
        : product.certifications || 'AYUSH Certified, 100% Ayurvedic, Made in India',
      image: product.image || '',
      isFeatured: !!product.isFeatured,
      bestSeller: !!product.bestSeller,
    });
    setEditImagePreview(product.image || '');
    setShowEditModal(true);
  };

  const handleEditImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setEditFormData((prev) => ({ ...prev, image: base64Data }));
        setEditImagePreview(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSubmittingEdit(true);
    try {
      const payload = {
        ...editFormData,
        price: Number(editFormData.price),
        originalPrice: editFormData.originalPrice
          ? Number(editFormData.originalPrice)
          : undefined,
        stock: Number(editFormData.stock),
        benefits: editFormData.benefits
          ? editFormData.benefits.split('\n').filter((b) => b.trim() !== '')
          : ['Formulated with 100% active classical Ayurvedic botanicals'],
        certifications: editFormData.certifications
          ? editFormData.certifications.split(',').map((c) => c.trim())
          : ['AYUSH Certified', '100% Vegetarian (Green Dot)', 'Made in India'],
      };

      const updated = await api.updateProduct(editingProduct._id, payload);
      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct._id ? updated : p))
      );
      setShowEditModal(false);
      setEditingProduct(null);
      setNotification(`Product "${payload.name}" updated successfully in MongoDB Atlas!`);
      setTimeout(() => setNotification(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message || 'Error updating product');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const openStatusModal = (ord) => {
    setSelectedOrder(ord);
    setStatusUpdateForm({
      status: ord.orderStatus,
      location: 'Central Botanical Apothecary Hub, Coimbatore, Tamil Nadu',
      note: `Shipment status updated to ${ord.orderStatus}`,
    });
    setShowStatusModal(true);
  };

  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const updated = await api.updateOrderStatus(selectedOrder._id, statusUpdateForm);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      setShowStatusModal(false);
      setNotification(`Order ${updated.orderId} updated to ${updated.orderStatus}!`);
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      alert(err.message || 'Error updating order status');
    }
  };

  // Indian currency total calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-earth-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-botanical-100 text-botanical-800">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-botanical-700">
              Master Admin Control Center
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-botanical-900 mt-1">
            Ayurvedic Store Administration
          </h1>
          <p className="text-xs text-stone-500">
            Connected to MongoDB Atlas: <strong className="text-botanical-800">Cluster0 / natural_ecommerce</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-earth-100 border border-earth-200 text-stone-700 px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowProductModal(true)}
            className="inline-flex items-center gap-1.5 bg-botanical-700 hover:bg-botanical-800 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-card transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ayurvedic Product</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Overview Stat Cards in INR (₹) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-earth-200 p-6 shadow-soft space-y-1">
          <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider">
            Total Sales (INR)
          </span>
          <p className="font-sans text-2xl sm:text-3xl font-bold text-botanical-900">
            ₹{Math.round(totalRevenue).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold block pt-1">
            From {orders.length} orders
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-earth-200 p-6 shadow-soft space-y-1">
          <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider">
            Pending Dispatches
          </span>
          <p className="font-sans text-2xl sm:text-3xl font-bold text-terracotta-600">
            {pendingOrders}
          </p>
          <span className="text-[11px] text-stone-500 font-semibold block pt-1">
            Requiring transit update
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-earth-200 p-6 shadow-soft space-y-1">
          <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider">
            Live Catalog Items
          </span>
          <p className="font-sans text-2xl sm:text-3xl font-bold text-botanical-900">
            {products.length}
          </p>
          <span className="text-[11px] text-stone-500 font-semibold block pt-1">
            Stored in MongoDB Atlas
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-earth-200 p-6 shadow-soft space-y-1">
          <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider">
            Vaidya Inquiries
          </span>
          <p className="font-sans text-2xl sm:text-3xl font-bold text-botanical-900">
            {contacts.length}
          </p>
          <span className="text-[11px] text-stone-500 font-semibold block pt-1">
            Indian customer messages
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-earth-200 gap-8 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'orders'
              ? 'text-botanical-800 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-botanical-700'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'products'
              ? 'text-botanical-800 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-botanical-700'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          Manage Catalog ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'messages'
              ? 'text-botanical-800 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-botanical-700'
              : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          Customer Messages ({contacts.length})
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-earth-200 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-earth-100 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-botanical-900">Customer Orders & Indian Logistics</h3>
            <span className="text-xs text-stone-500">Advance order status to update tracking</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-earth-50 text-stone-600 uppercase text-[10px] tracking-wider border-b border-earth-200">
                <tr>
                  <th className="py-3.5 px-6">Unique Order ID</th>
                  <th className="py-3.5 px-6">Customer & Phone</th>
                  <th className="py-3.5 px-6">Destination & State</th>
                  <th className="py-3.5 px-6">Payment</th>
                  <th className="py-3.5 px-6">Total (INR)</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-earth-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-botanical-900">
                      {ord.orderId}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-botanical-900">{ord.customerName}</p>
                      <p className="text-[11px] text-stone-500">{ord.customerPhone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-stone-700">{ord.shippingAddress?.city}, {ord.shippingAddress?.state}</p>
                      <p className="text-[11px] text-stone-400 font-mono">PIN: {ord.shippingAddress?.postalCode}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-earth-100 text-stone-800 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-botanical-900 font-sans">
                      ₹{Math.round(ord.totalPrice).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => openStatusModal(ord)}
                        className="bg-botanical-100 hover:bg-botanical-200 text-botanical-800 font-semibold px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-earth-200 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-earth-100 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-botanical-900">
              Ayurvedic Catalog ({products.length} Products in Atlas)
            </h3>
            <span className="text-xs text-stone-500">
              AI Generated Product Images Stored in MongoDB
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-earth-50 text-stone-600 uppercase text-[10px] tracking-wider border-b border-earth-200">
                <tr>
                  <th className="py-3.5 px-6">Image in DB</th>
                  <th className="py-3.5 px-6">Product Details</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price (₹)</th>
                  <th className="py-3.5 px-6">Stock</th>
                  <th className="py-3.5 px-6">Indian Origin</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-earth-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover bg-earth-50 border border-earth-200"
                      />
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="font-serif font-bold text-botanical-900 line-clamp-1">{prod.name}</p>
                      <p className="text-[11px] text-stone-400">{prod.volumeOrWeight}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-earth-100 text-stone-700 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-botanical-900 font-sans">
                      ₹{Number(prod.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-semibold ${
                          prod.stock > 10 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6 text-stone-500 text-[11px]">
                      {prod.originRegion || 'India'}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="text-stone-400 hover:text-botanical-800 p-2 rounded-xl hover:bg-botanical-50 transition-colors inline-flex items-center gap-1"
                        title="Edit Product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="text-stone-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors inline-flex items-center gap-1"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER INQUIRIES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-earth-200 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-earth-100">
            <h3 className="font-serif text-lg font-bold text-botanical-900">
              Customer Vaidya Consultation Inquiries
            </h3>
          </div>

          <div className="divide-y divide-earth-100">
            {contacts.map((c) => (
              <div key={c._id} className="p-6 space-y-2 hover:bg-earth-50/50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-botanical-900 text-sm">{c.name}</h4>
                    <p className="text-xs text-stone-500">{c.email}</p>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(c.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-earth-50 p-3 rounded-2xl border border-earth-200/60 text-xs text-stone-700">
                  <strong className="block text-botanical-900 font-semibold mb-1">
                    Subject: {c.subject}
                  </strong>
                  <p className="leading-relaxed">{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: UPDATE STATUS */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-botanical-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-earth-200 max-w-lg w-full p-6 sm:p-8 shadow-card space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-earth-100">
              <div>
                <span className="text-[11px] font-bold text-botanical-700 uppercase tracking-wider">
                  Update Tracking Status
                </span>
                <h3 className="font-mono text-xl font-bold text-botanical-900">
                  {selectedOrder.orderId}
                </h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Order Status Checkpoint
                </label>
                <select
                  value={statusUpdateForm.status}
                  onChange={(e) =>
                    setStatusUpdateForm({ ...statusUpdateForm, status: e.target.value })
                  }
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                >
                  <option value="Placed">Placed (Order Confirmed)</option>
                  <option value="Processing">Processing (Lab Formulation QC)</option>
                  <option value="Packed">Packed (Eco-Friendly Packaged)</option>
                  <option value="Shipped">Shipped (In Transit with Blue Dart / Delhivery)</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Location Checkpoint
                </label>
                <input
                  type="text"
                  value={statusUpdateForm.location}
                  onChange={(e) =>
                    setStatusUpdateForm({ ...statusUpdateForm, location: e.target.value })
                  }
                  placeholder="e.g. Coimbatore Hub / Delhi Cargo Centre"
                  className="w-full text-xs px-4 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Public Tracking Description Note
                </label>
                <textarea
                  value={statusUpdateForm.note}
                  onChange={(e) =>
                    setStatusUpdateForm({ ...statusUpdateForm, note: e.target.value })
                  }
                  rows={2}
                  placeholder="Items inspected and prepared for eco-friendly transit..."
                  className="w-full text-xs p-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-earth-100">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-earth-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-botanical-700 hover:bg-botanical-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm"
                >
                  Save & Update Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT WITH AI STUDIO PRESETS & BASE64 STORAGE */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-botanical-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <form
            onSubmit={handleCreateProduct}
            className="bg-white rounded-3xl border border-earth-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden"
          >
            {/* Pinned Sticky Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-earth-100 flex-shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold text-botanical-700 uppercase tracking-widest block mb-0.5">
                  Catalog Creator
                </span>
                <h3 className="font-serif text-2xl font-bold text-botanical-900 leading-tight">
                  Add Ayurvedic Product to MongoDB Atlas
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Includes AI Studio generator & direct Base64 database image storage
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-earth-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* AI Studio Image Presets Selector */}
              <div className="bg-botanical-50/70 p-4 rounded-2xl border border-botanical-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-botanical-900">
                  <Wand2 className="w-4 h-4 text-botanical-700" />
                  <span>✨ 1-Click AI Studio Image Presets</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Select an AI-generated product visual below to auto-fill high-resolution imagery:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {AI_STUDIO_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyAiPreset(p)}
                      className="p-2 rounded-xl bg-white hover:bg-earth-100 border border-earth-200 text-left transition-all flex items-center gap-2 group"
                    >
                      <img
                        src={p.imagePath}
                        alt={p.title}
                        className="w-8 h-8 rounded-lg object-cover bg-earth-50 flex-shrink-0"
                      />
                      <span className="text-[10px] font-semibold text-botanical-900 line-clamp-1 group-hover:text-botanical-700">
                        {p.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Pure Kashmiri Kumkumadi Face Oil"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                  >
                    <option value="Skincare">Skincare</option>
                    <option value="Haircare">Haircare</option>
                    <option value="Essential Oils">Essential Oils</option>
                    <option value="Wellness & Teas">Wellness & Teas</option>
                    <option value="Handmade Soaps">Handmade Soaps</option>
                    <option value="Body Care">Body Care</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="799"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 font-sans"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Original Price (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={newProduct.originalPrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, originalPrice: e.target.value })
                    }
                    placeholder="999"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 font-sans"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Stock Inventory (Units) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    placeholder="25"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 font-sans"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Volume / Net Weight
                  </label>
                  <input
                    type="text"
                    value={newProduct.volumeOrWeight}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, volumeOrWeight: e.target.value })
                    }
                    placeholder="100 ml / 3.4 fl oz"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-stone-700 block mb-1">
                    Indian Origin Region
                  </label>
                  <input
                    type="text"
                    value={newProduct.originRegion}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, originRegion: e.target.value })
                    }
                    placeholder="e.g. Wayanad, Kerala / Kashmir"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>
              </div>

              {/* Image Picker for Direct Database Storage */}
              <div className="p-4 rounded-2xl bg-earth-50 border border-earth-200 space-y-2.5">
                <label className="font-bold text-botanical-900 block">
                  Product Image (Encoded & Stored in Database)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-xl object-cover border border-earth-200 bg-white shadow-soft flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-earth-200/60 border border-earth-300 flex items-center justify-center text-stone-400 flex-shrink-0">
                      <Upload className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="block w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-botanical-700 file:text-white hover:file:bg-botanical-800 cursor-pointer"
                    />
                    <p className="text-[11px] text-stone-400">
                      Upload any image or choose an AI Studio preset above.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Pure classical Ayurvedic formulation..."
                  className="w-full p-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Classical Herbs & Ingredients
                </label>
                <input
                  type="text"
                  value={newProduct.ingredients}
                  onChange={(e) => setNewProduct({ ...newProduct, ingredients: e.target.value })}
                  placeholder="Kashmiri Kesar, Red Chandan, Manjistha, Sesame Oil"
                  className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                  <input
                    type="checkbox"
                    checked={newProduct.isFeatured}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, isFeatured: e.target.checked })
                    }
                    className="accent-botanical-700 rounded w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as AYUSH Featured Harvest</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                  <input
                    type="checkbox"
                    checked={newProduct.bestSeller}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, bestSeller: e.target.checked })
                    }
                    className="accent-botanical-700 rounded w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>
            </div>

            {/* Pinned Sticky Footer */}
            <div className="flex items-center justify-end gap-3 p-4 px-6 border-t border-earth-100 bg-earth-50/80 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-earth-200/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingProduct}
                className="bg-botanical-700 hover:bg-botanical-800 text-white px-7 py-2.5 rounded-xl text-xs font-bold shadow-card disabled:bg-stone-300 transition-colors"
              >
                {submittingProduct ? 'Saving to Database...' : 'Save & Publish Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-50 bg-botanical-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <form
            onSubmit={handleUpdateProduct}
            className="bg-white rounded-3xl border border-earth-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden"
          >
            {/* Pinned Sticky Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-earth-100 flex-shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold text-botanical-700 uppercase tracking-widest block mb-0.5">
                  Product Editor
                </span>
                <h3 className="font-serif text-2xl font-bold text-botanical-900 leading-tight">
                  Edit Ayurvedic Product
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update product details, pricing, inventory or database image in MongoDB Atlas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-earth-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    placeholder="e.g. Pure Kashmiri Kumkumadi Face Oil"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                  >
                    <option value="Skincare">Skincare</option>
                    <option value="Haircare">Haircare</option>
                    <option value="Essential Oils">Essential Oils</option>
                    <option value="Wellness & Teas">Wellness & Teas</option>
                    <option value="Handmade Soaps">Handmade Soaps</option>
                    <option value="Body Care">Body Care</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, price: e.target.value })
                    }
                    placeholder="799"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 font-sans"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Original Price (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editFormData.originalPrice}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, originalPrice: e.target.value })
                    }
                    placeholder="999"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 font-sans"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Stock Inventory (Units) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={editFormData.stock}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, stock: e.target.value })
                    }
                    placeholder="25"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 font-sans"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Volume / Net Weight
                  </label>
                  <input
                    type="text"
                    value={editFormData.volumeOrWeight}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, volumeOrWeight: e.target.value })
                    }
                    placeholder="100 ml / 3.4 fl oz"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Indian Origin Region
                  </label>
                  <input
                    type="text"
                    value={editFormData.originRegion}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, originRegion: e.target.value })
                    }
                    placeholder="e.g. Wayanad, Kerala / Kashmir"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Certifications / Quality Standard
                  </label>
                  <input
                    type="text"
                    value={editFormData.certifications}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, certifications: e.target.value })
                    }
                    placeholder="AYUSH Certified, Made in India"
                    className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>
              </div>

              {/* Product Image Update */}
              <div className="p-4 rounded-2xl bg-earth-50 border border-earth-200 space-y-2.5">
                <label className="font-bold text-botanical-900 block">
                  Product Image (Encoded & Stored in Database)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {editImagePreview ? (
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-xl object-cover border border-earth-200 bg-white shadow-soft flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-earth-200/60 border border-earth-300 flex items-center justify-center text-stone-400 flex-shrink-0">
                      <Upload className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageFileChange}
                      className="block w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-botanical-700 file:text-white hover:file:bg-botanical-800 cursor-pointer"
                    />
                    <p className="text-[11px] text-stone-400">
                      Select a new image file to replace the current picture in MongoDB, or leave it unchanged.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  placeholder="Pure classical Ayurvedic formulation..."
                  className="w-full p-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Classical Herbs & Ingredients
                </label>
                <input
                  type="text"
                  value={editFormData.ingredients}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, ingredients: e.target.value })
                  }
                  placeholder="Kashmiri Kesar, Red Chandan, Manjistha, Sesame Oil"
                  className="w-full px-4 py-2.5 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                  <input
                    type="checkbox"
                    checked={editFormData.isFeatured}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, isFeatured: e.target.checked })
                    }
                    className="accent-botanical-700 rounded w-4 h-4"
                  />
                  <span>Mark as AYUSH Featured Harvest</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                  <input
                    type="checkbox"
                    checked={editFormData.bestSeller}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, bestSeller: e.target.checked })
                    }
                    className="accent-botanical-700 rounded w-4 h-4"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>
            </div>

            {/* Pinned Sticky Footer */}
            <div className="flex items-center justify-end gap-3 p-4 px-6 border-t border-earth-100 bg-earth-50/80 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-earth-200/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingEdit}
                className="bg-botanical-700 hover:bg-botanical-800 text-white px-7 py-2.5 rounded-xl text-xs font-bold shadow-card disabled:bg-stone-300 transition-colors"
              >
                {submittingEdit ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
