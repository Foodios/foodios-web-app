import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Plus, Loader2, AlertCircle, Percent, Calendar, Tag, Zap, Image as ImageIcon, MoreHorizontal } from "lucide-react";
import { adminService } from "../../../services/adminService";

function PromotionsView() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';
  
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPromos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.getGlobalPromotions();
      const rawData = result.data || result;
      const finalData = Array.isArray(rawData) ? rawData : (rawData.items || rawData.content || []);
      setPromotions(finalData);
    } catch (err) {
      console.error("Fetch promos error:", err);
      setError("Failed to load global promotions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const filteredPromos = promotions.filter(promo => {
    const matchesSearch = promo.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         promo.code?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (activeTab === 'all') return true;
    if (activeTab === 'coupons') return promo.type === 'COUPON';
    if (activeTab === 'flash-sales') return promo.type === 'FLASH_SALE';
    if (activeTab === 'banner-ads') return promo.type === 'BANNER';
    return true;
  });

  const getPromoIcon = (type: string) => {
    switch (type) {
      case 'COUPON': return <Tag className="w-5 h-5 text-blue-500" />;
      case 'FLASH_SALE': return <Zap className="w-5 h-5 text-orange-500" />;
      case 'BANNER': return <ImageIcon className="w-5 h-5 text-purple-500" />;
      default: return <Percent className="w-5 h-5 text-stone-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-stone-950">Global Promotions</h1>
          <p className="text-sm text-stone-500 mt-1">Manage platform-wide discounts, flash sales, and marketing banners.</p>
        </div>
        <button className="flex items-center gap-2 bg-stone-950 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-800 transition-all shadow-lg active:scale-95">
          <Plus className="w-4 h-4" />
          Create Promotion
        </button>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
           { label: "Active Campaigns", value: promotions.filter(p => p.status === 'Active').length.toString(), icon: Tag, color: "text-blue-600", bg: "bg-blue-50" },
           { label: "Total Promotions", value: promotions.length.toString(), icon: Percent, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-stone-950">{stat.value}</h3>
            </div>
            <div className={`h-12 w-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-[28px] border border-stone-100 shadow-sm">
        <div className="flex items-center gap-2">
            <h3 className="px-4 text-sm font-bold text-stone-950">Active Campaigns</h3>
        </div>
        <div className="relative flex items-center bg-stone-50 border border-stone-100 rounded-2xl px-4 h-10 min-w-[300px] focus-within:ring-2 focus-within:ring-stone-950/5 transition-all">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            className="w-full bg-transparent border-none outline-none px-3 text-sm text-stone-950 placeholder:text-stone-400 font-medium"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code or title..."
          />
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-sm min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Promotion Details</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Target & Type</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Schedule</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Status</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                <tr>
                   <td colSpan={5} className="px-6 py-20 text-center text-stone-400 font-bold">
                     <Loader2 className="w-8 h-8 text-stone-950 animate-spin mx-auto mb-4" />
                     Fetching global promotions...
                   </td>
                </tr>
              ) : error ? (
                <tr>
                   <td colSpan={5} className="px-6 py-20 text-center text-red-500 font-bold">
                     <AlertCircle className="w-8 h-8 mx-auto mb-4" />
                     {error}
                   </td>
                </tr>
              ) : filteredPromos.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-20 text-center text-stone-400 font-bold">No promotions found for this category.</td>
                </tr>
              ) : (
                filteredPromos.map((promo) => (
                  <tr key={promo.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-stone-50 flex items-center justify-center border border-stone-100 group-hover:scale-110 transition-transform shadow-sm">
                           {getPromoIcon(promo.type)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-950">{promo.title}</h4>
                          <span className="text-[0.65rem] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md uppercase tracking-widest inline-block mt-1">CODE: {promo.code || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-stone-700">{promo.discountValue}{promo.discountType === 'PERCENT' ? '%' : 'đ'} OFF</span>
                        <span className="text-[0.65rem] font-medium text-stone-400 uppercase tracking-tight">Platform Wide</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-stone-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{promo.startDate} - {promo.endDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold border ${
                         promo.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-stone-50 text-stone-400 border-stone-100'
                       }`}>
                         <div className={`h-1.5 w-1.5 rounded-full ${promo.status === 'Active' ? 'bg-green-500' : 'bg-stone-300'}`} />
                         {promo.status}
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-stone-50 text-stone-400 hover:bg-stone-950 hover:text-white transition-all shadow-sm border border-stone-100 active:scale-90">
                         <MoreHorizontal className="w-4.5 h-4.5" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PromotionsView;
