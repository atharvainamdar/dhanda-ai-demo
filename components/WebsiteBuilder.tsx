'use client';

import { useState } from 'react';
import { useBusiness } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Eye,
  CheckCircle2,
  Loader2,
  Edit3,
  Sparkles,
  ExternalLink,
  Phone,
  Mail,
  Star,
  MapPin,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './CustomIcons';

const PAGES = ['Home', 'Products', 'Checkout', 'Contact'];

const BRAND_COLORS: Record<string, string> = {
  'SweetLayer': '#F97316',
  'BloomBox': '#10B981',
  'CocoCraft': '#8B5CF6',
  'TreatNest': '#EC4899',
  'GiftNest': '#3B82F6',
  'SugarArt': '#F59E0B',
  'ChocoJoy': '#EF4444',
  'BouquetBar': '#06B6D4',
  'GiftingCraft': '#6366F1',
  'IndulgeBox': '#84CC16',
  'SugarNest': '#F97316',
  'CraveCraft': '#8B5CF6',
};

export default function WebsiteBuilder() {
  const { state, dispatch } = useBusiness();
  const router = useRouter();
  const [activePage, setActivePage] = useState('Home');
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const brandName = state.brandingChoices?.name || 'YourBrand';
  const brandColor = BRAND_COLORS[brandName] || '#F97316';

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise(r => setTimeout(r, 3000));
    setIsPublishing(false);
    setPublished(true);
    dispatch({ type: 'SET_WEBSITE_READY', ready: true });
    dispatch({ type: 'COMPLETE_MISSION', missionId: 'website' });
    dispatch({ type: 'START_MISSION', missionId: 'launch' });
    await new Promise(r => setTimeout(r, 500));
    router.push('/build?mission=launch');
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#3B82F615' }}>
          <Globe className="w-6 h-6" style={{ color: '#3B82F6' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Website Builder</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Visual editor — design and publish without code</p>
        </div>
        {published && (
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Live
          </div>
        )}
      </div>

      {/* Page tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-xl inline-flex" style={{ background: 'var(--bg-elevated)' }}>
        {PAGES.map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: activePage === page ? 'var(--bg-surface)' : 'transparent',
              color: activePage === page ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activePage === page ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Website preview */}
        <div className="lg:col-span-3">
          {/* Browser chrome */}
          <div className="rounded-t-2xl overflow-hidden" style={{ border: '1px solid var(--border)', borderBottom: 'none' }}>
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#F5F5F5', borderBottom: '1px solid #E5E5E5' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28CA41' }} />
              </div>
              <div className="flex-1 mx-4 h-6 rounded-md flex items-center px-3 gap-2" style={{ background: 'white', border: '1px solid #E5E5E5' }}>
                <Globe className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>www.{brandName.toLowerCase().replace(/\s/g, '')}.com</span>
              </div>
              <Eye className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </div>

            {/* Website content */}
            <div className="p-0" style={{ background: 'white', minHeight: '400px' }}>
              {activePage === 'Home' && (
                <div>
                  {/* Hero */}
                  <div className="p-8 text-center" style={{ background: `linear-gradient(135deg, ${brandColor}10, ${brandColor}05)` }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: brandColor }}>
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--primary)' }}>{brandName}</h1>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Handcrafted chocolate bouquets for every occasion</p>
                    <button className="px-6 py-2 rounded-full text-sm font-bold text-white" style={{ background: brandColor }}>
                      Shop Now
                    </button>
                  </div>
                  {/* Products grid */}
                  <div className="p-6">
                    <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--primary)' }}>Our Bestsellers</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                          <div className="h-20 flex items-center justify-center" style={{ background: `${brandColor}10` }}>
                            <div className="w-12 h-12 rounded-xl" style={{ background: brandColor, opacity: 0.3 }} />
                          </div>
                          <div className="p-2">
                            <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>Chocolate Bouquet</p>
                            <p className="text-xs font-bold" style={{ color: brandColor }}>₹{799 + i * 200}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Social proof */}
                  <div className="px-8 pb-8 text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4" fill="#F59E0B" stroke="#F59E0B" />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>4.9 rating from 234 happy customers</p>
                  </div>
                </div>
              )}

              {activePage === 'Products' && (
                <div className="p-8">
                  <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--primary)' }}>All Products</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                        <div className="h-32 flex items-center justify-center" style={{ background: `${brandColor}10` }}>
                          <div className="w-16 h-16 rounded-2xl" style={{ background: brandColor, opacity: 0.2 }} />
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Premium Bouquet {i}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-bold" style={{ color: brandColor }}>₹{599 + i * 150}</span>
                            <span className="text-xs" style={{ color: 'var(--secondary)' }}>In Stock</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePage === 'Contact' && (
                <div className="p-8">
                  <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--primary)' }}>Get in Touch</h2>
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-elevated)' }}>
                      <Mail className="w-4 h-4" style={{ color: brandColor }} />
                      <span className="text-sm">hello@{brandName.toLowerCase().replace(/\s/g, '')}.com</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-elevated)' }}>
                      <Phone className="w-4 h-4" style={{ color: brandColor }} />
                      <span className="text-sm">+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-elevated)' }}>
                      <MapPin className="w-4 h-4" style={{ color: brandColor }} />
                      <span className="text-sm">Pune, Maharashtra</span>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#E1306C20' }}>
                        <InstagramIcon size={20} style={{ color: '#E1306C' }} />
                      </div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1877F220' }}>
                        <FacebookIcon size={20} style={{ color: '#1877F2' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePage === 'Checkout' && (
                <div className="p-8 max-w-sm mx-auto">
                  <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--primary)' }}>Checkout</h2>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: 'var(--bg-elevated)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg" style={{ background: `${brandColor}20` }} />
                        <span className="text-sm">Chocolate Bouquet x1</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: brandColor }}>₹799</span>
                    </div>
                    <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: 'var(--bg-elevated)' }}>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Delivery</span>
                      <span className="text-sm font-bold" style={{ color: 'var(--secondary)' }}>Free</span>
                    </div>
                    <div className="p-3 rounded-xl flex items-center justify-between" style={{ borderTop: '2px solid var(--border)' }}>
                      <span className="font-bold">Total</span>
                      <span className="text-lg font-bold" style={{ color: brandColor }}>₹799</span>
                    </div>
                    <button className="w-full py-3 rounded-xl font-bold text-white" style={{ background: brandColor }}>
                      Place Order via WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor sidebar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--primary)' }}>Website Settings</h3>
            <div className="space-y-3">
              {[
                { label: 'Business Name', value: brandName },
                { label: 'Tagline', value: 'Handcrafted chocolate bouquets' },
                { label: 'Phone', value: '+91 98765 43210' },
                { label: 'Email', value: `hello@${brandName.toLowerCase().replace(/\s/g, '')}.com` },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{field.label}</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2"
                      style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}
                    />
                    <Edit3 className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--primary)' }}>Integrations</h3>
            <div className="space-y-2">
              {['Instagram Feed', 'WhatsApp Order', 'Google Maps', 'SEO Optimization', 'Payment Gateway'].map((integration) => (
                <div key={integration} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{integration}</span>
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Publish */}
          <div className="p-5 rounded-2xl" style={{ background: brandColor + '10', border: `1px solid ${brandColor}40` }}>
            {!published ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4" style={{ color: brandColor }} />
                  <span className="text-sm font-semibold" style={{ color: brandColor }}>Ready to publish</span>
                </div>
                <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Your website is configured with all integrations. Click publish to make it live.
                </p>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all btn-press disabled:opacity-70"
                  style={{ background: brandColor }}
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Publish Website
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--secondary)' }} />
                <p className="font-bold" style={{ color: 'var(--secondary)' }}>Website is Live!</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>www.{brandName.toLowerCase().replace(/\s/g, '')}.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}