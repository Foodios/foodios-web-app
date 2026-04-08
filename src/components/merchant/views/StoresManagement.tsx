import { 
  MapPin, 
  Phone, 
  Plus, 
  Search, 
  MoreVertical, 
  ExternalLink,
  Loader2,
  RefreshCcw,
  Info,
  Edit
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import StoreForm from "../forms/StoreForm";
import { storeService } from "../../../services/storeService";

function StoresManagement() {
  const navigate = useNavigate();
  const { merchant } = useOutletContext<{ merchant: any }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<any>(null);

  const fetchStores = useCallback(async () => {
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!merchantId) return;
    
    setIsLoading(true);
    try {
      const result = await storeService.getStores(merchantId);
      // Fixed: The API returns data.stores array
      const storeList = result.data?.stores || [];
      setStores(storeList);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  }, [merchant]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleStoreClick = async (store: any) => {
    // According to user: "khi click vào store sẽ call api này để fetch thông tin của stores"
    // We fetch the full list again or refresh this specific one. 
    // For now, let's toast/log and highlight the store.
    setSelectedStore(store);
    await fetchStores(); // Refreshing list to get latest state
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-950 tracking-tight">Stores & Branches</h1>
          <p className="text-sm font-medium text-stone-500 mt-1">Found {stores.length} locations registered under your merchant.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStores}
            className="h-14 w-14 bg-white border border-stone-100 rounded-[22px] flex items-center justify-center hover:bg-stone-50 transition shadow-sm text-stone-400 hover:text-stone-950"
          >
             <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-14 bg-stone-950 text-white rounded-[22px] px-8 text-sm font-bold flex items-center gap-3 shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all active:scale-95"
          >
             <Plus className="w-5 h-5" />
             Add New Branch
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="flex flex-1 max-w-md items-center gap-3 bg-white px-5 rounded-[22px] border border-stone-100 h-14 shadow-sm focus-within:ring-4 focus-within:ring-orange-500/5 transition-all group">
         <Search className="w-5 h-5 text-stone-300 group-focus-within:text-stone-950 transition-colors" />
         <input className="w-full bg-transparent border-none outline-none text-sm font-bold placeholder:text-stone-300 text-stone-950" placeholder="Search by name or address..." />
      </div>

      {isLoading && stores.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[40px] border border-stone-50">
           <Loader2 className="w-12 h-12 text-stone-100 animate-spin mb-4" />
           <p className="text-[0.6rem] font-black text-stone-300 uppercase tracking-widest">Loading latest data...</p>
        </div>
      ) : stores.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-stone-200 flex flex-col items-center">
           <div className="w-16 h-16 bg-stone-50 rounded-3xl flex items-center justify-center mb-6">
              <Info className="w-8 h-8 text-stone-200" />
           </div>
           <p className="text-stone-400 font-bold italic mb-6 text-sm">No branches found. Connect your first location to start taking orders.</p>
           <button onClick={() => setIsModalOpen(true)} className="h-12 px-8 bg-stone-50 text-stone-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-stone-950 hover:text-white transition-all">Add Branch</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
           {stores.map((store) => (
             <div 
               key={store.id} 
               onClick={() => handleStoreClick(store)}
               className={`bg-white rounded-[32px] border p-5 flex flex-col md:flex-row gap-6 group cursor-pointer transition-all duration-500 ${
                 selectedStore?.id === store.id ? 'border-orange-500 ring-4 ring-orange-500/5 shadow-xl' : 'border-stone-100 hover:shadow-xl'
               }`}
             >
                <div className="h-36 w-full md:w-52 bg-stone-50 rounded-[28px] overflow-hidden shrink-0 relative shadow-inner">
                   <img 
                      src={store.heroImageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80"} 
                      alt={store.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                   />
                   <div className="absolute top-3 left-3">
                      <div className={`px-3 py-1 rounded-full text-[0.55rem] font-black uppercase tracking-widest border backdrop-blur-md shadow-sm ${
                        store.status === 'ACTIVE' || store.status === 'Open' ? 'bg-white/90 text-green-600 border-green-100' : 'bg-stone-900/90 text-white border-transparent'
                      }`}>
                         {store.status || 'DRAFT'}
                      </div>
                   </div>
                </div>

                <div className="flex-1 flex flex-col pt-1">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <span className="text-[0.6rem] font-black uppercase text-orange-600 tracking-[0.2em]">{store.slug || 'BRANCH'}</span>
                         <h3 className="text-lg font-black text-stone-950 mt-0.5 tracking-tight group-hover:text-orange-600 transition-colors">{store.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             navigate(`/merchant/stores/${store.id}/edit`);
                           }}
                           className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-stone-50 transition-colors"
                         >
                            <Edit className="w-3.5 h-3.5 text-stone-400" />
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); }}
                           className="h-8 w-8 flex items-center justify-center rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
                         >
                            <MoreVertical className="w-4 h-4 text-stone-400" />
                         </button>
                      </div>
                   </div>

                   <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3 text-stone-500">
                         <div className="mt-0.5 flex-shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-stone-300" />
                         </div>
                         <span className="text-[0.75rem] font-bold text-stone-600 leading-relaxed line-clamp-2">
                           {typeof store.address === 'object' 
                             ? `${store.address.line1}, ${store.address.district}, ${store.address.city}` 
                             : store.address || 'No address provided'}
                         </span>
                      </div>
                      <div className="flex items-center gap-3 text-stone-500">
                         <Phone className="w-3.5 h-3.5 text-stone-300" />
                         <span className="text-[0.75rem] font-bold text-stone-600">{store.phone}</span>
                      </div>
                   </div>

                   <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-50">
                      <div className="flex items-center gap-2">
                         <Clock className="w-3.5 h-3.5 text-stone-200" />
                         <span className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">
                           {store.opensAt?.substring(0, 5) || '08:00'} — {store.closesAt?.substring(0, 5) || '22:00'}
                         </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/merchant/stores/${store.id}`);
                        }}
                        className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-orange-600 group-hover:gap-3 transition-all"
                      >
                         View Details
                         <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      <StoreForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchStores}
        merchantId={merchant?.id || merchant?.merchantId}
      />
    </div>
  );
}

function Clock({ className }: { className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default StoresManagement;
