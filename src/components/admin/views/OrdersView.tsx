import { Search, Filter, MoreHorizontal, Clock, ShoppingBag, XCircle, AlertCircle, Store } from "lucide-react";

const orders = [
  { id: "#ORD-5921", customer: "Nguyễn Văn A", merchant: "Pizza 4P's", items: 3, total: 450000, status: "Preparing", time: "5 min ago", type: "Delivery" },
  { id: "#ORD-5920", customer: "Trần Thị B", merchant: "Banh Mi Huynh Hoa", items: 1, total: 65000, status: "Delivering", time: "12 min ago", type: "Delivery" },
  { id: "#ORD-5919", customer: "Lê Văn C", merchant: "Maison Marou", items: 2, total: 120000, status: "Completed", time: "45 min ago", type: "Pickup" },
  { id: "#ORD-5918", customer: "Phạm Văn D", merchant: "The Deck Saigon", items: 5, total: 2450000, status: "Completed", time: "1 hour ago", type: "Delivery" },
  { id: "#ORD-5917", customer: "Hoàng Văn E", merchant: "Quan Ut Ut", items: 4, total: 820000, status: "Preparing", time: "8 min ago", type: "Delivery" },
  { id: "#ORD-5916", customer: "Đặng Thị F", merchant: "Poke Saigon", items: 2, total: 310000, status: "Pending", time: "2 min ago", type: "Delivery" },
];

function OrdersView() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-stone-950">Live Orders Pool</h1>
          <p className="text-sm text-stone-500 mt-1">Real-time monitoring of all active orders in the city.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
              <div className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
              <span className="text-sm font-bold text-orange-700">24 Live Orders</span>
           </div>
        </div>
      </header>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "New Orders", value: 12, icon: AlertCircle, color: "text-blue-600 bg-blue-50" },
          { label: "Preparing", value: 45, icon: Clock, color: "text-orange-600 bg-orange-50" },
          { label: "On the way", value: 28, icon: ShoppingBag, color: "text-purple-600 bg-purple-50" },
          { label: "Canceled today", value: 4, icon: XCircle, color: "text-red-600 bg-red-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center gap-4 shadow-sm">
             <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[0.65rem] font-black uppercase tracking-widest text-stone-400">{stat.label}</p>
                <h4 className="text-lg font-bold text-stone-950">{stat.value}</h4>
             </div>
          </div>
        ))}
      </div>

      {/* List / Table */}
      <div className="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-50 flex items-center justify-between bg-stone-50/20">
          <div className="flex items-center gap-4">
             <div className="relative flex items-center bg-white border border-stone-200 rounded-lg px-3 h-9 min-w-[240px]">
                <Search className="w-4 h-4 text-stone-400" />
                <input className="w-full bg-transparent border-none outline-none px-2 text-[0.8rem]" placeholder="Find order ID..." />
             </div>
             <button className="h-9 px-3 flex items-center gap-2 text-[0.8rem] font-bold text-stone-500 hover:text-stone-950 transition-all border border-transparent hover:border-stone-100 hover:bg-white rounded-lg">
                <Filter className="w-3.5 h-3.5" />
                Status
             </button>
          </div>
          <button className="text-[0.8rem] font-bold text-orange-600 hover:underline">Mark all as viewed</button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Order ID</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Merchant</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Status</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Timeline</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest opacity-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-stone-50 hover:bg-stone-50/30 transition-colors">
                <td className="px-6 py-5">
                   <span className="text-sm font-bold text-stone-900 transition-colors">{order.id}</span>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-stone-700">{order.customer}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      <Store className="w-3.5 h-3.5 text-stone-300" />
                      <span className="text-sm font-bold text-stone-950">{order.merchant}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className="text-sm font-bold text-stone-950">{order.total.toLocaleString()}đ</span>
                   <p className="text-[0.7rem] text-stone-400 font-medium">{order.items} items • {order.type}</p>
                </td>
                <td className="px-6 py-5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold border ${
                    order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                    order.status === 'Preparing' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    order.status === 'Delivering' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                    'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {order.status}
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2 text-stone-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[0.75rem] font-medium">{order.time}</span>
                   </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-stone-100">
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
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

export default OrdersView;
