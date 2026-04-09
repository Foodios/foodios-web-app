import { useState, useEffect } from "react";
import { Search, MoreHorizontal, Clock, ShoppingBag, XCircle, AlertCircle, Store, Loader2 } from "lucide-react";
import { adminService } from "../../../services/adminService";

const ORDER_STATUSES = [
  "DRAFT",
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED"
];

function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("PREPARING");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [summary, setSummary] = useState({
    new: 0,
    preparing: 0,
    delivering: 0,
    cancelled: 0
  });

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const result = await adminService.getOrders(statusFilter, searchQuery);
      const data = result.data || {};
      setOrders(data.items || []);
      setSummary({
        new: data.numberOfNewOrders || 0,
        preparing: data.numberOfPreparingOrder || 0,
        delivering: data.numberOfOnDelivery || 0,
        cancelled: data.numberOfCancelled || 0
      });
    } catch (err) {
      console.error("Fetch orders error:", err);
      // setOrders([]); // Fail silently or show error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchQuery]);

  const filteredOrders = orders; // Now filtered by backend

  return (
    <div className="flex flex-col gap-6 font-sans">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-stone-950">Live Orders Pool</h1>
          <p className="text-sm text-stone-500 mt-1">Real-time monitoring of all active orders in the city.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
              <div className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
              <span className="text-sm font-bold text-orange-700">{orders.length} Live Orders</span>
           </div>
        </div>
      </header>

      {/* Stats Summary Row (Mocked for context) */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "New Orders", value: summary.new, icon: AlertCircle, color: "text-blue-600 bg-blue-50" },
          { label: "Preparing", value: summary.preparing, icon: Clock, color: "text-orange-600 bg-orange-50" },
          { label: "On the way", value: summary.delivering, icon: ShoppingBag, color: "text-purple-600 bg-purple-50" },
          { label: "Canceled today", value: summary.cancelled, icon: XCircle, color: "text-red-600 bg-red-50" },
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
      <div className="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-sm relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          </div>
        )}

        <div className="px-6 py-4 border-b border-stone-50 flex items-center justify-between bg-stone-50/20">
          <div className="flex items-center gap-4">
             <div className="relative flex items-center bg-white border border-stone-200 rounded-lg px-3 h-9 min-w-[240px]">
                <Search className="w-4 h-4 text-stone-400" />
                <input 
                  className="w-full bg-transparent border-none outline-none px-2 text-[0.8rem]" 
                  placeholder="Find order ID, customer or merchant..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             
             {/* Status Filter Dropdown */}
             <div className="flex items-center gap-2 ml-2">
                <span className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest">Status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-3 bg-white border border-stone-200 rounded-lg text-[0.75rem] font-bold text-stone-900 outline-none focus:border-stone-400 appearance-none min-w-[140px]"
                >
                  {ORDER_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
             </div>
          </div>
          <button className="text-[0.8rem] font-bold text-orange-600 hover:underline">Mark all as viewed</button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-100 uppercase text-[0.65rem] font-black text-stone-400 tracking-widest">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Merchant</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Timeline</th>
              <th className="px-6 py-4 text-right opacity-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-stone-400 font-bold uppercase tracking-widest">
                  No orders found for status: {statusFilter}
                </td>
              </tr>
            ) : filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-stone-50 hover:bg-stone-50/30 transition-colors group">
                <td className="px-6 py-5">
                   <span className="text-sm font-bold text-stone-900">#{order.id?.substring(0, 8) || "N/A"}</span>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-stone-900">{order.customerName || "Customer"}</span>
                      <span className="text-[0.65rem] text-stone-400 font-medium">{order.customerPhone}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      <Store className="w-3.5 h-3.5 text-stone-300" />
                      <span className="text-sm font-bold text-stone-950">{order.merchantName || "Store"}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className="text-sm font-bold text-stone-950">{(order.totalAmount || 0).toLocaleString()}đ</span>
                   <p className="text-[0.7rem] text-stone-400 font-medium">{order.totalItems || 0} items</p>
                </td>
                <td className="px-6 py-5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6rem] font-black uppercase border ${
                    order.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border-green-100' : 
                    order.status === 'PREPARING' || order.status === 'CONFIRMED' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    order.status === 'OUT_FOR_DELIVERY' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                    order.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {order.status}
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2 text-stone-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[0.75rem] font-medium">
                        {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                      </span>
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
