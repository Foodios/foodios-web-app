import React, { useState, useEffect } from 'react';
import { X, Store, MapPin, Phone, Mail, Clock, ShieldCheck, Image, Camera } from 'lucide-react';

interface AddMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (merchant: any) => void;
}

const AddMerchantModal: React.FC<AddMerchantModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Italian',
    location: '',
    phone: '',
    email: '',
    openingHours: '09:00 - 22:00',
    status: 'Active',
    logo: '🍕'
  });

  const categories = ['Italian', 'Vietnamese', 'Dessert', 'Fine Dining', 'BBQ', 'Healthy', 'Japanese', 'Fast Food'];

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: `M${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      rating: 0.0,
      orders: 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md animate-backdrop-in"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/20 animate-modal-in">
        
        {/* Header */}
        <div className="bg-stone-50/50 px-8 py-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-stone-950 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-stone-950/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-950">Add New Merchant</h2>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mt-0.5">Register a new partner store</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-fill bg-white border border-stone-100 text-stone-400 hover:text-stone-950 hover:bg-stone-50 transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-8 py-8 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Logo Upload Mock */}
            <div className="col-span-full mb-2">
              <label className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest block mb-3">Merchant Branding</label>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[32px] bg-stone-50 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-300 group-hover:border-stone-400 group-hover:bg-stone-100 transition-all cursor-pointer">
                    <Camera className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-bold">Upload Logo</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-stone-200 rounded-xl flex items-center justify-center shadow-sm text-stone-400 group-hover:text-stone-950 transition-colors">
                    <Image className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1">
                   <p className="text-sm font-medium text-stone-600 mb-1">Upload merchant representative icon</p>
                   <p className="text-[0.7rem] text-stone-400">JPG, PNG or GIF. Max size 2MB. Recommendation: 1:1 ratio square image for better display.</p>
                </div>
              </div>
            </div>

            {/* General Info */}
            <div className="space-y-4">
              <div>
                <label className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest block mb-2 px-1">Merchant Name</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Pizza 4P's"
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-stone-950 placeholder:text-stone-300 focus:bg-white focus:ring-4 focus:ring-stone-950/5 focus:border-stone-300 transition-all outline-none"
                  />
                  <Store className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-200" />
                </div>
              </div>

              <div>
                <label className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest block mb-2 px-1">Cuisine Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-stone-950 focus:bg-white focus:ring-4 focus:ring-stone-950/5 focus:border-stone-300 transition-all outline-none appearance-none"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest block mb-2 px-1">Opening Hours</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.openingHours}
                    onChange={(e) => setFormData({...formData, openingHours: e.target.value})}
                    placeholder="09:00 - 22:00"
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-stone-950 placeholder:text-stone-300 focus:bg-white focus:ring-4 focus:ring-stone-950/5 focus:border-stone-300 transition-all outline-none"
                  />
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-200" />
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="space-y-4">
              <div>
                <label className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest block mb-2 px-1">Location / District</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. District 1, HCMC"
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-stone-950 placeholder:text-stone-300 focus:bg-white focus:ring-4 focus:ring-stone-950/5 focus:border-stone-300 transition-all outline-none"
                  />
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-200" />
                </div>
              </div>

              <div>
                <label className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest block mb-2 px-1">Contact Email</label>
                <div className="relative">
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="partner@example.com"
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-stone-950 placeholder:text-stone-300 focus:bg-white focus:ring-4 focus:ring-stone-950/5 focus:border-stone-300 transition-all outline-none"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-200" />
                </div>
              </div>

              <div>
                <label className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest block mb-2 px-1">Support Hotline</label>
                <div className="relative">
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+84 900 000 000"
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-stone-950 placeholder:text-stone-300 focus:bg-white focus:ring-4 focus:ring-stone-950/5 focus:border-stone-300 transition-all outline-none"
                  />
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-200" />
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="col-span-full pt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-sm font-bold text-stone-900">Auto-verify merchant after creation</span>
              </div>
              <div 
                className="w-12 h-6 bg-stone-950 rounded-full relative cursor-pointer"
                onClick={() => {}}
              >
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex items-center gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] h-14 bg-stone-950 text-white rounded-2xl text-sm font-bold shadow-xl shadow-stone-950/20 hover:bg-stone-800 transition-all active:scale-95"
            >
              Confirm and Add Merchant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMerchantModal;
