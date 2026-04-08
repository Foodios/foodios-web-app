import { 
  ArrowLeft, 
  Calendar, 
  Ticket, 
  Trash2, 
  Edit2, 
  Loader2, 
  TrendingUp, 
  Users, 
  Target, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Copy
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { couponService } from "../../../services/couponService";
import CouponForm from "../forms/CouponForm";

function PromotionDetail() {
  const { promoId } = useParams<{ promoId: string }>();
  const { merchant } = useOutletContext<{ merchant: any }>();
  const navigate = useNavigate();
  
  const [coupon, setCoupon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchDetail = async () => {
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!promoId || !merchantId) return;

    setIsLoading(true);
    try {
      const result = await couponService.getCouponDetail(promoId, merchantId);
      setCoupon(result.data || result);
    } catch (err) {
      console.error("Fetch detail error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [promoId, merchant]);

  const handleDelete = async () => {
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!promoId || !merchantId || !window.confirm("Are you sure you want to delete this promotion?")) return;

    try {
      await couponService.deleteCoupon(promoId, merchantId);
      navigate("/merchant/promotions");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete promotion.");
    }
  };

  const copyCode = () => {
    if (coupon?.code) {
      navigator.clipboard.writeText(coupon.code);
      alert("Coupon code copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-stone-200 animate-spin mb-6" />
        <p className="text-[0.6rem] font-black text-stone-300 uppercase tracking-widest leading-relaxed text-center">Verifying campaign data...</p>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="text-center py-32">
        <p className="text-stone-400 font-bold italic mb-6 text-sm">Promotion not found or has been removed.</p>
        <button onClick={() => navigate("/merchant/promotions")} className="text-[0.65rem] font-black text-stone-950 underline underline-offset-8 uppercase tracking-widest">Back to Promotions</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate("/merchant/promotions")}
            className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white border border-stone-100 text-stone-400 hover:text-stone-950 hover:bg-stone-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
               <span className={`px-2.5 py-0.5 rounded-full text-[0.55rem] font-black uppercase tracking-widest border ${
                  coupon.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-stone-50 text-stone-400 border-stone-100'
               }`}>
                  {coupon.status}
               </span>
               <span className="text-[0.6rem] font-black text-stone-300 uppercase tracking-widest font-sans italic">ID: {promoId?.slice(0, 8)}</span>
            </div>
            <h1 className="text-xl font-black text-stone-950 tracking-tight leading-tight uppercase">{coupon.title || coupon.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="h-12 bg-white border border-stone-100 text-stone-950 rounded-[20px] px-6 text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-sm hover:bg-stone-50 transition-all active:scale-95"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Campaign
          </button>
          <button 
            onClick={handleDelete}
            className="h-12 bg-red-500 text-white rounded-[20px] px-6 text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-xl transition-all active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
           {/* Visual Coupon Card */}
           <div className="relative overflow-hidden bg-stone-950 rounded-[36px] p-10 text-white">
              <div className="absolute top-0 right-0 w-56 h-56 bg-orange-600/20 blur-[100px] rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                       <Ticket className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="text-[0.55rem] font-black uppercase tracking-[0.3em] text-stone-500">Merchant Promotion</span>
                 </div>
                 
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter mb-3 leading-none uppercase">
                           {coupon.discountType === 'PERCENT' ? `${coupon.discountValue}%` : `${(coupon.discountValue || 0).toLocaleString()}đ`} OFF
                        </h2>
                        <p className="text-base font-medium text-stone-400 max-w-sm leading-relaxed">{coupon.description || 'No additional description provided for this promotion.'}</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm p-5 rounded-[28px] border border-white/10 shrink-0 text-center md:text-left">
                       <p className="text-[0.55rem] font-black uppercase tracking-widest text-orange-500 mb-3 ml-1">Promo Code</p>
                       <div className="flex items-center gap-5">
                          <span className="text-2xl font-black tracking-[0.1em] tabular-nums uppercase">{coupon.code}</span>
                          <button onClick={copyCode} className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/20 transition-all">
                             <Copy className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Detailed Rules */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-7 rounded-[32px] border border-stone-100 shadow-sm">
                 <h4 className="flex items-center gap-2.5 text-[0.6rem] font-black uppercase tracking-[0.2em] text-stone-400 mb-6 font-sans">
                    <Target className="w-3.5 h-3.5" /> Conditions & Rules
                 </h4>
                 <div className="space-y-5">
                    <div className="flex items-center justify-between">
                       <span className="text-[0.7rem] font-bold text-stone-500">Min Order</span>
                       <span className="text-sm font-black text-stone-950">{(coupon.minOrderAmount || 0).toLocaleString()}đ</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-stone-50 pt-3.5">
                       <span className="text-[0.7rem] font-bold text-stone-500">Max Discount</span>
                       <span className="text-sm font-black text-stone-950">
                          {coupon.discountType === 'FIXED_AMOUNT' ? 'Unlimited' : (coupon.maxDiscountAmount ? `${Number(coupon.maxDiscountAmount).toLocaleString()}đ` : 'No Cap')}
                       </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-stone-50 pt-3.5">
                       <span className="text-[0.7rem] font-bold text-stone-500">Stackable</span>
                       <div className={`px-3 py-1 rounded-full text-[0.55rem] font-black uppercase tracking-widest ${coupon.stackable ? 'bg-green-50 text-green-600' : 'bg-stone-50 text-stone-400'}`}>
                          {coupon.stackable ? 'YES' : 'NO'}
                       </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-stone-50 pt-3.5">
                       <span className="text-[0.7rem] font-bold text-stone-500">Auto-Apply</span>
                       <div className={`px-3 py-1 rounded-full text-[0.55rem] font-black uppercase tracking-widest ${coupon.autoApply ? 'bg-blue-50 text-blue-600' : 'bg-stone-50 text-stone-400'}`}>
                          {coupon.autoApply ? 'YES' : 'NO'}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-7 rounded-[32px] border border-stone-100 shadow-sm">
                 <h4 className="flex items-center gap-2.5 text-[0.6rem] font-black uppercase tracking-[0.2em] text-stone-400 mb-6 font-sans">
                    <Clock className="w-3.5 h-3.5" /> Validity Range
                 </h4>
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-orange-600" />
                       </div>
                       <div>
                          <p className="text-[0.55rem] font-black uppercase text-stone-400 tracking-widest mb-0.5">Effective From</p>
                          <p className="text-[0.75rem] font-black text-stone-950 uppercase">{new Date(coupon.startsAt).toLocaleDateString()} — {new Date(coupon.startsAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="h-10 w-10 rounded-xl bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100">
                          <Calendar className="w-4 h-4 text-stone-400" />
                       </div>
                       <div>
                          <p className="text-[0.55rem] font-black uppercase text-stone-400 tracking-widest mb-0.5">Expires On</p>
                          <p className="text-[0.75rem] font-black text-stone-950 uppercase">{coupon.endsAt ? `${new Date(coupon.endsAt).toLocaleDateString()} — ${new Date(coupon.endsAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'INFINITE'}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Sidebar: Performance Metrics */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-white p-7 rounded-[40px] border border-stone-100 shadow-sm">
              <h4 className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-stone-400 mb-6 text-center font-sans italic">Real-time Performance</h4>
              
              <div className="space-y-8">
                 <div className="text-center">
                    <p className="text-[0.6rem] font-black uppercase text-stone-400 tracking-widest mb-1.5 font-sans">Total redemptions</p>
                    <h3 className="text-4xl font-black text-stone-950 tracking-tighter">{coupon.redemptionCount || coupon.currentUsage || 0}</h3>
                    <div className="mt-2 flex items-center justify-center gap-1.5">
                       <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                       <span className="text-[0.55rem] font-black text-green-600 uppercase">+12% vs last week</span>
                    </div>
                 </div>

                 <div className="space-y-5 pt-4 border-t border-stone-50">
                    <div>
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[0.55rem] font-black uppercase text-stone-400">Total Usage Limit</span>
                          <span className="text-[0.55rem] font-black text-stone-950">{coupon.redemptionCount || coupon.currentUsage || 0} / {coupon.usageLimit || '∞'}</span>
                       </div>
                       <div className="h-2.5 bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                          <div 
                             className="h-full bg-stone-950 rounded-full transition-all duration-1000" 
                             style={{ width: `${coupon.usageLimit ? ((coupon.redemptionCount || coupon.currentUsage || 0) / coupon.usageLimit) * 100 : 0}%` }} 
                          />
                       </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-4 bg-stone-50 rounded-2xl border border-stone-100/50">
                       <Users className="w-4 h-4 text-stone-300 shrink-0" />
                       <div>
                          <p className="text-[0.65rem] font-black text-stone-950 leading-tight uppercase tracking-wide">User Limit</p>
                          <p className="text-[0.55rem] font-bold text-stone-500 mt-1 uppercase tracking-widest">Max {coupon.perUserLimit || 1} x Person</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-orange-50/20 p-6 rounded-[32px] border border-orange-100/30">
              <div className="flex items-center gap-2.5 mb-3">
                 <AlertCircle className="w-4 h-4 text-orange-600" />
                 <h4 className="text-[0.6rem] font-black uppercase tracking-widest text-orange-600 font-sans">Merchant Tip</h4>
              </div>
              <p className="text-[0.65rem] font-bold text-orange-700/60 leading-relaxed italic">
                 Promotions with a minimum spend of 150k VND tend to perform 25% better for dinner items.
              </p>
           </div>
        </div>
      </div>

      <CouponForm 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={coupon}
        onSuccess={fetchDetail}
        merchantId={merchant?.id || merchant?.merchantId}
      />
    </div>
  );
}

export default PromotionDetail;
