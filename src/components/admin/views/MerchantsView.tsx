import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Plus, MoreHorizontal, Star, Loader2, AlertCircle, Pencil, Trash2 } from "lucide-react";
import AddMerchantModal from "../modals/AddMerchantModal";
import MerchantApplicationsView from "./MerchantApplicationsView";
import MerchantPaymentsView from "./MerchantPaymentsView";
import { adminService } from "../../../services/adminService";

function MerchantsView() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'active-shops';
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<any>(null);
  const [merchantsList, setMerchantsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMerchants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      if (searchQuery.trim()) {
        result = await adminService.searchMerchants(searchQuery);
      } else {
        result = await adminService.getMerchants();
      }
      
      const rawData = result.data || result;
      const finalData = Array.isArray(rawData) ? rawData : (rawData.items || rawData.content || []);
      setMerchantsList(finalData);
    } catch (err) {
      console.error("Fetch merchants error:", err);
      setError("Failed to load merchants list.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const handleMerchantSaved = () => {
    fetchMerchants();
  };

  const handleDeleteMerchant = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

    try {
      await adminService.deleteMerchant(id);
      setMerchantsList(merchantsList.filter(m => m.id !== id));
      alert("Merchant deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete merchant.");
    }
  };

  const openEditModal = (merchant: any) => {
    setEditingMerchant(merchant);
    setIsModalOpen(true);
  };

  if (activeTab === 'applications') {
    return <MerchantApplicationsView onBack={() => {}} />;
  }

  if (activeTab === 'payments') {
    return <MerchantPaymentsView />;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-stone-950">Merchants Management</h1>
          <p className="text-sm text-stone-500 mt-1">Manage and monitor all restaurant partners across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditingMerchant(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-stone-950 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-800 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Merchant
          </button>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center bg-white border border-stone-200 rounded-xl px-4 h-11 min-w-[320px] focus-within:ring-2 focus-within:ring-stone-950/10 transition-all">
            <Search className="w-4.5 h-4.5 text-stone-400 shrink-0" />
            <input
              className="w-full bg-transparent border-none outline-none px-3 text-sm text-stone-950 placeholder:text-stone-400"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merchants by name or ID..."
            />
          </div>
          <button onClick={() => fetchMerchants()} className="h-11 px-4 flex items-center gap-2 bg-stone-950 text-white rounded-xl text-sm font-bold hover:bg-stone-800 transition-all">
            Search
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-11 px-4 bg-white border border-stone-200 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-50 transition-all">Export Report</button>
        </div>
      </div>

      {/* Merchant Table */}
      <div className="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-sm min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Merchant</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Category</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Description</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Status</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-stone-400 font-bold">
                    <Loader2 className="w-8 h-8 text-stone-950 animate-spin mx-auto mb-4" />
                    Fetching data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                    <p className="text-red-500 font-bold">{error}</p>
                  </td>
                </tr>
              ) : merchantsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-stone-400 font-bold">No merchants found.</td>
                </tr>
              ) : (
                merchantsList.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-stone-100 flex items-center justify-center text-xl overflow-hidden shadow-sm border border-stone-200/50 group-hover:scale-110 transition-transform">
                          {merchant.logoUrl ? (
                            <img src={merchant.logoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">🏪</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-950">{merchant.displayName || merchant.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                            <span className="text-[0.7rem] font-bold text-stone-600">{merchant.rating || "N/A"}</span>
                            <span className="text-[0.7rem] text-stone-300 mx-1">|</span>
                            <span className="text-[0.7rem] font-medium text-stone-400 uppercase tracking-tighter">ID: #{merchant.id?.substring(0, 8)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-stone-600 bg-stone-50 px-3 py-1 rounded-lg border border-stone-100 uppercase italic text-[10px] tracking-tight">
                        {merchant.cuisineCategory || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs text-stone-500 line-clamp-1 max-w-[200px] leading-relaxed">
                        {merchant.description || "No description provided."}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold border ${
                        (merchant.status || 'Active').toLowerCase() === 'active' ? 'bg-green-50 text-green-600 border-green-100' :
                        (merchant.status || 'Active').toLowerCase() === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${
                          (merchant.status || 'Active').toLowerCase() === 'active' ? 'bg-green-500' :
                          (merchant.status || 'Active').toLowerCase() === 'pending' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`} />
                        {merchant.status || 'Active'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(merchant)}
                          className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-stone-50 text-stone-400 hover:bg-stone-950 hover:text-white transition-all shadow-sm border border-stone-100 hover:border-stone-950 active:scale-90"
                          title="Edit Merchant"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMerchant(merchant.id, merchant.displayName || merchant.name)}
                          className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-stone-50 text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm border border-stone-100 hover:border-red-100 active:scale-90"
                          title="Delete Merchant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-stone-50 text-stone-400 hover:bg-stone-200 transition-all shadow-sm border border-stone-100 active:scale-90">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="bg-stone-50/50 px-6 py-4 flex items-center justify-between border-t border-stone-100">
          <span className="text-[0.75rem] font-bold text-stone-400 uppercase tracking-widest">
            Showing {merchantsList.length} partners
          </span>
          <div className="flex items-center gap-2 text-[0.7rem] font-black text-stone-400 uppercase tracking-widest">
            Page 1 of 1
          </div>
        </div>
      </div>

      <AddMerchantModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingMerchant(null); }} 
        onAdd={handleMerchantSaved}
        editingMerchant={editingMerchant}
      />
    </div>
  );
}

export default MerchantsView;
