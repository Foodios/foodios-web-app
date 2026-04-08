import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Store,
  Loader2,
  AlertCircle,
  Clock
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { merchantService } from "../../../services/merchantService";
import { storeService } from "../../../services/storeService";

function OrderHistory() {
  const { merchant } = useOutletContext<{ merchant: any }>();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Stores
  useEffect(() => {
    const fetchStores = async () => {
      const merchantId = merchant?.id || merchant?.merchantId;
      if (!merchantId) return;
      try {
        const result = await storeService.getStores(merchantId);
        const storeList = result.data?.stores || [];
        setStores(storeList);
        if (storeList.length > 0) setSelectedStoreId(storeList[0].id);
      } catch (err) {
        console.error("Fetch stores error:", err);
      }
    };
    fetchStores();
  }, [merchant]);

  const fetchHistory = useCallback(async () => {
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!merchantId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await merchantService.getMerchantOrderHistory(merchantId);
      
      let orderList = [];
      const data = result.data || result;
      if (Array.isArray(data.items)) {
        orderList = data.items;
      } else if (Array.isArray(data.orders)) {
        orderList = data.orders;
      } else if (Array.isArray(data)) {
        orderList = data;
      }

      // Filter by selectedStoreId locally if one is chosen
      if (selectedStoreId) {
        orderList = orderList.filter((o: any) => o.storeId === selectedStoreId);
      }
      
      setOrders(orderList);
    } catch (err) {
      console.error("Failed to fetch order history", err);
      setError("Unable to load history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [merchant, selectedStoreId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Client-side search filtering
  const filteredOrders = orders.filter(o => 
    o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-stone-950 tracking-tight">Order History</h1>
          <p className="text-sm font-medium text-stone-500 mt-1">Review and manage your past sales and transactions.</p>
        </div>
        
        <div className="flex items-center gap-3">
           {/* Store Selector */}
           <div className="relative group">
              <select 
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="h-12 pl-10 pr-6 rounded-2xl border border-stone-100 bg-white text-[0.65rem] font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm min-w-[200px]"
              >
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-600" />
           </div>

           <button className="h-12 px-6 bg-stone-950 text-white rounded-2xl text-[0.7rem] font-black uppercase tracking-widest hover:bg-stone-800 transition flex items-center gap-3 shadow-xl shadow-stone-200">
              <Download className="w-4 h-4 text-orange-500" />
              Export
           </button>
        </div>
      </header>

      {/* Filtering Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
         <div className="flex flex-1 max-w-lg items-center gap-3 bg-white px-5 rounded-[22px] border border-stone-100 h-14 shadow-sm focus-within:ring-4 focus-within:ring-orange-500/5 transition-all group">
            <Search className="w-5 h-5 text-stone-300 group-focus-within:text-stone-950 transition-colors" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-stone-300 text-stone-950" 
              placeholder="Search by Order ID, customer name..." 
            />
         </div>
         
         <div className="flex items-center gap-3">
            <button className="h-14 px-6 bg-white border border-stone-100 rounded-[22px] flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-widest text-stone-400 hover:text-stone-950 transition shadow-sm">
               <Calendar className="w-4 h-4" />
               Custom Date Range
            </button>
            <button className="h-14 w-14 bg-white border border-stone-100 rounded-[22px] flex items-center justify-center hover:bg-stone-50 transition shadow-sm">
               <Filter className="w-5 h-5 text-stone-300" />
            </button>
         </div>
      </div>

      {/* History Table Container */}
      <div className="bg-white rounded-[40px] border border-stone-100 shadow-sm overflow-hidden">
         {isLoading ? (
           <div className="py-24 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-stone-100 animate-spin mb-4" />
              <p className="text-[0.6rem] font-black text-stone-300 uppercase tracking-widest">Querying History...</p>
           </div>
         ) : error ? (
           <div className="py-20 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <p className="text-red-500 font-bold">{error}</p>
              <button onClick={fetchHistory} className="mt-4 text-sm font-black text-stone-950 underline underline-offset-4">Try Again</button>
           </div>
         ) : filteredOrders.length === 0 ? (
           <div className="py-24 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-stone-50 rounded-3xl flex items-center justify-center mb-6">
                 <Clock className="w-8 h-8 text-stone-100" />
              </div>
              <p className="text-stone-400 font-bold">No orders found matching your search.</p>
           </div>
         ) : (
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-stone-50">
                       <th className="px-8 py-6 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Order Details</th>
                       <th className="px-8 py-6 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Status</th>
                       <th className="px-8 py-6 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Date</th>
                       <th className="px-8 py-6 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Customer</th>
                       <th className="px-8 py-6 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest text-right">Amount</th>
                       <th className="px-8 py-6 text-right"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-50">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="group hover:bg-stone-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-stone-950">#{order.orderNumber || order.id.slice(0, 8)}</p>
                            <p className="text-[0.6rem] font-bold text-stone-400 uppercase tracking-widest mt-1">{order.paymentMethod || 'Credit Card'}</p>
                         </td>
                         <td className="px-8 py-6">
                            <div className={`w-fit px-4 py-1.5 rounded-full text-[0.6rem] font-black uppercase tracking-widest border transition-colors ${
                              order.status === 'COMPLETED' || order.status === 'DELIVERED' 
                                ? 'bg-green-50 text-green-600 border-green-100' 
                                : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                              {order.status}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-bold text-stone-600">{order.completedAt || order.createdAt || 'Apr 08, 2026'}</p>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-stone-900 group-hover:text-orange-600 transition-colors">{order.customerName || 'Anonymous'}</p>
                            <p className="text-[0.65rem] font-medium text-stone-400">{order.customerPhone || 'No contact email'}</p>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <p className="text-sm font-black text-stone-950">{(order.totalAmount || order.total || 0).toLocaleString()}đ</p>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button className="h-10 w-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-300 hover:bg-stone-950 hover:text-white transition-all shadow-sm border border-stone-100">
                               <Eye className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
         )}

         {/* Pagination Footer */}
         <div className="px-8 py-8 border-t border-stone-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-stone-50/30">
            <p className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest">Showing {filteredOrders.length} of {orders.length} entries</p>
            <div className="flex items-center gap-2">
               <button className="h-11 w-11 rounded-[16px] border border-stone-100 flex items-center justify-center text-stone-300 bg-white opacity-50 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
               </button>
               <div className="flex items-center gap-1.5">
                  <button className="h-11 px-5 rounded-[16px] text-xs font-black bg-stone-950 text-white shadow-xl shadow-stone-200 transition-all">
                     1
                  </button>
               </div>
               <button className="h-11 w-11 rounded-[16px] border border-stone-100 flex items-center justify-center text-stone-400 bg-white hover:bg-stone-50 transition-all">
                  <ChevronRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

export default OrderHistory;
