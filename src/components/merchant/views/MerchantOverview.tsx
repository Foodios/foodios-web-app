import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Star,
  Activity,
  ArrowRight
} from "lucide-react";
import { UserGrowthChart } from "../../admin/Charts";

function SmallStatCard({ title, value, change, color, icon: Icon }: any) {
  const isPositive = change > 0;
  return (
    <div className="bg-white p-6 rounded-[32px] border border-stone-100 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300">
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
        <span className="text-2xl font-black text-stone-950 tracking-tight">{value}</span>
      </div>
    </div>
  );
}

function MerchantOverview() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
           <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-full border-2 border-orange-500 p-1 flex items-center justify-center bg-white shadow-xl shadow-orange-100">
                 <span className="text-2xl">🍕</span>
              </div>
              <div>
                 <h1 className="text-2xl font-black text-stone-950 tracking-tight">Pizza 4P's Ben Thanh</h1>
                 <p className="text-sm font-medium text-stone-400 mt-1 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    District 1, Ho Chi Minh City • <span className="text-green-500 font-bold uppercase tracking-widest text-[0.65rem]">Open now</span>
                 </p>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="h-12 px-6 bg-white border border-stone-100 rounded-2xl text-sm font-bold text-stone-500 hover:text-stone-950 transition shadow-sm">View Public Page</button>
           <button className="h-12 px-6 bg-stone-950 text-white rounded-2xl text-sm font-bold shadow-lg shadow-stone-200 transition-all active:scale-95">Edit Shop Detail</button>
        </div>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SmallStatCard title="Daily Revenue" value="12,450,000đ" change={12.5} color="bg-orange-50 text-orange-600" icon={DollarSign} />
        <SmallStatCard title="Total Orders" value="142" change={-2.4} color="bg-blue-50 text-blue-600" icon={ShoppingBag} />
        <SmallStatCard title="New Customers" value="84" change={18.9} color="bg-green-50 text-green-600" icon={Users} />
        <SmallStatCard title="Reviews (Avg)" value="4.9 / 5" change={5.2} color="bg-yellow-50 text-yellow-600" icon={Star} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-stone-100 p-8 shadow-sm flex flex-col gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 h-40 w-40 bg-orange-500/5 blur-3xl opacity-50 rounded-full" />
           <header className="flex items-center justify-between relative z-10">
              <h3 className="text-lg font-black text-stone-950 tracking-tight">Revenue Analytics</h3>
              <div className="flex items-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-widest">
                 <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-stone-950" /> Online Orders</div>
                 <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-stone-200" /> Walk-in</div>
              </div>
           </header>
           <div className="flex-1 min-h-[300px]">
              <UserGrowthChart />
           </div>
        </div>

        {/* Live Status Sidebar */}
        <div className="flex flex-col gap-6">
           {/* Terminal Monitor Card */}
           <div className="bg-stone-950 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.2),transparent_70%)]" />
              <Activity className="w-8 h-8 text-orange-500 mb-6 group-hover:scale-125 transition-transform duration-500" />
              <h3 className="text-xl font-bold tracking-tight mb-2">Service is active</h3>
              <p className="text-sm font-medium text-stone-400 mb-8 max-w-[200px]">Receiving orders for District 1, 3, and 7.</p>
              
              <div className="flex flex-col gap-3">
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Efficiency</span>
                    <span className="text-sm font-bold text-white">98%</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Wait Time</span>
                    <span className="text-sm font-bold text-green-400">12 min</span>
                 </div>
              </div>
           </div>

           {/* Quick Action List */}
           <div className="bg-white rounded-[40px] border border-stone-100 p-6 flex flex-col gap-2 shadow-sm">
              <h4 className="px-4 py-2 text-[0.65rem] font-black text-stone-300 uppercase tracking-[0.2em]">Quick Access</h4>
              <button className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><UtensilsCrossed className="w-4 h-4" /></div>
                    <span className="text-[0.85rem] font-bold text-stone-800">Print Daily Menu</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-stone-200 group-hover:text-stone-900 transition-all opacity-0 group-hover:opacity-100" />
              </button>
              <button className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Users className="w-4 h-4" /></div>
                    <span className="text-[0.85rem] font-bold text-stone-800">Customers Database</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-stone-200 group-hover:text-stone-900 transition-all opacity-0 group-hover:opacity-100" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

import { UtensilsCrossed } from "lucide-react";

export default MerchantOverview;
