import { 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
  Timer, 
  MoreHorizontal,
  Loader2,
  Store,
  AlertCircle,
  X,
  CreditCard,
  PackageCheck,
  User,
  MapPin,
  Receipt,
  Phone,
  Truck,
  Trash2,
  CheckCircle2,
  Eye
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { merchantService } from "../../../services/merchantService";
import { storeService } from "../../../services/storeService";

function OrderQueue() {
  const { merchant } = useOutletContext<{ merchant: any }>();
  const [activeTab, setActiveTab] = useState("all");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenuOrderId, setActiveMenuOrderId] = useState<string | null>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuOrderId(null);
    if (activeMenuOrderId) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [activeMenuOrderId]);

  const handleMarkDelivered = async (orderId: string) => {
    const mId = merchant?.id || merchant?.merchantId;
    if (!mId) return;

    try {
      await merchantService.markOrderDelivered(orderId, mId);
      fetchOrders(); // Refresh list
    } catch (err) {
      console.error("Mark delivered error:", err);
    }
  };

  // Filter State
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

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

  const fetchOrders = useCallback(async () => {
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!merchantId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await merchantService.getMerchantOrders(merchantId);
      
      let orderList = [];
      const data = result.data || result;
      if (Array.isArray(data.items)) {
        orderList = data.items;
      } else if (Array.isArray(data)) {
        orderList = data;
      }
      
      // Filter by selectedStoreId if one is chosen
      if (selectedStoreId) {
        orderList = orderList.filter((o: any) => o.storeId === selectedStoreId);
      }

      // Filter by activeTab locally
      if (activeTab !== "all") {
        const statusMap: Record<string, string[]> = {
          "new": ["NEW", "PLACED"],
          "preparing": ["PREPARING"],
          "ready": ["READY", "DELIVERING"]
        };
        const allowedStatuses = statusMap[activeTab] || [];
        orderList = orderList.filter((o: any) => allowedStatuses.includes(o.status?.toUpperCase()));
      }

      setOrders(orderList);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setError("Unable to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [merchant, selectedStoreId, activeTab]);

  useEffect(() => {
    fetchOrders();
    // Optional: Polling for live updates
    const interval = setInterval(fetchOrders, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [targetOrder, setTargetOrder] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  
  // Detail States
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Fetch Drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      const merchantId = merchant?.id || merchant?.merchantId;
      if (!merchantId) return;
      setIsLoadingDrivers(true);
      try {
        const result = await merchantService.getMerchantDrivers(merchantId);
        const data = result.data || result;
        // Check multiple possible keys for the list
        let rawList = data.drivers || data.items || (Array.isArray(data) ? data : []);
        
        // Final safety check: ensure it's an array
        const driverList = Array.isArray(rawList) ? rawList : [];
        
        // Filter active drivers
        setDrivers(driverList.filter((d: any) => d.status?.toUpperCase() === 'ACTIVE'));
      } catch (err) {
        console.error("Fetch drivers error:", err);
      } finally {
        setIsLoadingDrivers(false);
      }
    };
    if (showHandoverModal) fetchDrivers();
  }, [merchant, showHandoverModal]);

  const handleViewDetail = async (orderId: string) => {
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!merchantId) return;
    
    setSelectedOrderId(orderId);
    setIsLoadingDetail(true);
    try {
      const result = await merchantService.getMerchantOrderDetail(orderId, merchantId);
      console.log("Order Detail Result:", result);
      // Backend Envelope pattern: result.data contains the detail
      setOrderDetail(result.data || result);
    } catch (err) {
      console.error("Fetch detail error:", err);
      // Fallback: If detail API fails, use the item from the list
      const listOrder = orders.find(o => o.id === orderId);
      if (listOrder) setOrderDetail(listOrder);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, currentStatus: string, bypassModal = false) => {
    const order = orders.find(o => o.id === orderId);
    
    // Normalize values for robust checking
    const status = currentStatus?.toUpperCase();
    const serviceMethod = order?.serviceMethod?.toUpperCase();
    
    console.log("Updating status:", { orderId, status, serviceMethod, bypassModal });

    // If it's a delivery handover, show modal first
    const isReadyStatus = ["READY", "READY_FOR_DELIVERY", "READY_FOR_PICKUP", "CONFIRMED"].includes(status);
    if (!bypassModal && isReadyStatus && serviceMethod === "DELIVERY") {
      setTargetOrder(order);
      setShowHandoverModal(true);
      return;
    }

    let nextStatus = "";
    if (status === "NEW" || status === "PLACED") nextStatus = "CONFIRMED";
    else if (status === "CONFIRMED" && serviceMethod === "PICKUP") nextStatus = "PREPARING";
    else if (status === "PREPARING") nextStatus = "READY";
    else if (status === "READY" || status === "READY_FOR_DELIVERY" || status === "READY_FOR_PICKUP") nextStatus = "OUT_FOR_DELIVERY";
    else if (status === "CONFIRMED" && serviceMethod === "DELIVERY") nextStatus = "OUT_FOR_DELIVERY";

    if (!nextStatus) {
      console.warn("Unknown next status for:", status);
      nextStatus = "COMPLETED"; 
    }

    try {
      const merchantId = merchant?.id || merchant?.merchantId;
      if (!merchantId) throw new Error("Merchant context missing");

      const notes = selectedDriverId ? `Assigned to driver: ${selectedDriverId}` : undefined;
      await merchantService.updateOrderStatus(orderId, merchantId, nextStatus, notes);
      
      setShowHandoverModal(false);
      setSelectedDriverId(""); // Reset
      setSelectedOrderId(null);
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update order status.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-stone-950 tracking-tight">Order Queue</h1>
          <p className="text-sm font-medium text-stone-500 mt-1">Live updates of incoming and active orders.</p>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Store Selector */}
           <div className="relative group">
              <select 
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="h-11 pl-10 pr-6 rounded-2xl border border-stone-100 bg-white text-[0.65rem] font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm min-w-[180px]"
              >
                {stores.map(s => <option key={s.id} value={s.id}>{s.name} - {s.address?.city}</option>)}
              </select>
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-600" />
           </div>

           <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[0.65rem] font-black text-green-700 uppercase tracking-widest text-[10px]">Live: Accepting Orders</span>
           </div>
        </div>
      </header>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-3 rounded-[32px] border border-stone-50 shadow-sm">
         <div className="flex items-center p-1.5 bg-stone-50 rounded-[22px] border border-stone-100 w-fit">
            {["all", "new", "preparing", "ready"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-[18px] text-[0.7rem] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? "bg-white text-stone-950 shadow-sm" 
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {tab}
              </button>
            ))}
         </div>

         <div className="flex items-center gap-3 pr-2">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-stone-950 transition-colors" />
               <input className="h-11 pl-11 pr-5 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all w-64" placeholder="Scan or search Order ID..." />
            </div>
            <button className="h-11 w-11 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center hover:bg-stone-50 transition shadow-sm text-stone-400 hover:text-stone-950">
               <Filter className="w-4 h-4" />
            </button>
         </div>
      </div>

      {isLoading && orders.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[40px] border border-stone-50">
           <Loader2 className="w-12 h-12 text-stone-100 animate-spin mb-4" />
           <p className="text-[0.6rem] font-black text-stone-300 uppercase tracking-widest tracking-[0.2em]">Syncing Feed...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center bg-white rounded-[40px] border border-stone-100">
           <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
           <p className="text-stone-950 font-bold">{error}</p>
           <button onClick={() => fetchOrders()} className="mt-4 h-10 px-6 bg-stone-950 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-all">Retry Sync</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-stone-200 flex flex-col items-center">
           <div className="w-20 h-20 bg-stone-50 rounded-[32px] flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-stone-200" />
           </div>
           <p className="text-xl font-black text-stone-950 mb-2">No active orders</p>
           <p className="text-stone-400 font-medium text-sm">When customers place orders, they will appear here in real-time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 scale-[0.8] origin-top-left w-[125%]">
           {orders.map((order) => (
             <div 
               key={order.id} 
               onClick={() => handleViewDetail(order.id)}
               className={`bg-white rounded-[40px] border border-stone-100 p-8 flex flex-col lg:flex-row lg:items-center gap-10 group hover:shadow-2xl hover:shadow-stone-200/40 transition-all duration-500 relative cursor-pointer ${activeMenuOrderId === order.id ? 'z-50' : 'z-10'}`}
             >
                {/* Visual indicator for New orders */}
                {order.status === 'NEW' && <div className="absolute top-0 left-0 bottom-0 w-2 bg-orange-500" />}
                
                {/* Order ID & Context */}
                <div className="flex flex-col gap-3 min-w-[180px]">
                   <span className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">Reference</span>
                   <p className="text-lg font-black text-stone-950">#{order.orderNumber || order.id.slice(0, 8)}</p>
                   
                   <div className="flex flex-wrap gap-2">
                     <div className={`px-2.5 py-1 rounded-lg text-[0.55rem] font-black uppercase tracking-widest border ${
                       order.serviceMethod === 'DELIVERY' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                     }`}>
                        {order.serviceMethod || 'DELIVERY'}
                     </div>
                     <div className="px-2.5 py-1 rounded-lg text-[0.55rem] font-black uppercase tracking-widest bg-stone-100 text-stone-600 border border-stone-200">
                        {order.paymentMethod || 'CARD'}
                     </div>
                     <div className="px-2.5 py-1 rounded-lg text-[0.55rem] font-black uppercase tracking-widest bg-stone-950 text-white">
                        {order.status}
                     </div>
                   </div>
                </div>

                <div className="h-20 w-[1px] bg-stone-100 hidden lg:block" />

                {/* Items Summary */}
                <div className="flex-1">
                   <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
                            <Clock className="w-4 h-4 text-stone-400" />
                         </div>
                         <span className="text-[0.65rem] font-black uppercase tracking-widest text-stone-400">Placed {order.createdAt || 'Just now'}</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-2xl border border-stone-100/50">
                         <Timer className="w-4 h-4 text-orange-600" />
                         <span className={`text-[0.65rem] font-black uppercase tracking-widest ${order.status === 'READY' ? 'text-green-600' : 'text-orange-600'}`}>
                            {order.status === 'READY' ? 'READY FOR PICKUP' : order.status === 'PREPARING' ? 'PREPARING...' : 'NEW ORDER'}
                         </span>
                      </div>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-3 bg-stone-50 rounded-2xl border border-stone-100 group-hover:bg-white group-hover:border-stone-200 transition-all">
                           <span className="text-stone-400 font-black text-xs">x{item.quantity || 1}</span>
                           <span className="text-sm font-bold text-stone-950">{item.productName || item.name || 'Item'}</span>
                        </div>
                      ))}
                      {(!order.items || order.items.length === 0) && <span className="text-stone-400 italic text-sm">No items details found</span>}
                   </div>
                </div>

                <div className="h-20 w-[1px] bg-stone-100 hidden lg:block" />

                {/* Action Side */}
                <div className="flex flex-col md:flex-row lg:flex-col items-start md:items-center lg:items-end justify-between lg:justify-center gap-6 lg:min-w-[220px]">
                   <div className="text-left lg:text-right">
                      <p className="text-[0.6rem] font-black text-stone-300 uppercase tracking-widest mb-1 leading-none">Total Authorized</p>
                      <p className="text-2xl font-black text-stone-950 tracking-tight">{(order.total || order.totalAmount || 0).toLocaleString()}đ</p>
                   </div>
                                       <div className="flex items-center gap-3 w-full md:w-auto">
                      {(order.status?.toUpperCase() === 'NEW' || order.status?.toUpperCase() === 'PLACED') ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(order.id, order.status);
                          }}
                          className="flex-1 md:flex-none h-14 px-8 bg-stone-950 text-white rounded-[22px] text-[0.7rem] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-stone-200 active:scale-95 group/btn"
                        >
                           Confirm Order
                           <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      ) : (order.status?.toUpperCase() === 'CONFIRMED' || order.status?.toUpperCase() === 'READY') ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(order.id, order.status);
                          }}
                          className="flex-1 md:flex-none h-14 px-8 bg-stone-950 text-white rounded-[22px] text-[0.7rem] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-stone-200 active:scale-95 group/btn"
                        >
                           {order.serviceMethod?.toUpperCase() === 'DELIVERY' ? 'Handover Delivery' : 'Handover Done'}
                           <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      ) : null}

                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuOrderId(activeMenuOrderId === order.id ? null : order.id);
                          }}
                          className={`h-14 w-14 rounded-[22px] flex items-center justify-center transition-all border ${
                            activeMenuOrderId === order.id 
                              ? 'bg-stone-950 text-white border-stone-950 shadow-lg' 
                              : 'bg-stone-50 text-stone-300 hover:text-stone-950 hover:bg-stone-100 border-transparent hover:border-stone-200'
                          }`}
                        >
                           <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {activeMenuOrderId === order.id && (
                          <div 
                            className="absolute top-full right-0 mt-3 w-48 bg-white rounded-[24px] border border-stone-100 shadow-2xl z-[100] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                             {(order.status?.toUpperCase() === 'OUT_FOR_DELIVERY' || order.status?.toUpperCase() === 'DELIVERING') && (
                               <button
                                 onClick={() => {
                                   handleMarkDelivered(order.id);
                                   setActiveMenuOrderId(null);
                                 }}
                                 className="w-full px-5 py-3 flex items-center gap-3 hover:bg-green-50 text-stone-600 hover:text-green-600 transition-colors"
                               >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span className="text-[0.65rem] font-black uppercase tracking-widest">Mark Delivered</span>
                               </button>
                             )}
                             <button className="w-full px-5 py-3 flex items-center gap-3 hover:bg-stone-50 text-stone-400 hover:text-stone-950 transition-colors">
                                <Eye className="w-4 h-4" />
                                <span className="text-[0.65rem] font-black uppercase tracking-widest">Order Logs</span>
                             </button>
                             <div className="h-[1px] bg-stone-50 mx-4 my-1" />
                             <button className="w-full px-5 py-3 flex items-center gap-3 hover:bg-red-50 text-red-300 hover:text-red-500 transition-colors">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-[0.65rem] font-black uppercase tracking-widest">Report Issue</span>
                             </button>
                          </div>
                        )}
                      </div>
                   </div>
                </div>

             </div>
           ))}
        </div>
      )}

      {/* Stats Summary Footer */}
      <footer className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 scale-[0.8] origin-top-left w-[125%]">
         {[
           { label: "New Notifications", value: orders.filter(o => o.status === 'NEW').length, sub: "Pending Confirmation", color: "text-orange-500" },
           { label: "Active Kitchen", value: orders.filter(o => o.status === 'PREPARING').length, sub: "Items in preparation", color: "text-stone-950" },
           { label: "Ready to Go", value: orders.filter(o => o.status === 'READY').length, sub: "Waiting for handover", color: "text-green-600" }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="flex items-baseline gap-4">
                 <span className={`text-[2.5rem] font-black tracking-tight leading-none ${stat.color}`}>{stat.value}</span>
                 <span className="text-[0.7rem] font-bold text-stone-400 font-outfit">{stat.sub}</span>
              </div>
           </div>
         ))}
      </footer>

      {/* Slide-over Order Detail Panel */}
      <div className={`fixed inset-0 z-[110] transition-visibility duration-300 ${selectedOrderId ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-stone-950/20 backdrop-blur-sm transition-opacity duration-300 ${selectedOrderId ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSelectedOrderId(null)}
        />
        
        <div className={`absolute top-0 right-0 h-full bg-white w-full max-w-xl shadow-2xl transition-transform duration-500 transform ${selectedOrderId ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
           {isLoadingDetail ? (
             <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-stone-100 animate-spin mb-4" />
                <p className="text-[0.6rem] font-black text-stone-300 uppercase tracking-[0.2em]">Opening Order File...</p>
             </div>
           ) : orderDetail ? (
             <>
               <header className="p-8 border-b border-stone-50 flex items-center justify-between bg-stone-50/30">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
                      <h2 className="text-xl font-black text-stone-950">Order Detail</h2>
                    </div>
                    <p className="text-[0.65rem] font-bold text-stone-400 uppercase tracking-widest italic">#{orderDetail.orderNumber || orderDetail.id.slice(0, 8)}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrderId(null)}
                    className="h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-white transition-all shadow-sm border border-stone-100"
                  >
                     <X className="w-5 h-5 text-stone-400" />
                  </button>
               </header>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
                  {/* Status & Timing */}
                  <section className="grid grid-cols-2 gap-6">
                     <div className="p-6 bg-stone-50 rounded-[32px] border border-stone-100">
                        <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest mb-3">Service Type</p>
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center">
                              {orderDetail.serviceMethod === 'DELIVERY' ? <Truck className="w-5 h-5 text-orange-600" /> : <PackageCheck className="w-5 h-5 text-blue-600" />}
                           </div>
                           <span className="text-sm font-black text-stone-950">{orderDetail.serviceMethod || 'DELIVERY'}</span>
                        </div>
                     </div>
                     <div className="p-6 bg-stone-50 rounded-[32px] border border-stone-100">
                        <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest mb-3">Order Status</p>
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                           </div>
                           <span className="text-sm font-black text-stone-950">{orderDetail.status}</span>
                        </div>
                     </div>
                  </section>

                  {/* Customer Info */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                       <User className="w-5 h-5 text-stone-950" />
                       <h3 className="text-[0.7rem] font-black tracking-widest uppercase text-stone-950">Customer Records</h3>
                    </div>
                    <div className="bg-white rounded-[40px] border border-stone-100 p-8 shadow-sm">
                       <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-5">
                             <div className="h-16 w-16 bg-stone-50 rounded-[24px] border border-stone-100 flex items-center justify-center overflow-hidden shadow-inner uppercase">
                                {orderDetail.customerUrl || orderDetail.customer_url || orderDetail.customerurl ? (
                                  <img 
                                    src={orderDetail.customerUrl || orderDetail.customer_url || orderDetail.customerurl} 
                                    alt="Customer" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xl font-black text-stone-200">
                                    {(orderDetail.customerName || orderDetail.customer_name || orderDetail.customername || 'C').charAt(0)}
                                  </span>
                                )}
                             </div>
                             <div>
                                <p className="text-lg font-black text-stone-950 leading-none mb-2">
                                  {orderDetail.customerName || orderDetail.customer_name || orderDetail.customername || 'Anonymous Guest'}
                                </p>
                                <div className="flex items-center gap-2">
                                   <Phone className="w-3 h-3 text-orange-600" />
                                   <span className="text-[0.65rem] font-black text-stone-400 tracking-widest">
                                     {orderDetail.customerPhone || orderDetail.customer_phone || orderDetail.customerphone || 'PRIVATE NUMBER'}
                                   </span>
                                </div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-start gap-4 p-5 bg-stone-50 rounded-3xl border border-stone-100/50">
                          <MapPin className="w-4 h-4 text-stone-400 mt-1" />
                          <div>
                             <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest mb-1 leading-none">Destination</p>
                             <p className="text-sm font-bold text-stone-800 leading-relaxed italic line-clamp-2">
                               {orderDetail.deliveryAddress || 'Pick-up at Store Location'}
                             </p>
                          </div>
                       </div>
                    </div>
                  </section>

                  {/* Itemized Bill */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                       <Receipt className="w-5 h-5 text-stone-950" />
                       <h3 className="text-[0.7rem] font-black tracking-widest uppercase text-stone-950">Itemized Invoice</h3>
                    </div>
                    <div className="bg-stone-50/50 rounded-[40px] border border-stone-100 overflow-hidden">
                       <div className="p-8 space-y-4">
                          {orderDetail.items?.map((item: any, i: number) => {
                             const price = item.price || item.productPrice || item.unitPrice || item.totalPrice || 0;
                             console.log("Mapping item price:", { name: item.productName || item.name, price });
                             return (
                               <div key={i} className="flex items-center justify-between group">
                                  <div className="flex items-center gap-5">
                                     <div className="h-10 w-10 bg-white rounded-xl border border-stone-100 flex items-center justify-center text-xs font-black text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
                                        x{item.quantity || 1}
                                     </div>
                                     <div>
                                        <p className="text-sm font-black text-stone-950">{item.productName || item.name}</p>
                                        {item.note && <p className="text-[0.6rem] font-medium text-stone-400 italic">“{item.note}”</p>}
                                     </div>
                                  </div>
                                  <p className="text-sm font-bold text-stone-900">{(price * (item.quantity || 1)).toLocaleString()}đ</p>
                               </div>
                             );
                          })}
                       </div>
                       <div className="p-8 bg-stone-100/50 border-t border-stone-200/50 space-y-3">
                          <div className="flex justify-between items-center opacity-50">
                             <span className="text-[0.65rem] font-black uppercase tracking-widest">Subtotal</span>
                             <span className="text-sm font-bold tracking-tight">{(orderDetail.totalPrice || orderDetail.subtotal || orderDetail.total || 0).toLocaleString()}đ</span>
                          </div>
                          <div className="flex justify-between items-center opacity-50">
                             <span className="text-[0.65rem] font-black uppercase tracking-widest font-outfit">Delivery Fee</span>
                             <span className="text-sm font-bold tracking-tight">{(orderDetail.deliveryFee || 0).toLocaleString()}đ</span>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-stone-200/50">
                             <span className="text-[0.7rem] font-black uppercase tracking-widest text-orange-600">Total Charged</span>
                             <span className="text-2xl font-black text-stone-950 tracking-tight">{(orderDetail.totalPrice || orderDetail.total || 0).toLocaleString()}đ</span>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                             <CreditCard className="w-3.5 h-3.5 text-stone-300" />
                             <span className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">
                               Paid via {orderDetail.paymentMethod || 'SECURE CARD'}
                             </span>
                          </div>
                       </div>
                    </div>
                  </section>
               </div>

               <footer className="p-8 border-t border-stone-50 bg-white grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      // Void/Cancel logic
                    }}
                    className="h-14 bg-stone-50 text-stone-400 rounded-3xl text-[0.7rem] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-3 border border-transparent hover:border-red-100"
                  >
                     <Trash2 className="w-4 h-4" />
                     Cancel Order
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(orderDetail.id, orderDetail.status)}
                    className="h-14 bg-stone-950 text-white rounded-3xl text-[0.7rem] font-black uppercase tracking-widest shadow-xl shadow-stone-200 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 group/confirm"
                  >
                     Confirm Change
                     <ChevronRight className="w-4 h-4 group-hover/confirm:translate-x-1 transition-transform" />
                  </button>
               </footer>
             </>
           ) : null}
        </div>
      </div>

      {/* Handover Confirmation Modal */}
      {showHandoverModal && targetOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div 
            className="absolute inset-0 bg-stone-950/40 backdrop-blur-md transition-opacity animate-in fade-in duration-500"
            onClick={() => setShowHandoverModal(false)}
          />
          
          <div className="relative bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-stone-100">
             <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 blur-[60px] rounded-full -mr-20 -mt-20" />
             
             <div className="p-10 relative z-10">
                <div className="flex justify-between items-start mb-10">
                   <div className="h-14 w-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
                      <Timer className="w-7 h-7 text-white" />
                   </div>
                   <button 
                     onClick={() => setShowHandoverModal(false)}
                     className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-stone-50 transition-colors"
                   >
                      <X className="w-5 h-5 text-stone-400" />
                   </button>
                </div>

                <div className="mb-8">
                   <h3 className="text-3xl font-black text-stone-950 uppercase tracking-tight leading-none mb-3">Select Delivery Driver</h3>
                   <p className="text-stone-400 font-bold text-[0.7rem] uppercase tracking-widest italic">Choose an active driver for Order #{targetOrder.orderNumber || targetOrder.id.slice(0, 8)}</p>
                </div>

                <div className="space-y-4 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {isLoadingDrivers ? (
                     <div className="py-10 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-stone-200 animate-spin" />
                        <p className="text-[0.6rem] font-black text-stone-300 uppercase tracking-widest">Loading available drivers...</p>
                     </div>
                   ) : drivers.length > 0 ? (
                     drivers.map((driver) => {
                       const dId = driver.memberId || driver.id;
                       return (
                         <button 
                           key={dId}
                           onClick={() => setSelectedDriverId(dId)}
                           className={`w-full p-5 rounded-[32px] border transition-all flex items-center gap-5 text-left group ${
                             selectedDriverId === dId 
                               ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-100' 
                               : 'bg-white border-stone-100 text-stone-950 hover:border-stone-200'
                           }`}
                         >
                            <div className={`h-14 w-14 rounded-2xl border flex items-center justify-center overflow-hidden shrink-0 ${
                              selectedDriverId === dId ? 'bg-white/20 border-white/20' : 'bg-stone-50 border-stone-100'
                            }`}>
                               <img 
                                 src={driver.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.fullName || driver.name}&backgroundColor=b6e3f4`} 
                                 alt="Courier" 
                                 className="w-full h-full object-cover"
                               />
                            </div>
                            <div className="flex-1">
                               <p className={`text-[0.55rem] font-black uppercase tracking-widest mb-1 ${selectedDriverId === dId ? 'text-white/60' : 'text-stone-400'}`}>
                                  Driver ID: #{dId.slice(0,6)}
                               </p>
                               <p className="text-base font-black leading-tight uppercase italic">{driver.fullName || driver.name}</p>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-[0.6rem] font-bold uppercase tracking-widest ${selectedDriverId === dId ? 'text-white/80' : 'text-orange-600'}`}>
                                     {driver.vehicleType || 'Motorbike'}
                                  </span>
                                  <span className={`h-1 w-1 rounded-full ${selectedDriverId === dId ? 'bg-white/30' : 'bg-stone-300'}`} />
                                  <span className={`text-[0.6rem] font-bold uppercase tracking-widest ${selectedDriverId === dId ? 'text-white/80' : 'text-green-600'}`}>
                                     Available
                                  </span>
                               </div>
                            </div>
                            {selectedDriverId === dId && (
                              <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                                 <CheckCircle2 className="w-4 h-4 text-orange-600" />
                              </div>
                            )}
                         </button>
                       );
                     })
                   ) : (
                     <div className="py-10 text-center bg-stone-50 rounded-[32px] border border-stone-100 italic">
                        <p className="text-[0.65rem] font-bold text-stone-400">No active drivers available right now.</p>
                     </div>
                   )}
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={() => {
                        setShowHandoverModal(false);
                        setSelectedDriverId("");
                     }}
                     className="flex-1 h-14 bg-stone-50 text-stone-400 rounded-3xl text-[0.7rem] font-black uppercase tracking-widest hover:bg-stone-100 hover:text-stone-950 transition-all font-sans"
                   >
                     Cancel
                   </button>
                   <button 
                     disabled={!selectedDriverId}
                     onClick={() => handleUpdateStatus(targetOrder.id, targetOrder.status, true)}
                     className={`flex-[2] h-14 rounded-3xl text-[0.7rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 font-sans ${
                       selectedDriverId 
                         ? 'bg-stone-950 text-white hover:bg-orange-600 shadow-xl shadow-stone-200' 
                         : 'bg-stone-100 text-stone-300 cursor-not-allowed border border-stone-200/50'
                     }`}
                   >
                      Confirm Assignment
                      <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderQueue;
