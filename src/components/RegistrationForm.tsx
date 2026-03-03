import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Pricing {
  basePrice: number;
  discount: number;
  finalPrice: number;
  remainingDiscountSeats: number;
}

export default function RegistrationForm({ onRegister }: { onRegister: (email: string) => void }) {
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(setPricing)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pricePaid: pricing?.finalPrice
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        onRegister(formData.email);
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message);
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center"
      >
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-emerald-500" size={64} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
        <p className="text-slate-600 mb-6">Welcome to Bhaav Institute. You can now access your course dashboard.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-brand text-white px-6 py-2 rounded-full font-medium"
        >
          Go to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="p-8 border-b border-slate-100">
        <h2 className="text-2xl font-bold mb-2">Register for Digital Marketing Course</h2>
        <p className="text-slate-500">Master SEO, SEM, Social Media, and more.</p>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand outline-none"
                placeholder="john@example.com"
              />
            </div>
            
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              disabled={status === 'loading'}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Complete Registration'}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl">
          <h3 className="font-bold mb-4">Pricing Summary</h3>
          {pricing ? (
            <div className="space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Base Price</span>
                <span className="line-through">₹{pricing.basePrice.toLocaleString()}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Early Bird Discount (50%)</span>
                  <span>-₹{(pricing.basePrice * 0.5).toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-3 flex justify-between items-end">
                <span className="font-bold text-lg">Final Price</span>
                <span className="text-3xl font-black text-brand">₹{pricing.finalPrice.toLocaleString()}</span>
              </div>
              
              {pricing.remainingDiscountSeats > 0 && (
                <div className="mt-6 bg-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-bold text-center uppercase tracking-wider">
                  Only {pricing.remainingDiscountSeats} discounted seats left!
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-brand" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
