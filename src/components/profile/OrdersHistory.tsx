import { useState, useEffect } from "react";
import { Clock, ChevronRight, Package, Bike, UtensilsCrossed, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { orderService } from "../../services/orderService";

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  PENDING: { label: "Requested", color: "text-stone-400", bgColor: "bg-stone-50", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle2 },
  PREPARING: { label: "Preparing", color: "text-orange-600", bgColor: "bg-orange-50", icon: UtensilsCrossed },
  DELIVERING: { label: "Ongoing", color: "text-blue-600", bgColor: "bg-blue-50", icon: Bike },
  COMPLETED: { label: "Completed", color: "text-stone-900", bgColor: "bg-stone-100", icon: Package },
  CANCELLED: { label: "Cancelled", color: "text-red-600", bgColor: "bg-red-50", icon: XCircle },
};

function OrdersHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Map tab to API status
        let statusParam = activeTab === "all" ? "" : (activeTab === "past" ? "COMPLETED" : "PREPARING");
        if (activeTab === "cancelled") statusParam = "CANCELLED";
        
        const result = await orderService.getMyOrders(statusParam);
        const data = result.data || {};
        const items = Array.isArray(data) ? data : (data.items || []);
        setOrders(items);
      } catch (err) {
        console.error("Fetch history error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return ["PENDING", "CONFIRMED", "PREPARING", "DELIVERING"].includes(order.status);
    if (activeTab === "past") return ["COMPLETED", "CANCELLED"].includes(order.status);
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-stone-200 animate-spin mb-4" />
        <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">Retrieving your orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-outfit">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-black text-stone-950 uppercase tracking-[0.2em]">Order Journey</h3>
        <div className="flex bg-stone-100 p-1 rounded-xl">
           {['all', 'active', 'past'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-4 py-1.5 rounded-lg text-[0.6rem] font-black uppercase tracking-widest transition-all ${
                 activeTab === tab ? 'bg-white text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-600'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => {
          const cfg = statusConfig[order.status || 'PENDING'] || statusConfig.PENDING;
          const StatusIcon = cfg.icon;

          return (
            <div key={order.id} className="bg-white rounded-[32px] border border-stone-100 p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 transition-transform duration-500">
                  <div className="flex items-center gap-5">
                     <div className="h-16 w-16 bg-stone-50 rounded-[22px] flex items-center justify-center border border-stone-100 shrink-0 overflow-hidden">
                        {order.storeLogo || order.logoUrl ? (
                          <img src={order.storeLogo || order.logoUrl} alt={order.storeName} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-stone-200" />
                        )}
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[0.85rem] font-black text-stone-950 uppercase tracking-tight">
                            {order.storeName || order.merchantName || 'Merchant Partner'}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[0.5rem] font-black uppercase tracking-widest ${cfg.bgColor} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-[0.65rem] font-bold text-stone-400 uppercase tracking-widest mb-1.5 italic">
                          {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })} • #{order.id?.slice(0, 8)}
                        </p>
                        <p className="text-[0.7rem] font-bold text-stone-600 line-clamp-1 max-w-xs">
                           {order.items?.map((i: any) => `${i.quantity}x ${i.productName || i.name}`).join(', ')}
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-stone-50">
                     <p className="text-lg font-black text-stone-950 tracking-tight">{(order.total || order.totalAmount || 0).toLocaleString()}đ</p>
                     {["PENDING", "CONFIRMED", "PREPARING", "DELIVERING"].includes(order.status) ? (
                        <Link 
                          to={`/tracking/${order.id}`}
                          className="h-10 px-5 bg-orange-600 text-white rounded-xl text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-100 hover:scale-105 active:scale-95 transition-all"
                        >
                           <Bike className="w-3.5 h-3.5" />
                           Track Order
                        </Link>
                     ) : (
                        <Link 
                          to={`/restaurant/${order.merchantSlug || order.storeId}`}
                          className="h-10 px-5 bg-stone-50 text-stone-950 rounded-xl text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 border border-stone-100 hover:bg-stone-950 hover:text-white transition-all"
                        >
                           Reorder
                           <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                     )}
                  </div>
               </div>

               {/* Background Decorative Icon */}
               <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-[0.03] rotate-12 pointer-events-none">
                  <StatusIcon className="w-32 h-32" />
               </div>
            </div>
          );
        }) : (
          <div className="bg-white rounded-[32px] p-20 text-center border border-dashed border-stone-200">
             <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <UtensilsCrossed className="w-8 h-8 text-stone-200" />
             </div>
             <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-[0.2em]">No order journey found yet</p>
             <Link to="/" className="mt-4 inline-block text-[0.65rem] font-black text-orange-600 underline underline-offset-8 uppercase tracking-widest">Start Exploring</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersHistory;
