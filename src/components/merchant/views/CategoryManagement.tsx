import { Search, Plus, UtensilsCrossed, Edit2, Trash2, Loader2, Store } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import CategoryForm from "../forms/CategoryForm";
import { storeService } from "../../../services/storeService";
import { categoryService } from "../../../services/categoryService";

function CategoryManagement() {
  const navigate = useNavigate();
  const { merchant } = useOutletContext<{ merchant: any }>();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isStoresLoading, setIsStoresLoading] = useState(true);

  // Fetch stores first to get storeId
  useEffect(() => {
    const fetchStores = async () => {
      const merchantId = merchant?.id || merchant?.merchantId;
      if (!merchantId) {
        setIsStoresLoading(false);
        setIsLoading(false);
        return;
      }

      try {
        const result = await storeService.getStores(merchantId);
        const storeList = result.data?.stores || [];
        setStores(storeList);
        if (storeList.length > 0) {
          setSelectedStoreId(storeList[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch stores:", err);
      } finally {
        setIsStoresLoading(false);
      }
    };

    fetchStores();
  }, [merchant]);

  // Fetch categories when selectedStoreId changes
  const fetchCategories = useCallback(async () => {
    if (!selectedStoreId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await categoryService.getCategories(selectedStoreId);
      
      // Determine the array from the common backend response patterns
      let categoryList = [];
      if (Array.isArray(result.data)) {
        categoryList = result.data;
      } else if (result.data && Array.isArray(result.data.categories)) {
        categoryList = result.data.categories;
      } else if (Array.isArray(result)) {
        categoryList = result;
      }
      
      setCategories(categoryList);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStoreId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (cat: any) => {
    if (!window.confirm(`Are you sure you want to delete "${cat.name}"? This action cannot be undone.`)) return;

    try {
      await categoryService.deleteCategory(cat.id, selectedStoreId);
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-950 tracking-tight">Menu Categories</h1>
          <p className="text-sm font-medium text-stone-500 mt-1">Organize your products into logical sections for your customers.</p>
        </div>
        
        {/* Store Selector */}
        {!isStoresLoading && stores.length > 0 && (
          <div className="relative">
            <select 
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="h-12 pl-12 pr-6 rounded-2xl border border-stone-100 bg-white text-xs font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm min-w-[200px]"
            >
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
            <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-600" />
          </div>
        )}
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 max-w-md items-center gap-3 bg-white px-5 rounded-[22px] border border-stone-100 h-14 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/10 transition-all group">
           <Search className="w-5 h-5 text-stone-300 group-focus-within:text-stone-950 transition-colors" />
           <input className="w-full bg-transparent border-none outline-none text-sm font-medium placeholder:text-stone-300 text-stone-950" placeholder="Search categories..." />
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={fetchCategories}
             className="h-14 w-14 bg-white border border-stone-100 rounded-[22px] flex items-center justify-center hover:bg-stone-50 transition shadow-sm"
           >
              <Loader2 className={`w-5 h-5 text-stone-400 ${isLoading ? 'animate-spin' : ''}`} />
           </button>
           <button 
              onClick={openAddModal}
              disabled={!selectedStoreId}
              className="h-14 bg-stone-950 text-white rounded-[22px] px-8 text-sm font-bold flex items-center gap-3 shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all active:scale-95 disabled:opacity-50"
           >
              <Plus className="w-5 h-5" />
              Add Category
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-stone-100 p-2 shadow-sm overflow-hidden content-center">
         {isLoading ? (
           <div className="py-20 flex flex-col items-center justify-center text-center">
             <Loader2 className="w-10 h-10 text-stone-100 animate-spin mb-4" />
             <p className="text-[0.6rem] font-black text-stone-300 uppercase tracking-widest">Loading categories...</p>
           </div>
         ) : (categories.length === 0 || !selectedStoreId) ? (
           <div className="py-20 text-center flex flex-col items-center px-6">
             <div className="w-16 h-16 bg-stone-50 rounded-3xl flex items-center justify-center mb-6">
                <UtensilsCrossed className="w-8 h-8 text-stone-100" />
             </div>
             <p className="text-stone-400 font-bold italic text-sm">
               {!selectedStoreId 
                 ? "You need to select or create a branch before managing categories." 
                 : "No categories found for this branch."}
             </p>
             <button 
               onClick={!selectedStoreId ? () => navigate('/merchant/stores/management') : openAddModal} 
               className="mt-6 h-11 px-8 bg-stone-50 hover:bg-stone-950 hover:text-white rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all shadow-sm"
             >
               {!selectedStoreId ? "Go to Stores Management" : "Create First Category"}
             </button>
           </div>
         ) : (
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-stone-50/50">
                    <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em]">Category Name</th>
                    <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em]">Status</th>
                    <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em] text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {categories.map((cat) => (
                    <tr 
                      key={cat.id} 
                      onClick={() => navigate(`/merchant/categories/${cat.id}?storeId=${selectedStoreId}`)}
                      className="hover:bg-stone-50/30 transition-colors border-b border-stone-50/50 cursor-pointer group"
                    >
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 flex items-center justify-center bg-stone-900 rounded-xl">
                                <UtensilsCrossed className="w-4 h-4 text-white" />
                             </div>
                             <span className="text-base font-black text-stone-900 tracking-tight group-hover:text-orange-500 transition-colors">{cat.name}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className={`inline-flex h-2.5 w-2.5 rounded-full mr-2 ${cat.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-stone-300'}`} />
                          <span className="text-sm font-bold text-stone-500">{cat.status}</span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                             <button 
                                onClick={(e) => { e.stopPropagation(); openEditModal(cat); }}
                                className="h-9 w-9 flex items-center justify-center rounded-lg bg-stone-100 text-stone-500 hover:bg-stone-950 hover:text-white transition-all"
                             >
                                <Edit2 className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(cat); }}
                                className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
         )}
      </div>

      <CategoryForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingCategory}
        storeId={selectedStoreId}
        onSuccess={fetchCategories}
      />
    </div>
  );
}

export default CategoryManagement;
