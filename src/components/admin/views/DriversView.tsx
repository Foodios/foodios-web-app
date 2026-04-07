import { Plus, Bike, Activity, Star, Smartphone, MoreHorizontal } from "lucide-react";

const drivers = [
  { id: "D001", name: "Trần Thế Vinh", avatar: "👨🏻‍💼", status: "Active", battery: 85, vehicle: "Wave Alpha", rating: 4.8, orders: 12 },
  { id: "D002", name: "Nguyễn Công Tuấn", avatar: "👨🏻‍🚒", status: "Busy", battery: 42, vehicle: "Winner X", rating: 4.9, orders: 8 },
  { id: "D003", name: "Lý Gia Hưng", avatar: "👨🏻‍🎓", status: "Offline", battery: 0, vehicle: "Sirius", rating: 4.7, orders: 0 },
  { id: "D004", name: "Phạm Minh Hoàng", avatar: "👨🏻‍🔧", status: "Active", battery: 92, vehicle: "Exciter", rating: 4.6, orders: 15 },
];

function DriversView() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-stone-950 text-white flex items-center justify-center">
             <Bike className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-950">Driver Fleet</h1>
            <p className="text-sm text-stone-500 mt-1">Manage riders, payouts, and real-time delivery performance.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-stone-950 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-800 transition-all shadow-lg">
          <Plus className="w-4 h-4" />
          Onboard Rider
        </button>
      </header>

      {/* Driver Map Placeholder / Stats Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-[32px] border border-stone-200 p-6 min-h-[300px] flex flex-col justify-center items-center gap-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <Activity className="w-12 h-12 text-stone-200" />
            <div className="text-center">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-1">Live Riders Map</h3>
              <p className="text-[0.8rem] text-stone-400 font-medium">Tracking 42 riders across 12 districts.</p>
            </div>
            <button className="relative z-10 px-4 py-2 bg-stone-100 rounded-lg text-[0.7rem] font-bold text-stone-600 hover:bg-stone-200 transition-all">Launch Radar</button>
         </div>
         <div className="flex flex-col gap-4">
            {[
              { label: "Active Riders", value: 42, icon: Bike, color: "text-green-600 bg-green-50" },
              { label: "Pending KYC", value: 5, icon: Star, color: "text-orange-600 bg-orange-50" },
              { label: "Device Health", value: "98%", icon: Smartphone, color: "text-blue-600 bg-blue-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-[28px] border border-stone-100 flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                       <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[0.6rem] font-black uppercase tracking-widest text-stone-300">{stat.label}</p>
                       <h4 className="text-xl font-bold text-stone-950">{stat.value}</h4>
                    </div>
                 </div>
                 <div className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-lg">+12%</div>
              </div>
            ))}
         </div>
      </div>

      {/* Driver List */}
      <div className="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/20">
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Rider</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Status</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Device</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Performance</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">ID</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest opacity-0 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id} className="border-b border-stone-50 hover:bg-stone-50/20 transition-all group">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-stone-100 flex items-center justify-center text-xl shadow-sm border border-stone-200">
                         {driver.avatar}
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-stone-950 group-hover:text-orange-600 transition-colors">{driver.name}</h4>
                         <p className="text-[0.7rem] font-medium text-stone-400 uppercase tracking-tighter">{driver.vehicle}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold border ${
                    driver.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 
                    driver.status === 'Busy' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-stone-50 text-stone-400 border-stone-100'
                   }`}>
                     <div className={`h-1.5 w-1.5 rounded-full ${
                      driver.status === 'Active' ? 'bg-green-500' : 
                      driver.status === 'Busy' ? 'bg-orange-500' :
                      'bg-stone-300'
                     }`} />
                     {driver.status}
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[80px] h-2 bg-stone-100 rounded-full overflow-hidden">
                         <div className={`h-full ${driver.battery < 20 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${driver.battery}%` }} />
                      </div>
                      <span className="text-[0.7rem] font-bold text-stone-500">{driver.battery}%</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                      <span className="text-sm font-bold text-stone-950">{driver.rating}</span>
                      <span className="text-[0.7rem] text-stone-400 ml-1 font-medium">({driver.orders} completed)</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className="text-sm font-bold text-stone-300 tabular-nums">{driver.id}</span>
                </td>
                <td className="px-6 py-5 text-right pr-6">
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-stone-200 transition-colors">
                    <MoreHorizontal className="w-4.5 h-4.5 text-stone-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DriversView;
