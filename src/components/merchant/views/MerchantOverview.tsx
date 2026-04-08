import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Star,
  Activity,
  ArrowRight,
  UtensilsCrossed,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { UserGrowthChart } from "../../admin/Charts";
import { merchantService } from "../../../services/merchantService";

function SmallStatCard({ title, value, change, color, icon: Icon, suffix = "" }: any) {
  const isPositive = change >= 0;
  return (
    <div className="bg-white p-6 rounded-[32px] border border-stone-100 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-black uppercase tracking-widest border ${isPositive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
          {isPositive ? '+' : ''}{change}%
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        </div>
      </div>
      <div>
        <h4 className="text-[0.7rem] font-black uppercase text-stone-300 tracking-[0.2em] mb-1">{title}</h4>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-stone-950 tracking-tight">{value}</span>
            <span className="text-xs font-bold text-stone-400">{suffix}</span>
        </div>
      </div>
    </div>
  );
}

function MerchantOverview() {
  const { merchant } = useOutletContext<{ merchant: any }>();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!merchant?.id && !merchant?.merchantId) return;
      try {
        const result = await merchantService.getDashboardStats(merchant.id || merchant.merchantId);
        setStats(result.data);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [merchant]);

  return (
    <div className="flex flex-col gap-8 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-[24px] border-2 border-orange-500 p-1 flex items-center justify-center bg-white shadow-xl shadow-orange-100/50 overflow-hidden shrink-0">
                 {merchant?.logoUrl ? (
                   <img src={merchant.logoUrl} alt={merchant.merchantName} className="w-full h-full object-cover" />
                 ) : (
                   <div className="h-full w-full bg-orange-50 flex items-center justify-center rounded-[18px]">
                        <span className="text-2xl font-black text-orange-600">
                            {merchant?.merchantName?.charAt(0).toUpperCase() || "🏪"}
                        </span>
                   </div>
                 )}
              </div>
              <div>
                 <h1 className="text-2xl font-black text-stone-950 tracking-tight capitalize leading-none">{merchant?.merchantName || "Merchant Shop"}</h1>
                 <p className="text-sm font-medium text-stone-400 mt-2 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-orange-500" />
                    {merchant?.description || "Foodios Elite Partner"} • <span className={`font-bold uppercase tracking-widest text-[0.65rem] ${merchant?.merchantStatus === 'ACTIVE' ? 'text-green-500' : 'text-orange-500'}`}>
                      {merchant?.merchantStatus || "ACTIVE"}
                    </span>
                 </p>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <Link 
             to={`/restaurant/${merchant?.merchantSlug || merchant?.slug}`}
             className="h-12 px-6 bg-white border border-stone-100 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest text-stone-500 hover:text-stone-950 transition shadow-sm flex items-center justify-center"
           >
             Public Page
           </Link>
           <button className="h-12 px-8 bg-stone-950 text-white rounded-2xl text-[0.65rem] font-black uppercase tracking-widest shadow-xl shadow-stone-200 transition-all active:scale-95">Edit Brand</button>
        </div>
      </header>

      {/* Main Stats */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-[32px] border border-stone-50 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SmallStatCard 
                title="Daily Revenue" 
                value={(stats?.dailyRevenue || 0).toLocaleString()} 
                suffix="VND"
                change={stats?.revenueChange || 0} 
                color="bg-orange-50 text-orange-600" 
                icon={DollarSign} 
            />
            <SmallStatCard 
                title="Total Orders" 
                value={stats?.totalOrders || 0} 
                change={stats?.ordersChange || 0} 
                color="bg-blue-50 text-blue-600" 
                icon={ShoppingBag} 
            />
            <SmallStatCard 
                title="Active Customers" 
                value={stats?.newCustomers || 0} 
                change={stats?.customersChange || 0} 
                color="bg-green-50 text-green-600" 
                icon={Users} 
            />
            <SmallStatCard 
                title="Merchant Rating" 
                value={stats?.avgReview || 4.5} 
                suffix="/ 5.0"
                change={stats?.reviewsChange || 0} 
                color="bg-yellow-50 text-yellow-600" 
                icon={Star} 
            />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-[48px] border border-stone-100 p-10 shadow-sm flex flex-col gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 h-40 w-40 bg-orange-500/5 blur-3xl opacity-50 rounded-full" />
           <header className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-lg font-black text-stone-950 tracking-tight">Revenue Analytics</h3>
                <p className="text-xs font-medium text-stone-400 mt-1">Net revenue across all platform branches.</p>
              </div>
              <div className="flex items-center gap-4 text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">
                 <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-stone-950" /> Online</div>
                 <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-stone-200" /> POS</div>
              </div>
           </header>
           <div className="flex-1 min-h-[300px]">
              <UserGrowthChart />
           </div>
        </div>

        {/* Live Status Sidebar */}
        <div className="flex flex-col gap-6">
           <div className="bg-stone-950 rounded-[48px] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.2),transparent_70%)]" />
              <div className="relative z-10">
                  <Activity className="w-8 h-8 text-orange-500 mb-6 group-hover:scale-125 transition-transform duration-500" />
                  <h3 className="text-xl font-bold tracking-tight mb-2">Systems Online</h3>
                  <p className="text-[0.7rem] font-medium text-stone-400 mb-8 max-w-[200px] leading-relaxed">Your shop is currently accepting orders and visible to customers.</p>
                  
                  <div className="flex flex-col gap-3">
                     <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[0.6rem] font-black text-stone-500 uppercase tracking-widest">Efficiency</span>
                        <span className="text-sm font-black text-white">98.4%</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/20">
                        <span className="text-[0.6rem] font-black text-stone-500 uppercase tracking-widest">Wait Time</span>
                        <span className="text-sm font-black text-green-400">12 min</span>
                     </div>
                  </div>
              </div>
           </div>

           <div className="bg-white rounded-[40px] border border-stone-100 p-8 flex flex-col gap-3 shadow-sm">
              <h4 className="px-4 py-2 text-[0.65rem] font-black text-stone-300 uppercase tracking-[0.2em]">Operations</h4>
              <button className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-all group border border-transparent hover:border-stone-100">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shadow-inner"><UtensilsCrossed className="w-4 h-4" /></div>
                    <span className="text-[0.7rem] font-black uppercase tracking-widest text-stone-800">Print Menu</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-stone-200 group-hover:text-stone-900 transition-all opacity-0 group-hover:opacity-100" />
              </button>
              <button className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-all group border border-transparent hover:border-stone-100">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner"><Users className="w-4 h-4" /></div>
                    <span className="text-[0.7rem] font-black uppercase tracking-widest text-stone-800">Customers</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-stone-200 group-hover:text-stone-900 transition-all opacity-0 group-hover:opacity-100" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

export default MerchantOverview;
