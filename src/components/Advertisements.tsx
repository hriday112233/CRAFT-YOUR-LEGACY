import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Plus, Image as ImageIcon, Video, Send, X, User, Clock, Sparkles, Wand2 } from 'lucide-react';
import { generateAdContent } from '../services/gemini';

interface Ad {
  id: number;
  title: string;
  content: string;
  media_url: string;
  media_type: 'image' | 'video';
  author: string;
  timestamp: string;
}

export default function Advertisements() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    media_url: '',
    media_type: 'image' as 'image' | 'video',
    author: ''
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const res = await fetch('/api/ads');
    const data = await res.json();
    setAds(data);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const result = await generateAdContent(aiPrompt);
      if (result.title && result.content) {
        setFormData(prev => ({
          ...prev,
          title: result.title,
          content: result.content
        }));
        setAiPrompt('');
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ title: '', content: '', media_url: '', media_type: 'image', author: '' });
        setIsPosting(false);
        fetchAds();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Public <span className="gradient-text">Advertisements</span></h2>
          <p className="text-slate-500 font-medium">Share your updates, videos, and posts with the community.</p>
        </div>
        <button 
          onClick={() => setIsPosting(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Post Ad
        </button>
      </div>

      <AnimatePresence>
        {isPosting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsPosting(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-2xl font-black mb-8">Create New Advertisement</h3>
              
              <div className="mb-8 p-6 bg-brand/5 rounded-3xl border border-brand/10">
                <label className="block text-[10px] font-black text-brand uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sparkles size={12} /> Generate with AI
                </label>
                <div className="flex gap-3">
                  <input 
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    className="flex-1 px-5 py-3 rounded-xl bg-white border border-slate-100 focus:border-brand outline-none text-sm font-medium"
                    placeholder="e.g. New SEO course starting Monday"
                  />
                  <button 
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-brand-dark transition-all disabled:opacity-50"
                  >
                    {aiLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wand2 size={16} />}
                    Magic
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Title</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand outline-none font-bold"
                      placeholder="Catchy headline"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
                    <input 
                      required
                      value={formData.author}
                      onChange={e => setFormData({...formData, author: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand outline-none font-bold"
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Content</label>
                  <textarea 
                    required
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand outline-none font-medium h-32"
                    placeholder="What's on your mind?"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Media URL (Optional)</label>
                    <input 
                      value={formData.media_url}
                      onChange={e => setFormData({...formData, media_url: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand outline-none font-medium"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Media Type</label>
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, media_type: 'image'})}
                        className={`flex-1 py-4 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${formData.media_type === 'image' ? 'bg-brand text-white border-brand' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                      >
                        <ImageIcon size={18} /> Image
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, media_type: 'video'})}
                        className={`flex-1 py-4 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${formData.media_type === 'video' ? 'bg-brand text-white border-brand' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                      >
                        <Video size={18} /> Video
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="btn-primary w-full py-5 text-lg"
                >
                  {loading ? 'Posting...' : 'Publish Advertisement'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ads.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Megaphone size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-400">No advertisements yet.</h3>
            <p className="text-slate-400">Be the first to post something!</p>
          </div>
        ) : (
          ads.map((ad, i) => (
            <motion.div 
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card group"
            >
              {ad.media_url && (
                <div className="aspect-video overflow-hidden relative">
                  {ad.media_type === 'image' ? (
                    <img 
                      src={ad.media_url} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      alt={ad.title}
                    />
                  ) : (
                    <video 
                      src={ad.media_url} 
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-brand shadow-lg">
                    {ad.media_type === 'image' ? <ImageIcon size={16} /> : <Video size={16} />}
                  </div>
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-brand uppercase tracking-widest mb-4">
                  <Clock size={12} />
                  {new Date(ad.timestamp).toLocaleDateString()}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-brand transition-colors">{ad.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">{ad.content}</p>
                <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                  <div className="bg-slate-100 p-2 rounded-xl text-slate-400">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{ad.author}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
