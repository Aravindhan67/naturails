import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, Filter, X } from 'lucide-react';
import { api } from '../api/api';
import { ProductCard } from '../components/ProductCard';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sort, setSort] = useState('featured');

  const categories = [
    'All',
    'Skincare',
    'Haircare',
    'Essential Oils',
    'Wellness & Teas',
    'Handmade Soaps',
    'Body Care',
  ];

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = {};
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.category = selectedCategory;
        }
        if (search) {
          queryParams.search = search;
        }
        if (sort) {
          queryParams.sort = sort;
        }

        const data = await api.getProducts(queryParams);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 250);
    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, search, sort]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-earth-100/60 rounded-3xl p-8 sm:p-12 border border-earth-200/70 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-botanical-700">
          The Living Apothecary
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-botanical-900">
          Botanical Catalog & Pure Harvest
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
          Explore pure wild-crafted botanicals, fresh cold-pressed serums, therapeutic grade oils, 
          and restorative herbal teas made without compromises.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-3xl p-6 border border-earth-200 shadow-soft space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search herbs, oils, teas..."
              className="w-full text-xs pl-10 pr-8 py-3 rounded-2xl bg-earth-50 border border-earth-200 focus:outline-none focus:border-botanical-600 text-stone-800"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown & Product Counter */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs text-stone-500 font-medium">
              Showing <strong>{products.length}</strong> botanical items
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs bg-earth-50 border border-earth-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none focus:border-botanical-600"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-earth-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-botanical-700 text-white shadow-sm'
                  : 'bg-earth-100/70 text-stone-700 hover:bg-earth-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-earth-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-earth-200 p-8 space-y-4">
          <span className="text-5xl">🌿</span>
          <h3 className="font-serif text-xl font-bold text-botanical-900">
            No botanical items match your filter
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query or selecting another organic category.
          </p>
          <button
            onClick={() => {
              setSearch('');
              handleCategoryChange('All');
            }}
            className="bg-botanical-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-botanical-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
