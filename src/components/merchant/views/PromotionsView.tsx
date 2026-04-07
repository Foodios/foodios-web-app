import { Search, Plus, Filter, Percent, Calendar, Trash2, Edit2, Play, Pause } from "lucide-react";

const promotions = [
  { id: "PR01", name: "Summer Pizza Feast", code: "SUMMER4P", discount: "20%", type: "Coupon", usage: "124/500", status: "Active", expiry: "Aug 12, 2026" },
  { id: "PR02", name: "Welcome New Member", code: "FOODIONEW", discount: "50k", type: "Discount", usage: "3.2k", status: "Active", expiry: "No Expiry" },
  { id: "PR03", name: "District 1 Morning", code: "MORNINGD1", discount: "15%", type: "Voucher", usage: "42", status: "Paused", expiry: "Dec 30, 2026" },
];

function PromotionsView() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-950 tracking-tight">Promotions & Coupons</h1>
          <p className="text-sm font-medium text-stone-500 mt-1">Boost your sales by creating targeted shop promotions.</p>
        </div>
        <button className="h-14 bg-stone-950 text-white rounded-[22px] px-8 text-sm font-bold flex items-center gap-3 shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Create Promotion
        </button>
      </header>

      {/* Promo Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { label: "Active Promos", value: 3, icon: Play, color: "text-green-600 bg-green-50" },
            { label: "Total Usage", value: "3.4k", icon: Percent, color: "text-orange-600 bg-orange-50" },
            { label: "Estimated ROI", value: "x4.2", icon: Calendar, color: "text-purple-600 bg-purple-50" },
        ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-stone-100 flex items-center gap-5 shadow-sm">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[0.65rem] font-black uppercase tracking-widest text-stone-300">{stat.label}</p>
                   <h4 className="text-xl font-black text-stone-950">{stat.value}</h4>
                </div>
            </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-stone-100 p-2 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/50">
              <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em]">Promotion Name</th>
              <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em]">Code / Discount</th>
              <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em]">Usage</th>
              <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
             {promotions.map((promo) => (
               <tr key={promo.id} className="hover:bg-stone-50/30 transition-colors border-b border-stone-50/50 cursor-pointer group">
                  <td className="px-8 py-6">
                     <div>
                        <h4 className="text-md font-black text-stone-900 group-hover:text-orange-500 transition-colors">{promo.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <Calendar className="w-3 h-3 text-stone-300" />
                           <span className="text-[0.7rem] font-bold text-stone-400 uppercase tracking-tighter">Exp: {promo.expiry}</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex flex-col gap-1">
                        <span className="text-xs font-black bg-stone-100 px-2 py-1 rounded-md text-stone-600 inline-block w-fit tabular-nums">{promo.code}</span>
                        <span className="text-sm font-black text-orange-600">{promo.discount} OFF</span>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-sm font-bold text-stone-400">{promo.usage} times</span>
                  </td>
                  <td className="px-8 py-6">
                     <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest border ${
                         promo.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-stone-50 text-stone-400 border-stone-100'
                     }`}>
                        {promo.status}
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-stone-50 text-stone-400 hover:bg-stone-950 hover:text-white transition-all">
                            {promo.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-stone-50 text-stone-400 hover:bg-stone-950 hover:text-white transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PromotionsView;
