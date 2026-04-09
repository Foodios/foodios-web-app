import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  ShoppingBag, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Settings,
  Eye
} from "lucide-react";
import { adminService } from "../../../services/adminService";
import AddMerchantModal from "../modals/AddMerchantModal";

function InfoCard({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50/50 border border-stone-100">
      <div className="h-10 w-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[0.65rem] font-black text-stone-300 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-stone-900">{value || "Not provided"}</p>
      </div>
    </div>
  );
}

function StatItem({ label, value, subtext, color }: any) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">{label}</p>
      <p className={`text-xl font-black ${color || 'text-stone-950'} tracking-tight`}>{value}</p>
      {subtext && <p className="text-[0.65rem] font-bold text-stone-400">{subtext}</p>}
    </div>
  );
}

export default function MerchantDetail() {
  const { merchantId } = useParams();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchDetail = async () => {
    if (!merchantId) return;
    try {
      const result = await adminService.getMerchantDetail(merchantId);
      setMerchant(result.data);
    } catch (err) {
      console.error("Fetch detail error:", err);
      setError("Could not load merchant profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [merchantId]);

  const handleStatusToggle = async () => {
    if (!merchant) return;
    const newStatus = merchant.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'ACTIVE' ? 'Enable' : 'Disable'} this shop?`)) return;

    try {
      await adminService.updateMerchant(merchant.id, { ...merchant, status: newStatus });
      fetchDetail();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-stone-400">
        <Loader2 className="w-10 h-10 animate-spin text-stone-950 mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest">Loading Merchant Profile...</p>
      </div>
    );
  }

  if (error || !merchant) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-stone-400">
        <AlertTriangle className="w-10 h-10 text-red-400 mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest mb-4">{error || "Merchant not found"}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-stone-950 text-white rounded-xl text-xs font-black uppercase tracking-widest">Go Back</button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* Header */}
      <header className="flex flex-col gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-950 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[0.65rem] font-black uppercase tracking-widest">Back to Merchants</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-[32px] border-4 border-white shadow-2xl overflow-hidden bg-stone-50 flex items-center justify-center shrink-0">
               {merchant.logoUrl ? (
                 <img src={merchant.logoUrl} alt="" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-3xl">🏪</span>
               )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-stone-950 tracking-tight leading-none">{merchant.displayName || merchant.name}</h1>
                <div className={`px-3 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest border ${
                  merchant.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                }`}>
                  {merchant.status || 'ACTIVE'}
                </div>
              </div>
              <p className="text-sm font-medium text-stone-400 mt-3 flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-orange-500" />
                 Verified Elite Partner • Joined {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsEditModalOpen(true)}
                className="h-12 px-6 bg-white border border-stone-200 text-stone-600 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest hover:border-stone-950 hover:text-stone-950 transition-all shadow-sm active:scale-95"
             >
                Edit Basic Info
             </button>
             <button 
                onClick={handleStatusToggle}
                className={`h-12 px-8 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                  merchant.status === 'ACTIVE' 
                    ? 'bg-stone-950 text-white shadow-stone-200 hover:shadow-stone-300' 
                    : 'bg-green-600 text-white shadow-green-200 hover:shadow-green-300 hover:bg-green-700'
                }`}
             >
                {merchant.status === 'ACTIVE' ? 'Disable Shop' : 'Enable Shop'}
             </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-[40px] border border-stone-100 p-10 shadow-sm">
            <h3 className="text-[0.7rem] font-black text-stone-300 uppercase tracking-[0.2em] mb-8">Restaurant Intelligence</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               <StatItem label="Rating" value={Number(merchant.rating || 0).toFixed(1)} subtext={`From ${merchant.totalReviews || 0} reviews`} color="text-orange-500" />
               <StatItem label="Total Orders" value={merchant.totalOrders || "0"} subtext="All time performance" />
               <StatItem label="Revenue (MTD)" value={formatCurrency(merchant.mtdRevenue || 0)} subtext="VND this month" color="text-green-600" />
               <StatItem label="Commission" value={`${merchant.commissionRate || 15}%`} subtext="Contract: Elite-01" />
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-stone-100 p-10 shadow-sm">
            <h3 className="text-[0.7rem] font-black text-stone-300 uppercase tracking-[0.2em] mb-8">Merchant Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <InfoCard label="Cuisine Type" value={merchant.cuisineCategory} icon={ShoppingBag} />
               <InfoCard label="Business Address" value={merchant.location || merchant.address} icon={MapPin} />
               <InfoCard label="Phone Number" value={merchant.supportHotline || merchant.phone} icon={Phone} />
               <InfoCard label="Email Address" value={merchant.contactEmail || merchant.email} icon={Mail} />
               <InfoCard label="Website/Social" value={merchant.websiteUrl} icon={Globe} />
               <InfoCard label="Operational Hours" value={merchant.openingHours || "08:00 AM - 10:00 PM"} icon={Clock} />
            </div>
            
            <div className="mt-10 pt-10 border-t border-stone-50">
               <h4 className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest mb-4">Merchant Biography</h4>
               <p className="text-sm text-stone-500 leading-loose">
                  {merchant.description || "Foodios partner focused on delivering high-quality culinary experiences. Specializing in healthy and organic ingredients prepared by professional chefs."}
               </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">
           <div className="bg-stone-950 rounded-[48px] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.1),transparent_70%)]" />
               <div className="relative z-10">
                  <TrendingUp className="w-8 h-8 text-orange-500 mb-6" />
                  <h3 className="text-xl font-bold tracking-tight mb-2">Performance Spike</h3>
                  <p className="text-[0.7rem] font-medium text-stone-400 mb-8 leading-relaxed">This merchant has seen consistent growth since joining the platform.</p>
                  
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-4 mb-3">
                     <p className="text-[0.55rem] font-black text-stone-500 uppercase tracking-widest mb-1">Growth Index</p>
                     <div className="flex items-center justify-between">
                        <span className="text-lg font-black tracking-tight text-white">
                          {merchant.totalOrders > 100 ? "Top 5%" : "Emerging"}
                        </span>
                        <div className="h-6 px-2 bg-green-500/20 text-green-400 text-[0.6rem] font-black rounded-lg flex items-center justify-center uppercase">
                          {merchant.status}
                        </div>
                     </div>
                  </div>
               </div>
           </div>

           <div className="bg-white rounded-[40px] border border-stone-100 p-8 flex flex-col gap-3 shadow-sm">
              <h4 className="px-4 py-2 text-[0.65rem] font-black text-stone-300 uppercase tracking-[0.2em]">Quick Actions</h4>
              <button className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-all group border border-transparent hover:border-stone-100">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shadow-inner"><ShoppingBag className="w-4 h-4" /></div>
                    <span className="text-[0.7rem] font-black uppercase tracking-widest text-stone-800">View Menu</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-stone-950 transition-all" />
              </button>
              <button className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-all group border border-transparent hover:border-stone-100">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner"><Settings className="w-4 h-4" /></div>
                    <span className="text-[0.7rem] font-black uppercase tracking-widest text-stone-800">Manage Rules</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-stone-950 transition-all" />
              </button>
           </div>
        </div>
      </div>

      <AddMerchantModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onAdd={fetchDetail}
        editingMerchant={merchant}
      />
    </div>
  );
}
