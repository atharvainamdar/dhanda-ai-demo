'use client';

import { useState } from 'react';
import { useBusiness } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  Package,
} from 'lucide-react';

const SUPPLIER_CATEGORIES = [
  { name: 'Chocolate', icon: Package, count: 8 },
  { name: 'Packaging', icon: Package, count: 5 },
  { name: 'Ribbon & Bow', icon: Package, count: 4 },
  { name: 'Gift Boxes', icon: Package, count: 6 },
  { name: 'Accessories', icon: Package, count: 3 },
];

const SUPPLIERS = [
  { id: 1, name: 'Mumbai Choco Co.', category: 'Chocolate', rating: 4.8, reviews: 234, priceRange: '₹₹', delivery: 'Same day', location: 'Mumbai', badge: 'Best Value', color: '#10B981' },
  { id: 2, name: 'Premium Cocoa Imports', category: 'Chocolate', rating: 4.9, reviews: 189, priceRange: '₹₹₹', delivery: '2-3 days', location: 'Delhi', badge: 'Best Quality', color: '#3B82F6' },
  { id: 3, name: 'Swift Packaging Solutions', category: 'Packaging', rating: 4.6, reviews: 156, priceRange: '₹', delivery: 'Same day', location: 'Pune', badge: 'Fastest Delivery', color: '#F97316' },
  { id: 4, name: 'GiftWrap Pro', category: 'Packaging', rating: 4.5, reviews: 98, priceRange: '₹', delivery: '1 day', location: 'Mumbai', badge: null, color: '#6B7280' },
  { id: 5, name: 'Silk Ribbon House', category: 'Ribbon & Bow', rating: 4.7, reviews: 145, priceRange: '₹₹', delivery: '2 days', location: 'Surat', badge: 'Best Quality', color: '#3B82F6' },
  { id: 6, name: 'EcoBox Packaging', category: 'Gift Boxes', rating: 4.4, reviews: 67, priceRange: '₹₹', delivery: '3-4 days', location: 'Bangalore', badge: null, color: '#6B7280' },
  { id: 7, name: 'IndiaCraft Boxes', category: 'Gift Boxes', rating: 4.8, reviews: 201, priceRange: '₹', delivery: '2 days', location: 'Pune', badge: 'Best Value', color: '#10B981' },
  { id: 8, name: 'ChocoWorld Wholesale', category: 'Chocolate', rating: 4.3, reviews: 312, priceRange: '₹', delivery: '1 day', location: 'Nashik', badge: 'Best Value', color: '#10B981' },
];

export default function SuppliersPanel() {
  const { state, dispatch } = useBusiness();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Chocolate');
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [filter, setFilter] = useState<'all' | 'best-value' | 'best-quality' | 'fastest'>('all');
  const [added, setAdded] = useState(false);

  const filtered = SUPPLIERS.filter(s => {
    const matchesCategory = s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'best-value' && s.badge === 'Best Value') ||
      (filter === 'best-quality' && s.badge === 'Best Quality') ||
      (filter === 'fastest' && s.badge === 'Fastest Delivery');
    return matchesCategory && matchesSearch && matchesFilter;
  });

  const toggleSupplier = (id: number) => {
    setSelectedSuppliers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleConnect = async () => {
    if (selectedSuppliers.length === 0) return;
    setAdded(true);
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'suppliers' });
    await new Promise(r => setTimeout(r, 1000));
    router.push('/build?mission=website');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#F59E0B15' }}>
          <Truck className="w-6 h-6" style={{ color: '#F59E0B' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Supplier Finder</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>18 verified suppliers found for your business</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#10B98115', color: '#10B981' }}>
          <TrendingUp className="w-3.5 h-3.5" />
          AI-to-AI sourcing active
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {SUPPLIER_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => { setSelectedCategory(cat.name); setSelectedSuppliers([]); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              background: selectedCategory === cat.name ? '#F59E0B' : 'var(--bg-surface)',
              color: selectedCategory === cat.name ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.name}
            <span style={{ opacity: 0.7 }}>({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        {(['all', 'best-value', 'best-quality', 'fastest'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-full text-xs transition-all"
            style={{
              background: filter === f ? '#F59E0B' : 'var(--bg-elevated)',
              color: filter === f ? 'white' : 'var(--text-secondary)',
            }}
          >
            {f === 'all' ? 'All' : f === 'best-value' ? 'Best Value' : f === 'best-quality' ? 'Best Quality' : 'Fastest'}
          </button>
        ))}
      </div>

      {/* Suppliers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filtered.map((supplier) => (
          <div
            key={supplier.id}
            onClick={() => toggleSupplier(supplier.id)}
            className={`p-5 rounded-2xl cursor-pointer transition-all card-hover ${selectedSuppliers.includes(supplier.id) ? 'ring-2' : ''}`}
            style={{
background: 'var(--bg-surface)',
                border: selectedSuppliers.includes(supplier.id) ? `2px solid ${supplier.color}` : '1px solid var(--border)',
              }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{supplier.name}</h4>
                  {supplier.badge && (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                      style={{ background: supplier.color }}
                    >
                      {supplier.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{supplier.category}</p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: supplier.color,
                  background: selectedSuppliers.includes(supplier.id) ? supplier.color : 'transparent',
                }}
              >
                {selectedSuppliers.includes(supplier.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-0.5">
                  <Star className="w-3 h-3 fill-current" style={{ color: '#F59E0B' }} />
                  <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>{supplier.rating}</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{supplier.reviews} reviews</p>
              </div>
              <div className="text-center">
                <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>{supplier.priceRange}</span>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Price</p>
              </div>
              <div className="text-center">
                <Clock className="w-3 h-3 mx-auto" style={{ color: 'var(--secondary)' }} />
                <p className="text-xs font-medium" style={{ color: 'var(--secondary)' }}>{supplier.delivery}</p>
              </div>
              <div className="text-center">
                <MapPin className="w-3 h-3 mx-auto" style={{ color: 'var(--text-muted)' }} />
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{supplier.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-5 flex items-center justify-between" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div>
          <p className="font-semibold" style={{ color: 'var(--primary)' }}>Selected Suppliers</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {selectedSuppliers.length} of {filtered.length} in {selectedCategory}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/build?mission=website')}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Skip for now
          </button>
          <button
            onClick={handleConnect}
            disabled={selectedSuppliers.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all btn-press disabled:opacity-50"
            style={{ background: 'var(--accent)' }}
          >
            {added ? <CheckCircle2 className="w-4 h-4" /> : null}
            {added ? 'Connected!' : `Connect with ${selectedSuppliers.length} Supplier${selectedSuppliers.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}