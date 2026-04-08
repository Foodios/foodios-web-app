import { 
  Plus, 
  Search, 
  Loader2, 
  Ticket, 
  Calendar, 
  Users, 
  Edit2, 
  Trash2, 
  MoreHorizontal
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { couponService } from "../../../services/couponService";
import CouponForm from "../forms/CouponForm";

function PromotionsManagement() {
  const { merchant } = useOutletContext<{ merchant: any }>();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const fetchCoupons = useCallback(async () => {
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!merchantId) return;

    setIsLoading(true);
    try {
      const result = await couponService.getCoupons(merchantId, activeTab !== 'ALL' ? activeTab : undefined);
      
      let couponList = [];
      if (Array.isArray(result.data)) {
        couponList = result.data;
      } else if (result.data && Array.isArray(result.data.coupons)) {
        couponList = result.data.coupons;
      } else if (Array.isArray(result)) {
        couponList = result;
      }
      
      setCoupons(couponList || []);
    } catch (err) {
      console.error("Fetch coupons error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [merchant, activeTab]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, coupon: any) => {
    e.stopPropagation();
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, couponId: string) => {
    e.stopPropagation();
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!merchantId || !window.confirm("Are you sure you want to delete this promotion?")) return;

    try {
      await couponService.deleteCoupon(couponId, merchantId);
      setCoupons(coupons.filter(c => c.id !== couponId));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete coupon.");
    }
  };

  const displayedCoupons = coupons.filter(c => 
    c.code?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-stone-950 tracking-tight uppercase">Promotions & Coupons</h1>
          <p className="text-sm font-medium text-stone-500 mt-1">Boost your sales with targeted discount campaigns.</p>
        </div>
        
        <button 
           onClick={openCreateModal}
           className="h-12 px-8 bg-stone-950 text-white rounded-2xl text-[0.7rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-stone-200 hover:bg-orange-600 transition-all active:scale-95"
        >
           <Plus className="w-4 h-4" />
           Create Coupon
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-[32px] border border-stone-100 flex items-center gap-6 shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
               <Ticket className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[0.6rem] font-black text-stone-300 uppercase tracking-widest mb-1">Active Coupons</p>
               <p className="text-xl font-black text-stone-950">{displayedCoupons.filter(c => c.status === 'ACTIVE').length}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-stone-100 flex items-center gap-6 shadow-sm">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
               <Users className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[0.6rem] font-black text-stone-300 uppercase tracking-widest mb-1">Total Usage</p>
               <p className="text-xl font-black text-stone-950">
                  {displayedCoupons.reduce((sum, c) => sum + (c.redemptionCount || c.currentUsage || 0), 0).toLocaleString()} 
                  <span className="text-[0.65rem] text-stone-400 font-bold ml-1">times</span>
               </p>
            </div>
         </div>
      </div>

      <div className="bg-white p-3 rounded-[32px] border border-stone-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center p-1.5 bg-stone-50 rounded-[22px] border border-stone-100 w-fit">
            {["ALL", "ACTIVE", "EXPIRED", "DRAFT"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-[18px] text-[0.7rem] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? "bg-white text-stone-950 shadow-sm" 
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {tab}
              </button>
            ))}
         </div>

         <div className="flex flex-1 max-w-md items-center gap-3 bg-stone-50 px-5 rounded-2xl border border-stone-100 h-11 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/5 transition-all group">
            <Search className="w-4 h-4 text-stone-300 group-focus-within:text-stone-950" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[0.75rem] font-bold placeholder:text-stone-300 text-stone-950 font-sans" 
              placeholder="Search by coupon code or name..." 
            />
         </div>
      </div>

      <div className="bg-white rounded-[48px] border border-stone-100 shadow-sm overflow-hidden">
         {isLoading ? (
           <div className="py-32 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-stone-100 animate-spin mb-4" />
              <p className="text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Loading campaign data...</p>
           </div>
         ) : coupons.length === 0 ? (
           <div className="py-24 text-center">
              <Ticket className="w-12 h-12 text-stone-100 mx-auto mb-6" />
              <p className="text-stone-400 font-bold italic mb-6">You haven't created any campaigns yet.</p>
              <button 
                onClick={openCreateModal}
                className="text-sm font-black text-stone-950 underline underline-offset-8"
              >
                Launch your first campaign
              </button>
           </div>
         ) : (
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-stone-50">
                       <th className="pl-10 py-8 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Promotion Name</th>
                       <th className="px-8 py-8 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Code / Discount</th>
                       <th className="px-8 py-8 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Usage</th>
                       <th className="px-8 py-8 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Status</th>
                       <th className="pr-10 py-8 text-right text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-50">
                    {displayedCoupons.map((coupon) => (
                      <tr 
                        key={coupon.id} 
                        onClick={() => navigate(`/merchant/promotions/${coupon.id}`)}
                        className="group hover:bg-stone-50/50 transition-all cursor-pointer"
                      >
                         <td className="pl-10 py-7">
                            <h3 className="text-base font-black text-stone-950 tracking-tight uppercase group-hover:text-orange-600 transition-colors">
                              {coupon.title || coupon.name || "Untitled Promotion"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                               <Calendar className="w-3.5 h-3.5 text-stone-300" />
                               <span className="text-[0.65rem] font-bold text-stone-400 uppercase tracking-widest">EXP: {coupon.endsAt ? new Date(coupon.endsAt).toLocaleDateString() : 'NO EXPIRY'}</span>
                            </div>
                         </td>
                         <td className="px-8 py-7">
                            <span className="px-3 py-1 bg-stone-100 rounded-lg text-[0.65rem] font-black text-stone-500 tracking-widest">{coupon.code}</span>
                            <div className="mt-2 text-sm font-black text-orange-600">
                               {coupon.discountType === 'PERCENT' ? `${coupon.discountValue}% OFF` : `${(coupon.discountValue || 0).toLocaleString()}đ OFF`}
                            </div>
                         </td>
                         <td className="px-8 py-7">
                            <p className="text-sm font-bold text-stone-600">{coupon.usageLimit ? `${coupon.redemptionCount || coupon.currentUsage || 0}/${coupon.usageLimit} times` : `${coupon.redemptionCount || coupon.currentUsage || 0} times`}</p>
                         </td>
                         <td className="px-8 py-7">
                            <div className={`w-fit px-4 py-1.5 rounded-full text-[0.6rem] font-black uppercase tracking-widest border ${
                              coupon.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-stone-50 text-stone-400 border-stone-100'
                            }`}>
                               {coupon.status}
                            </div>
                         </td>
                         <td className="pr-10 py-7 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                               <button 
                                 onClick={(e) => openEditModal(e, coupon)}
                                 className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-50 border border-stone-100 text-stone-400 hover:bg-stone-950 hover:text-white transition-all shadow-sm"
                               >
                                  <Edit2 className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={(e) => handleDelete(e, coupon.id)}
                                 className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-50 border border-stone-100 text-red-300 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                               <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-50 border border-stone-100 text-stone-400">
                                  <MoreHorizontal className="w-4.5 h-4.5" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
         )}
      </div>

      <CouponForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingCoupon}
        onSuccess={fetchCoupons}
        merchantId={merchant?.id || merchant?.merchantId}
      />
    </div>
  );
}

export default PromotionsManagement;
