import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Globe, 
  Settings, 
  ChevronRight,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  TrendingUp,
  ShoppingBag,
  DollarSign
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { storeService } from "../../../services/storeService";

function StoreDetail() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { merchant } = useOutletContext<{ merchant: any }>();
  const [store, setStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoreDetail = async () => {
      const merchantId = merchant?.id || merchant?.merchantId;
      if (!merchantId || !storeId) return;

      try {
        const result = await storeService.getStoreDetail(storeId, merchantId);
        if (result.data) {
          setStore(result.data);
        }
      } catch (err) {
        console.error("Error fetching store detail:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreDetail();
  }, [storeId, merchant]);

  if (isLoading) return (
    <div className="h-full flex flex-col items-center justify-center py-20">
       <div className="w-10 h-10 border-4 border-stone-100 border-t-orange-500 rounded-full animate-spin mb-4" />
       <p className="text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Loading store profile...</p>
    </div>
  );

  if (!store) return (
    <div className="bg-white rounded-[32px] p-20 text-center border border-stone-100 flex flex-col items-center">
       <AlertCircle className="w-12 h-12 text-red-100 mb-6" />
       <h2 className="text-xl font-black text-stone-950">Store Not Found</h2>
       <button onClick={() => navigate('/merchant/stores')} className="mt-8 px-6 h-12 bg-stone-950 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Back to Stores</button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Navigation & Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-5">
           <button onClick={() => navigate('/merchant/stores')} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-stone-100 hover:bg-stone-50 transition-all shadow-sm">
              <ArrowLeft className="w-4 h-4 text-stone-400" />
           </button>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 overflow-hidden shadow-md border border-white">
                 <img src={store.heroImageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80"} className="w-full h-full object-cover" />
              </div>
              <div>
                 <h1 className="text-xl font-black text-stone-950 tracking-tight leading-none mb-1">{store.name}</h1>
                 <div className="flex items-center gap-2">
                    <span className="text-[0.7rem] font-black text-orange-600 uppercase tracking-widest leading-none">{store.slug}</span>
                    <span className="w-1 h-1 rounded-full bg-stone-200" />
                    <span className="text-[0.7rem] font-bold text-green-600 uppercase tracking-widest leading-none">{store.status}</span>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button 
              onClick={() => navigate(`/merchant/stores/${storeId}/edit`)}
              className="h-11 px-5 bg-white border border-stone-100 rounded-xl text-[0.7rem] font-black uppercase tracking-widest shadow-sm hover:bg-stone-50 transition-all flex items-center gap-2"
           >
              <Edit className="w-3.5 h-3.5" /> Edit
           </button>
           <button className="h-11 w-11 bg-white border border-red-50 text-red-200 hover:text-red-500 rounded-xl flex items-center justify-center transition-all">
              <Trash2 className="w-4 h-4" />
           </button>
        </div>
      </header>

      {/* TOP FULL-WIDTH PERFORMANCE BAR */}
      <div className="bg-white rounded-[24px] border border-stone-100 p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 relative overflow-hidden items-center">
         <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-orange-50 flex items-center justify-center shr-0">
               <DollarSign className="w-4 h-4 text-orange-600" />
            </div>
            <div>
               <p className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest mb-0.5">Total Revenue</p>
               <h3 className="text-xl font-black text-stone-950 tracking-tight">24.5M <span className="text-[0.7rem] text-stone-400 ml-1">VND</span></h3>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-stone-50 flex items-center justify-center shr-0">
               <ShoppingBag className="w-4 h-4 text-stone-950" />
            </div>
            <div>
               <p className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest mb-0.5">Orders Count</p>
               <h3 className="text-xl font-black text-stone-950 tracking-tight">214</h3>
            </div>
         </div>

         <div className="flex items-center gap-6 md:col-span-2 md:border-l border-stone-50 md:pl-10">
            <div className="relative w-14 h-14 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-stone-50" />
                  <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="5" fill="transparent" strokeDasharray={150} strokeDashoffset={150 * 0.3} className="text-orange-600" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[0.7rem] font-black">70%</span>
               </div>
            </div>
            <div className="flex-1">
               <div className="flex justify-between items-end mb-1.5">
                  <p className="text-[0.7rem] font-black text-stone-500 uppercase tracking-widest">Growth Target</p>
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" />
               </div>
               <div className="w-full h-2 bg-stone-50 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600 rounded-full w-[70%]" />
               </div>
               <p className="mt-2 text-[0.7rem] font-bold text-stone-400 leading-none tracking-tight">Store performance is stable</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
         {/* Main Content Area */}
         <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
               {/* General Info */}
               <div className="bg-white rounded-[24px] border border-stone-100 p-7 flex flex-col h-full min-h-[220px]">
                  <h2 className="text-[0.7rem] font-black text-stone-950 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-stone-50 pb-4 mb-6">
                     <Globe className="w-3.5 h-3.5 text-orange-600" />
                     Branch Info
                  </h2>
                  <div className="flex-1 flex flex-col justify-between py-1">
                     <div>
                        <p className="text-[0.65rem] font-black text-stone-300 uppercase tracking-widest mb-1.5">Direct Line</p>
                        <p className="text-sm font-black text-stone-950">{store.phone}</p>
                     </div>
                     <div>
                        <p className="text-[0.65rem] font-black text-stone-300 uppercase tracking-widest mb-2">Location</p>
                        <div className="flex items-start gap-2.5 text-stone-950">
                           <MapPin className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                           <span className="text-[0.8rem] font-bold leading-relaxed line-clamp-2">
                             {store.address?.line1 || store.address}
                             <br />
                             <span className="text-stone-400 text-[0.7rem] font-medium italic">Ward {store.address?.ward}, District {store.address?.district}</span>
                           </span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Hours Info */}
               <div className="bg-white rounded-[24px] border border-stone-100 p-7 flex flex-col h-full min-h-[220px]">
                  <h2 className="text-[0.7rem] font-black text-stone-950 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-stone-50 pb-4 mb-6">
                     <Clock className="w-3.5 h-3.5 text-orange-600" />
                     Operational
                  </h2>
                  <div className="flex-1 flex flex-col justify-between py-1">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-stone-50 rounded-xl flex flex-col items-center justify-center text-center border border-stone-100/50">
                           <span className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1.5">Opens</span>
                           <span className="text-sm font-black text-stone-950">{store.opensAt?.substring(0, 5)}</span>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-xl flex flex-col items-center justify-center text-center border border-stone-100/50">
                           <span className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1.5">Closes</span>
                           <span className="text-sm font-black text-stone-950">{store.closesAt?.substring(0, 5)}</span>
                        </div>
                     </div>
                     <div className="mt-5 px-4 py-2.5 bg-blue-50/50 rounded-xl flex items-center gap-3 border border-blue-50/50">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-[0.65rem] font-black text-blue-700 uppercase tracking-widest">Mon — Sun Schedule</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Connecting Section */}
            <div className="bg-white border border-stone-100 rounded-[24px] p-10 flex flex-col items-center justify-center text-center group transition-all hover:shadow-lg hover:shadow-stone-100/50">
               <div className="h-12 w-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <PlusIcon className="w-5 h-5 text-stone-300 group-hover:text-orange-600" />
               </div>
               <p className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest">External Integrations</p>
               <p className="text-[0.7rem] text-stone-300 mt-2 max-w-[320px] font-medium leading-relaxed italic">Synchronize inventory across GrabFood, ShopeeFood or menu tablets specifically for this branch.</p>
            </div>
         </div>

         {/* Sidebar Actions */}
         <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-stone-950 rounded-[24px] p-7 text-white shadow-xl relative overflow-hidden flex-1 min-h-[220px]">
               <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                     <Settings className="w-4 h-4 text-orange-500" />
                     <span className="text-[0.7rem] font-black uppercase tracking-widest text-stone-500">Store Context</span>
                  </div>
                  <div className="space-y-3 mt-auto">
                     <button className="w-full h-12 bg-white/5 hover:bg-white text-white hover:text-stone-950 rounded-xl flex items-center justify-between px-5 transition-all group/btn border border-white/5">
                        <span className="text-[0.7rem] font-black uppercase tracking-widest">Public Shop</span>
                        <ExternalLink className="w-4 h-4 opacity-30 group-hover/btn:opacity-100" />
                     </button>
                     <button className="w-full h-12 bg-white/5 hover:bg-white text-white hover:text-stone-950 rounded-xl flex items-center justify-between px-5 transition-all group/btn border border-white/5">
                        <span className="text-[0.7rem] font-black uppercase tracking-widest">Advance Dev</span>
                        <ChevronRight className="w-4 h-4 opacity-30 group-hover/btn:opacity-100" />
                     </button>
                  </div>
               </div>
               <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="p-7 bg-orange-600 rounded-[24px] text-white shadow-xl relative overflow-hidden group flex-1 min-h-[160px] flex flex-col">
               <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                     <h3 className="text-base font-black mb-1">Growth Action</h3>
                     <p className="text-[0.65rem] text-white/90 font-bold uppercase tracking-widest leading-normal">Localized promotion for customers near this branch.</p>
                  </div>
                  <button className="w-full h-11 bg-white text-orange-600 text-[0.7rem] font-black uppercase tracking-widest rounded-xl transition-transform hover:scale-105 shadow-lg shadow-orange-900/20">Create Campaign</button>
               </div>
               <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
         </div>
      </div>
    </div>
  );
}

function PlusIcon({ className }: { className: string }) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
   );
}

export default StoreDetail;
