import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Package, 
  Phone, 
  MessageSquare, 
  ArrowLeft,
  Loader2,
  UtensilsCrossed,
  Bike
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cartService } from "../services/cartService";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const driverMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulation State
  const restaurantCoords: [number, number] = [106.7011, 10.7769];
  const userCoords: [number, number] = [106.6980, 10.7725];
  const [progress, setProgress] = useState(0.3); // Starting from 30% progress

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const result = await cartService.getOrderDetail(orderId);
        setOrder(result.data || result);
      } catch (err) {
        console.error("Fetch order error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Map Initialization
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || isLoading || !order) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [106.6995, 10.7747],
      zoom: 15,
      pitch: 45,
    });

    // Add Restaurant Marker
    const resEl = document.createElement('div');
    resEl.innerHTML = `
      <div class="p-2.5 bg-stone-950 rounded-2xl shadow-xl border border-stone-800 flex items-center justify-center transform hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
      </div>
    `;
    new maplibregl.Marker({ element: resEl })
      .setLngLat(restaurantCoords)
      .addTo(mapRef.current);

    // Add User Marker
    const userEl = document.createElement('div');
    userEl.innerHTML = `
      <div class="p-2.5 bg-white rounded-2xl shadow-xl border border-stone-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    `;
    new maplibregl.Marker({ element: userEl })
      .setLngLat(userCoords)
      .addTo(mapRef.current);

    // Initialize Driver Marker
    const driverEl = document.createElement('div');
    const driverAvatar = order.driverAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4`;
    driverEl.innerHTML = `
      <div class="relative flex flex-col items-center group">
        <div class="p-1 bg-orange-600 rounded-full shadow-2xl ring-4 ring-orange-100/50 animate-pulse relative z-10">
           <div class="h-10 w-10 rounded-full border-2 border-white overflow-hidden bg-white">
              <img src="${driverAvatar}" class="w-full h-full object-cover" />
           </div>
        </div>
        <div class="absolute -bottom-1 z-0">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
        </div>
        
        {/* Hover Label */}
        <div class="absolute -top-10 bg-stone-950 text-white px-3 py-1.5 rounded-xl text-[0.55rem] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
           ${order.driverName || 'Shipper Felix'}
        </div>
      </div>
    `;
    driverMarkerRef.current = new maplibregl.Marker({ element: driverEl })
      .setLngLat([
        restaurantCoords[0] + (userCoords[0] - restaurantCoords[0]) * progress,
        restaurantCoords[1] + (userCoords[1] - restaurantCoords[1]) * progress
      ])
      .addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [isLoading, order]);

  // Simulator Logic
  useEffect(() => {
    if (!driverMarkerRef.current || progress >= 0.95) return;

    const simInterval = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + 0.002, 0.98); // Slow movement
        
        // Update marker position
        if (driverMarkerRef.current) {
          const lng = restaurantCoords[0] + (userCoords[0] - restaurantCoords[0]) * next;
          const lat = restaurantCoords[1] + (userCoords[1] - restaurantCoords[1]) * next;
          driverMarkerRef.current.setLngLat([lng, lat]);
        }
        
        return next;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(simInterval);
  }, [isLoading, order]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
        <p className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest">Locating your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="p-6 bg-red-50 rounded-full mb-6">
          <ArrowLeft className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-black text-stone-900 uppercase mb-2">Order Not Found</h2>
        <p className="text-sm text-stone-500 mb-8 max-w-xs">We couldn't retrieve the details for this order. It might be still processing.</p>
        <button 
          onClick={() => navigate("/")}
          className="h-12 px-8 bg-stone-950 text-white rounded-2xl text-[0.65rem] font-black uppercase tracking-widest"
        >
          Return Home
        </button>
      </div>
    );
  }

  const steps = [
    { id: 'PENDING', label: 'Order Registered', icon: Clock, color: 'text-stone-400' },
    { id: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle2, color: 'text-green-500' },
    { id: 'PREPARING', label: 'Preparing Meal', icon: UtensilsCrossed, color: 'text-orange-500' },
    { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike, color: 'text-blue-500' },
    { id: 'COMPLETED', label: 'Delivered', icon: Package, color: 'text-stone-900' }
  ];

  const currentStatus = (order.status || 'PENDING').toUpperCase();
  let normalizedStatus = currentStatus;
  if (currentStatus === 'DELIVERING') normalizedStatus = 'OUT_FOR_DELIVERY';

  const currentStepIndex = steps.findIndex(s => s.id === normalizedStatus);

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 lg:p-12 font-outfit">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 scale-[0.8] origin-top">
        
        {/* Header Content */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <button 
              onClick={() => navigate("/")}
              className="group mb-6 flex items-center gap-2 text-[0.6rem] font-black text-stone-400 uppercase tracking-[0.2em] hover:text-stone-950 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Keep Exploring
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[0.65rem] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100/50">
                On its way
              </span>
              <span className="text-[0.6rem] font-black text-stone-300 uppercase tracking-widest italic">#{orderId?.slice(0, 8)}</span>
            </div>
            <h1 className="text-3xl font-black text-stone-950 tracking-tight uppercase leading-none">Track Your Order</h1>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-[28px] border border-stone-100 shadow-sm">
             <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
             </div>
             <div>
                <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest mb-0.5">Est. Arrival</p>
                <p className="text-sm font-black text-stone-950">12:45 PM — 1:00 PM</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main: Tracking Map & Steps */}
          <div className="lg:col-span-8 space-y-8">
             {/* Dynamic Map */}
             <div className="relative h-[480px] bg-stone-100 rounded-[48px] overflow-hidden border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] group">
                <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.02)]" />
                
                {/* Distance Indicator Overlay */}
                <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-white shadow-sm flex items-center gap-3 z-10 transition-all group-hover:translate-x-1">
                   <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                   <p className="m-0 text-[0.65rem] font-black text-stone-950 uppercase tracking-widest">
                      {progress < 0.9 ? `${Math.round((1 - progress) * 1.2 * 10) / 10} KM AWAY` : "DRIVER ARRIVING"}
                   </p>
                </div>
             </div>

             {/* Status Steps */}
             <div className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm overflow-x-auto">
                <div className="flex justify-between items-start min-w-[600px]">
                   {steps.map((step, index) => {
                     const isCompleted = index < currentStepIndex;
                     const isCurrent = index === currentStepIndex;
                     const Icon = step.icon;

                     return (
                       <div key={step.id} className="flex flex-col items-center w-32 relative">
                         {/* Connector Line */}
                         {index < steps.length - 1 && (
                           <div className="absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-[2px] bg-stone-100">
                             <div 
                               className={`h-full bg-orange-600 transition-all duration-1000 ${index < currentStepIndex ? 'w-full' : 'w-0'}`} 
                             />
                           </div>
                         )}
                         
                         <div className={`
                           w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10
                           ${isCompleted ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : ''}
                           ${isCurrent ? 'bg-stone-950 text-white shadow-xl shadow-stone-200 ring-4 ring-orange-50' : ''}
                           ${!isCompleted && !isCurrent ? 'bg-stone-50 text-stone-300 border border-stone-100' : ''}
                         `}>
                           {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                         </div>
                         <p className={`mt-4 text-[0.55rem] font-black uppercase tracking-widest text-center px-2 ${isCurrent ? 'text-stone-950' : 'text-stone-400'}`}>
                           {step.label}
                         </p>
                         {isCurrent && (
                           <span className="mt-1.5 flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                         )}
                       </div>
                     );
                   })}
                </div>
             </div>
          </div>

          {/* Sidebar: Order Summary & Info */}
          <div className="lg:col-span-4 space-y-8">
             {/* Delivery Person Info */}
             <div className="bg-stone-950 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[40px] rounded-full -mr-10 -mt-10" />
                <h4 className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-orange-500 mb-6 font-sans">Your Delivery Partner</h4>
                <div className="flex items-center gap-5 mb-8">
                   <div className="h-16 w-16 rounded-[22px] bg-stone-800 border boder-stone-700 overflow-hidden shrink-0">
                      <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" 
                        alt="Courier" 
                        className="w-full h-full object-cover"
                      />
                   </div>
                   <div>
                      <p className="text-md font-black tracking-tight mb-1">Felix Nguyen</p>
                      <div className="flex items-center gap-1.5">
                         <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => <span key={s} className="w-2.5 h-2.5 bg-orange-500 rounded-full" />)}
                         </div>
                         <span className="text-[0.6rem] font-bold text-stone-500 ml-1">4.9 Rating</span>
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button className="h-12 bg-white/10 hover:bg-white/20 transition-all rounded-2xl flex items-center justify-center gap-2 group">
                      <Phone className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[0.65rem] font-black uppercase tracking-widest">Call</span>
                   </button>
                   <button className="h-12 bg-white/10 hover:bg-white/20 transition-all rounded-2xl flex items-center justify-center gap-2 group">
                      <MessageSquare className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                      <span className="text-[0.65rem] font-black uppercase tracking-widest">Chat</span>
                   </button>
                </div>
             </div>

             {/* Order Details */}
             <div className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-sm space-y-8">
                <div>
                   <h4 className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-stone-300 mb-6">Order Summary</h4>
                   <div className="space-y-4">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center group">
                           <div className="flex items-center gap-3">
                              <span className="text-[0.6rem] font-black text-stone-300 tabular-nums">{item.quantity}x</span>
                              <span className="text-[0.7rem] font-black text-stone-950 uppercase tracking-wide group-hover:text-orange-600 transition-colors">{item.productName || item.name}</span>
                           </div>
                           <span className="text-[0.7rem] font-black text-stone-950">{(Number(item.totalPrice || item.price * item.quantity)).toLocaleString()}đ</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="pt-6 border-t border-stone-50 space-y-3">
                   <div className="flex justify-between items-center text-[0.65rem] font-bold text-stone-400 uppercase tracking-widest">
                      <span>Delivery Fee</span>
                      <span>Free</span>
                   </div>
                   {order.discountAmount > 0 && (
                     <div className="flex justify-between items-center text-[0.65rem] font-black text-orange-600 uppercase tracking-widest">
                        <span>Discount Applied</span>
                        <span>-{order.discountAmount.toLocaleString()}đ</span>
                     </div>
                   )}
                   <div className="flex justify-between items-center pt-3">
                      <span className="text-[0.7rem] font-black text-stone-950 uppercase tracking-[0.2em]">Total Paid</span>
                      <span className="text-xl font-black text-stone-950">{(order.total || order.totalAmount || 0).toLocaleString()}đ</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-stone-50">
                    <div className="flex items-start gap-3">
                       <MapPin className="w-4 h-4 text-stone-300 mt-0.5" />
                       <div>
                          <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest mb-1.5">Delivery Address</p>
                          <p className="text-[0.7rem] font-bold text-stone-600 leading-relaxed italic">{order.shippingAddress?.fullAddress || 'N/A'}</p>
                       </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
