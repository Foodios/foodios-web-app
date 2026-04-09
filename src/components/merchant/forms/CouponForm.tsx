import { X, Save, Loader2, Ticket, Tag, Calendar, Info, Settings, AlertCircle, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import { couponService } from "../../../services/couponService";

type CouponFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSuccess: () => void;
  merchantId: string;
};

function CouponForm({ isOpen, onClose, initialData, onSuccess, merchantId }: CouponFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    code: "",
    title: "",
    description: "",
    discountType: "PERCENT",
    discountValue: 0,
    currency: "VND",
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    stackable: false,
    autoApply: false,
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    usageLimit: 100,
    perUserLimit: 1,
    status: "ACTIVE"
  });

  // Currency Formatter
  const formatCurrency = (value: number | string) => {
    if (value === undefined || value === null || value === "") return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseCurrency = (value: string) => {
    return Number(value.replace(/\./g, ""));
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        startsAt: initialData.startsAt ? new Date(initialData.startsAt).toISOString().split('T')[0] : "",
        endsAt: initialData.endsAt ? new Date(initialData.endsAt).toISOString().split('T')[0] : ""
      });
    } else {
      setFormData({
        code: "",
        title: "",
        description: "",
        discountType: "PERCENT",
        discountValue: 0,
        currency: "VND",
        minOrderAmount: 0,
        maxDiscountAmount: 0,
        stackable: false,
        autoApply: false,
        startsAt: new Date().toISOString().split('T')[0],
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 100,
        perUserLimit: 1,
        status: "ACTIVE"
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else if (name === 'discountValue' && formData.discountType === 'FIXED_AMOUNT' || name === 'maxDiscountAmount' || name === 'minOrderAmount') {
        const rawValue = parseCurrency(value);
        if (isNaN(rawValue)) return;
        setFormData((prev: any) => ({ ...prev, [name]: rawValue }));
    } else {
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;

    setIsSubmitting(true);
    try {
      // Parse dates as local time to avoid timezone shifts
      const [sYear, sMonth, sDay] = formData.startsAt.split('-').map(Number);
      const [eYear, eMonth, eDay] = formData.endsAt.split('-').map(Number);
      
      const startsAt = new Date(sYear, sMonth - 1, sDay, 0, 0, 0).toISOString();
      const endsAt = new Date(eYear, eMonth - 1, eDay, 23, 59, 59).toISOString();

      const payload = {
        ...formData,
        merchantId,
        startsAt,
        endsAt
      };

      if (initialData?.id) {
        await couponService.updateCoupon(initialData.id, payload);
      } else {
        await couponService.createCoupon(payload);
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Coupon save error:", error);
      alert(error.message || "Failed to save coupon campaign.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <header className="px-12 py-10 border-b border-stone-100 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-black text-stone-950 tracking-tight">{initialData ? 'Edit Campaign' : 'Create New Campaign'}</h2>
                <p className="text-sm font-medium text-stone-400 font-outfit mt-1">Design your promotion and set your budget rules.</p>
            </div>
            <button onClick={onClose} className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-stone-50 transition-colors text-stone-300">
                <X className="w-6 h-6" />
            </button>
        </header>

        <form onSubmit={handleSubmit} className="px-12 py-10 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-12 gap-10">
                {/* Left Side: Basic Info */}
                <div className="col-span-12 lg:col-span-7 space-y-8">
                    <div className="space-y-6">
                        <div>
                            <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">
                                <Tag className="w-3.5 h-3.5" /> Campaign Title
                            </label>
                            <input 
                                type="text" 
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Summer Mega Discount"
                                className="w-full h-14 px-5 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all shadow-inner"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">
                                    <Ticket className="w-3.5 h-3.5" /> Coupon Code
                                </label>
                                <input 
                                    type="text" 
                                    name="code"
                                    required
                                    value={formData.code}
                                    onChange={handleChange}
                                    placeholder="e.g. SUMMER2026"
                                    className="w-full h-14 px-5 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-[0.7rem] font-black text-stone-950 transition-all shadow-inner uppercase tracking-widest"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">
                                    <Settings className="w-3.5 h-3.5" /> Discount Type
                                </label>
                                <select 
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleChange}
                                    className="w-full h-14 px-5 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 appearance-none transition-all shadow-inner"
                                >
                                    <option value="PERCENT">Percentage (%)</option>
                                    <option value="FIXED_AMOUNT">Fixed Amount (VND)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">
                                <Info className="w-3.5 h-3.5" /> Campaign Description
                            </label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Details about this promotion for your customers..."
                                className="w-full p-5 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all resize-none shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 p-8 bg-orange-50/50 rounded-[40px] border border-orange-100/30">
                        <div>
                            <label className="block text-[0.65rem] font-black uppercase tracking-widest text-orange-600 mb-3">
                                {formData.discountType === 'PERCENT' ? 'Discount Percentage' : 'Discount Amount'}
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="discountValue"
                                    required
                                    value={formData.discountType === 'PERCENT' ? formData.discountValue : formatCurrency(formData.discountValue)}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 rounded-xl bg-white border border-orange-200 outline-none text-sm font-black text-stone-950"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] font-black text-orange-400">
                                    {formData.discountType === 'PERCENT' ? '%' : 'VND'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[0.65rem] font-black uppercase tracking-widest text-orange-600 mb-3">Max Discount (Cap)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="maxDiscountAmount"
                                    value={formatCurrency(formData.maxDiscountAmount)}
                                    onChange={handleChange}
                                    disabled={formData.discountType === 'FIXED_AMOUNT'}
                                    className="w-full h-12 px-4 rounded-xl bg-white border border-orange-200 outline-none text-sm font-black text-stone-950 disabled:bg-stone-50 disabled:text-stone-300 transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] font-black text-orange-400">VND</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="flex items-center gap-4 bg-stone-50 p-5 rounded-2xl border border-stone-100">
                            <input 
                                type="checkbox" 
                                name="stackable"
                                checked={formData.stackable}
                                onChange={handleChange}
                                className="w-5 h-5 accent-stone-950 cursor-pointer"
                            />
                            <div className="flex flex-col">
                                <span className="text-[0.65rem] font-black uppercase tracking-widest text-stone-950">Stackable</span>
                                <span className="text-[0.6rem] font-bold text-stone-400">Combine with other promos</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-stone-50 p-5 rounded-2xl border border-stone-100">
                            <input 
                                type="checkbox" 
                                name="autoApply"
                                checked={formData.autoApply}
                                onChange={handleChange}
                                className="w-5 h-5 accent-stone-950 cursor-pointer"
                            />
                            <div className="flex flex-col">
                                <span className="text-[0.65rem] font-black uppercase tracking-widest text-stone-950">Auto-apply</span>
                                <span className="text-[0.6rem] font-bold text-stone-400">Apply at checkout automatically</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Limits & Rules */}
                <div className="col-span-12 lg:col-span-5 space-y-8">
                     <div className="p-8 bg-stone-950 rounded-[40px] text-white">
                        <h4 className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-orange-400 mb-8">
                            <Calendar className="w-3.5 h-3.5" /> Duration & Validity
                        </h4>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[0.6rem] font-black uppercase tracking-widest text-stone-500 mb-2.5">Start Date</label>
                                <input 
                                    type="date" 
                                    name="startsAt"
                                    value={formData.startsAt}
                                    onChange={handleChange}
                                    className="w-full bg-stone-900 border-none outline-none rounded-xl h-12 px-4 text-sm font-bold text-white shadow-inner"
                                />
                            </div>
                            <div>
                                <label className="block text-[0.6rem] font-black uppercase tracking-widest text-stone-500 mb-2.5">End Date</label>
                                <input 
                                    type="date" 
                                    name="endsAt"
                                    value={formData.endsAt}
                                    onChange={handleChange}
                                    className="w-full bg-stone-900 border-none outline-none rounded-xl h-12 px-4 text-sm font-bold text-white shadow-inner"
                                />
                            </div>
                        </div>
                     </div>

                     <div className="p-8 border border-stone-100 rounded-[40px] space-y-6">
                        <h4 className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-400 mb-4">
                            <TrendingDown className="w-3.5 h-3.5" /> Budget & Limits
                        </h4>
                        
                        <div>
                            <label className="block text-[0.6rem] font-black uppercase tracking-widest text-stone-400 mb-3">Min Order Amount</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="minOrderAmount"
                                    value={formatCurrency(formData.minOrderAmount)}
                                    onChange={handleChange}
                                    className="w-full h-11 px-4 bg-stone-50 border border-transparent rounded-xl outline-none focus:border-stone-100 text-sm font-bold text-stone-950 shadow-inner"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.6rem] font-black text-stone-300">đ</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[0.6rem] font-black uppercase tracking-widest text-stone-400 mb-3">Total Limit</label>
                                <input 
                                    type="number" 
                                    name="usageLimit"
                                    value={formData.usageLimit}
                                    onChange={handleChange}
                                    className="w-full h-11 px-4 bg-stone-50 border border-transparent rounded-xl outline-none focus:border-stone-100 text-sm font-bold text-stone-950 shadow-inner"
                                />
                            </div>
                            <div>
                                <label className="block text-[0.6rem] font-black uppercase tracking-widest text-stone-400 mb-3">Per User Limit</label>
                                <input 
                                    type="number" 
                                    name="perUserLimit"
                                    value={formData.perUserLimit}
                                    onChange={handleChange}
                                    className="w-full h-11 px-4 bg-stone-50 border border-transparent rounded-xl outline-none focus:border-stone-100 text-sm font-bold text-stone-950 shadow-inner"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[0.6rem] font-black uppercase tracking-widest text-stone-400 mb-3">Campaign Status</label>
                            <select 
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={`w-full h-11 px-4 rounded-xl border border-transparent outline-none text-sm font-black transition-all shadow-inner appearance-none ${
                                    formData.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/30">
                            <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[0.6rem] font-bold text-blue-600 leading-relaxed italic">
                                Campaigns with limits help control costs. We recommend setting a total usage cap.
                            </p>
                        </div>
                     </div>
                </div>
            </div>
        </form>

        <footer className="px-12 py-10 bg-stone-50/50 border-t border-stone-100 flex items-center justify-end gap-3">
            <button 
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-8 h-14 rounded-2xl text-[0.7rem] font-black uppercase tracking-widest text-stone-400 hover:bg-stone-100 transition-all font-sans"
            >
                Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.title || !formData.code}
              className="px-10 h-14 rounded-2xl bg-stone-950 text-white text-[0.7rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-stone-200 active:scale-95 transition-all disabled:opacity-50"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> : <Save className="w-4 h-4 text-orange-500" />}
                {initialData ? 'Update Campaign' : 'Publish Promotion'}
            </button>
        </footer>
      </div>
    </div>
  );
}

export default CouponForm;
