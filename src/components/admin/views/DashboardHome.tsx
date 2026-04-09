import { 
  UserGrowthChart, 
  TrafficByLocation, 
  OrderHealthChart
} from "../Charts";
import { TrendingUp, TrendingDown, MoreHorizontal, Star, Zap, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { adminService } from "../../../services/adminService";

function StatCard({ title, value, percentage, isPositive, isLoading }: any) {
  if (isLoading) {
    return (
      <div className="p-6 rounded-[24px] bg-white border border-stone-100 flex flex-col justify-between h-32 animate-pulse">
        <div className="h-3 w-20 bg-stone-100 rounded" />
        <div className="flex items-center justify-between">
            <div className="h-6 w-24 bg-stone-100 rounded" />
            <div className="h-4 w-12 bg-stone-100 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-[24px] ${title === 'Views' ? 'bg-blue-50/50' : 'bg-stone-50/50'} border border-stone-200/20`}>
      <h4 className="text-[0.75rem] font-bold text-stone-900 mb-2">{title}</h4>
      <div className="flex items-center justify-between mt-4">
        <span className="text-2xl font-bold tracking-tight text-stone-950">{value}</span>
        <div className="flex items-center gap-1">
          <span className="text-[0.7rem] font-bold text-stone-950">
            {isPositive ? '+' : ''}{percentage}%
          </span>
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-stone-950" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-stone-950" />
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardHome() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReIndexing, setIsReIndexing] = useState(false);

  const handleReIndex = async () => {
    if (!window.confirm("This will refresh the entire search index across the system. Continue?")) return;
    
    setIsReIndexing(true);
    try {
      await adminService.reIndexSearch();
      alert("System-wide re-indexing triggered successfully! Changes will reflect in search results shortly.");
    } catch (err) {
      console.error("Re-index error:", err);
      alert("Failed to trigger re-index. Please check system logs.");
    } finally {
      setIsReIndexing(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await adminService.getDashboardStats();
        setStats(result.data);
      } catch (err) {
        console.error("Fetch admin dashboard error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-6 font-sans">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-sm font-bold text-stone-950 uppercase tracking-widest flex items-center gap-2">
            Global Analytics 
            <span className="px-2 py-0.5 bg-stone-100 text-[0.6rem] rounded text-stone-400">Live</span>
        </h1>
        <div className="flex items-center gap-3">
            <button 
              onClick={handleReIndex}
              disabled={isReIndexing}
              className="h-10 px-5 bg-stone-950 text-white rounded-xl text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isReIndexing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />}
              Re-index Search
            </button>
            <div className="text-[0.7rem] font-bold text-stone-400 uppercase tracking-widest bg-white border border-stone-100 px-4 py-2 rounded-xl shadow-sm">
                Jan 1 - Apr 8, 2026
            </div>
        </div>
      </header>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Orders" 
            value={stats?.summary?.totalOrders?.value || "0"} 
            percentage={stats?.summary?.totalOrders?.changePercentage || 0} 
            isPositive={stats?.summary?.totalOrders?.isIncrease ?? true} 
            isLoading={isLoading}
        />
        <StatCard 
            title="Revenue" 
            value={stats?.summary?.totalRevenue?.value || "$0"} 
            percentage={stats?.summary?.totalRevenue?.changePercentage || 0} 
            isPositive={stats?.summary?.totalRevenue?.isIncrease ?? true} 
            isLoading={isLoading}
        />
        <StatCard 
            title="Active Merchants" 
            value={stats?.summary?.activeMerchants?.value || "0"} 
            percentage={stats?.summary?.activeMerchants?.changePercentage || 0} 
            isPositive={stats?.summary?.activeMerchants?.isIncrease ?? true} 
            isLoading={isLoading}
        />
        <StatCard 
            title="New Customers" 
            value={stats?.summary?.newCustomers?.value || "0"} 
            percentage={stats?.summary?.newCustomers?.changePercentage || 0} 
            isPositive={stats?.summary?.newCustomers?.isIncrease ?? true} 
            isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Area Chart Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm relative pt-8">
          <header className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-6">
              <h4 className="text-[0.8rem] font-bold text-stone-950 underline underline-offset-8 decoration-stone-200">Revenue Growth</h4>
              <h4 className="text-[0.8rem] font-bold text-stone-400">Order Volume</h4>
            </div>
            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-stone-50 transition-colors">
                <MoreHorizontal className="w-4 h-4 text-stone-400" />
            </button>
          </header>
          {isLoading ? (
             <div className="h-[300px] w-full bg-stone-50 animate-pulse rounded-2xl" />
          ) : (
             <UserGrowthChart 
                labels={stats?.analytics?.labels}
                onlineData={stats?.analytics?.revenueData}
                posData={stats?.analytics?.orderVolumeData}
             />
          )}
        </div>

        {/* Category Distribution card */}
        <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
          <h4 className="text-sm font-bold text-stone-950 mb-10 underline underline-offset-8 decoration-stone-200">Category Share</h4>
          {isLoading ? (
             <div className="h-40 w-full bg-stone-50 animate-pulse rounded-2xl" />
          ) : (
             <TrafficByLocation data={stats?.categoryDistribution} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Merchants Table */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-bold text-stone-950 uppercase tracking-widest">Top Performing Merchants</h4>
              <button className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest hover:text-stone-950 transition-colors">View All</button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-left border-b border-stone-50">
                       <th className="pb-4 text-[0.6rem] font-black text-stone-300 uppercase tracking-[0.2em]">Merchant</th>
                       <th className="pb-4 text-[0.6rem] font-black text-stone-300 uppercase tracking-[0.2em]">Revenue</th>
                       <th className="pb-4 text-[0.6rem] font-black text-stone-300 uppercase tracking-[0.2em]">Orders</th>
                       <th className="pb-4 text-[0.6rem] font-black text-stone-300 uppercase tracking-[0.2em]">Rating</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-50">
                    {isLoading ? (
                       [1,2,3,4,5].map(i => (
                          <tr key={i} className="animate-pulse">
                             <td className="py-4 flex items-center gap-3">
                                <div className="h-8 w-8 bg-stone-50 rounded-full" />
                                <div className="h-3 w-24 bg-stone-50 rounded" />
                             </td>
                             <td className="py-4"><div className="h-3 w-16 bg-stone-50 rounded" /></td>
                             <td className="py-4"><div className="h-3 w-10 bg-stone-50 rounded" /></td>
                             <td className="py-4"><div className="h-3 w-12 bg-stone-50 rounded" /></td>
                          </tr>
                       ))
                    ) : (
                       stats?.topMerchants?.map((merchant: any) => (
                          <tr key={merchant.id} className="group hover:bg-stone-50/50 transition-colors">
                             <td className="py-4">
                                <div className="flex items-center gap-3">
                                   <div className="h-10 w-10 rounded-xl bg-white border border-stone-100 p-1 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                                      {merchant.logo ? (
                                         <img src={merchant.logo} alt={merchant.name} className="w-full h-full object-cover" />
                                      ) : (
                                         <span className="text-xs font-black text-stone-300 uppercase">{merchant.name.charAt(0)}</span>
                                      )}
                                   </div>
                                   <div className="flex flex-col">
                                      <span className="text-[0.7rem] font-black text-stone-950 uppercase tracking-wider">{merchant.name}</span>
                                      <span className="text-[0.6rem] font-bold text-stone-400">Elite Partner</span>
                                   </div>
                                </div>
                             </td>
                             <td className="py-4 text-[0.7rem] font-black text-stone-800 tracking-tight">{merchant.revenue}</td>
                             <td className="py-4 text-[0.7rem] font-bold text-stone-500">{merchant.orders}</td>
                             <td className="py-4">
                                <div className="flex items-center gap-1">
                                   <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                   <span className="text-[0.7rem] font-black text-stone-950">{merchant.rating}</span>
                                </div>
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Order Health Vertical Bar Chart */}
        <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm flex flex-col">
          <h4 className="text-sm font-bold text-stone-950 mb-10 uppercase tracking-widest">Order Status Health</h4>
          <div className="flex-1">
            {isLoading ? (
               <div className="h-[240px] w-full bg-stone-50 animate-pulse rounded-2xl" />
            ) : (
               <OrderHealthChart data={stats?.orderHealth} />
            )}
          </div>
          
          <div className="mt-8 pt-8 border-t border-stone-50 grid grid-cols-2 gap-4">
             <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="text-[0.55rem] font-black text-orange-400 uppercase tracking-widest mb-1">Attention</p>
                <p className="text-sm font-black text-orange-600">{stats?.orderHealth?.find((h: any) => h.label === 'Pending')?.count || 0} Pending</p>
             </div>
             <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                <p className="text-[0.55rem] font-black text-green-400 uppercase tracking-widest mb-1">In Transit</p>
                <p className="text-sm font-black text-green-600">{stats?.orderHealth?.find((h: any) => h.label === 'Delivering')?.count || 0} Drivers</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
