import { 
  UserGrowthChart, 
  TrafficByWebsite, 
  TrafficByDevice, 
  TrafficByLocation 
} from "../Charts";
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";

function StatCard({ title, value, percentage, isPositive }: any) {
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
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-sm font-bold text-stone-950">Today <span className="text-stone-300 ml-1">⌵</span></h1>
      </header>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value="1,284" percentage="11.01" isPositive={true} />
        <StatCard title="Revenue" value="$42,367" percentage="0.03" isPositive={false} />
        <StatCard title="Active Merchants" value="842" percentage="15.03" isPositive={true} />
        <StatCard title="New Customers" value="2,156" percentage="6.08" isPositive={true} />
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
          <UserGrowthChart />
        </div>

        {/* Traffic by website card */}
        <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
          <h4 className="text-sm font-bold text-stone-950 mb-10 underline underline-offset-8 decoration-stone-200">Traffic by Website</h4>
          <TrafficByWebsite />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic by device bar chart */}
        <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
          <h4 className="text-sm font-bold text-stone-950 mb-10">Live Orders by Device</h4>
          <TrafficByDevice />
        </div>

        {/* Traffic by location pie chart */}
        <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm flex flex-col">
          <h4 className="text-sm font-bold text-stone-950 mb-10">Customer Distribution</h4>
          <div className="flex-1 flex flex-col justify-center">
            <TrafficByLocation />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
