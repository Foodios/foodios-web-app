import { Search, Plus, MoreHorizontal, Edit2, Trash2, Loader2, Store, LayoutGrid, Star, Eye, Filter } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import ProductForm from "../forms/ProductForm";
import { productService } from "../../../services/productService";
import { storeService } from "../../../services/storeService";
import { categoryService } from "../../../services/categoryService";

function ProductCatalog() {
  const { merchant } = useOutletContext<{ merchant: any }>();
  const [searchParams] = useSearchParams();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>(searchParams.get("storeId") || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<string>("ALL");

  const statuses = [
    { label: "All Items", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
    { label: "Draft", value: "DRAFT" }
  ];

  // Fetch initial data: Stores
  useEffect(() => {
    const initFilters = async () => {
      const merchantId = merchant?.id || merchant?.merchantId;
      if (!merchantId) return;

      try {
        const storeResult = await storeService.getStores(merchantId);
        const storeList = storeResult.data?.stores || [];
        setStores(storeList);
        
        if (storeList.length > 0 && !selectedStoreId) {
          setSelectedStoreId(storeList[0].id);
        }
      } catch (err) {
        console.error("Init filters error:", err);
      }
    };
    initFilters();
  }, [merchant]);

  // Fetch Categories whenever selectedStoreId changes
  useEffect(() => {
    const fetchCats = async () => {
      if (!selectedStoreId) return;
      try {
        const catResult = await categoryService.getCategories(selectedStoreId);
        
        let catList = [];
        if (Array.isArray(catResult.data)) {
          catList = catResult.data;
        } else if (catResult.data && Array.isArray(catResult.data.categories)) {
          catList = catResult.data.categories;
        } else if (Array.isArray(catResult)) {
          catList = catResult;
        }
        
        setCategories(catList);
        setSelectedCategoryId("all"); 
      } catch (err) {
        console.error("Fetch categories error:", err);
      }
    };
    fetchCats();
  }, [selectedStoreId]);

  const fetchProducts = useCallback(async () => {
    if (!selectedStoreId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await productService.getProducts(
        selectedStoreId, 
        selectedCategoryId === 'all' ? undefined : selectedCategoryId,
        activeStatus === 'ALL' ? undefined : activeStatus
      );
      
      let productList = [];
      if (Array.isArray(result.data)) {
        productList = result.data;
      } else if (result.data && Array.isArray(result.data.products)) {
        productList = result.data.products;
      } else if (Array.isArray(result)) {
        productList = result;
      }
      
      setProducts(productList);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Unable to load catalog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedStoreId, selectedCategoryId, activeStatus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!selectedStoreId || !window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await productService.deleteProduct(productId, selectedStoreId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-stone-950 tracking-tight leading-tight uppercase">Product Catalog</h1>
          <p className="text-sm font-medium text-stone-500 mt-1">Manage and organize your store's inventory and pricing.</p>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative group">
               <select 
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  className="h-12 pl-10 pr-6 rounded-2xl border border-stone-100 bg-white text-[0.65rem] font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm min-w-[180px]"
               >
                  {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
               </select>
               <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-600" />
            </div>

            <div className="relative group">
               <select 
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="h-12 pl-10 pr-6 rounded-2xl border border-stone-100 bg-white text-[0.65rem] font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm min-w-[150px]"
               >
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
               <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            </div>
        </div>
      </header>

      {/* Control Bar with Status Filters */}
      <div className="bg-white p-3 rounded-[32px] border border-stone-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center p-1.5 bg-stone-50 rounded-[22px] border border-stone-100 w-fit">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => setActiveStatus(s.value)}
                className={`px-8 py-2.5 rounded-[18px] text-[0.7rem] font-black uppercase tracking-widest transition-all ${
                  activeStatus === s.value 
                    ? "bg-white text-stone-950 shadow-sm" 
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {s.label}
              </button>
            ))}
        </div>

        <div className="flex items-center gap-3 pr-2">
            <div className="relative group flex-1 lg:flex-none">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-stone-950 transition-colors" />
               <input className="h-11 pl-11 pr-5 bg-stone-50 border border-stone-100 rounded-2xl text-[0.75rem] font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all w-full lg:w-64" placeholder="Scan or search products..." />
            </div>
            <button className="h-11 w-11 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center hover:bg-stone-50 transition shadow-sm text-stone-400 hover:text-stone-950">
               <Filter className="w-4 h-4" />
            </button>
            <button 
                onClick={openAddModal}
                disabled={!selectedStoreId}
                className="h-11 bg-stone-950 text-white rounded-2xl px-6 text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-stone-200 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
            >
                <Plus className="w-4 h-4" />
                New Item
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-stone-100 shadow-sm overflow-hidden">
        {isLoading && products.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center">
             <Loader2 className="w-12 h-12 text-stone-100 animate-spin mb-4" />
             <p className="text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Accessing inventory...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
             <p className="text-red-500 font-bold">{error}</p>
             <button onClick={fetchProducts} className="mt-4 text-sm font-black text-stone-950 underline underline-offset-4">Reload Catalog</button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-stone-50 rounded-[32px] flex items-center justify-center mb-6">
                <LayoutGrid className="w-8 h-8 text-stone-100" />
             </div>
             <p className="text-stone-400 font-bold italic mb-6 text-sm">No products found matching these filters.</p>
             <button onClick={openAddModal} className="h-11 px-8 bg-stone-50 text-stone-950 rounded-xl text-[0.6rem] font-black uppercase tracking-widest hover:bg-stone-950 hover:text-white transition-all">Create Product</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
               <thead>
                  <tr className="border-b border-stone-50">
                     <th className="pl-10 py-8 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Product Details</th>
                     <th className="px-8 py-8 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Pricing</th>
                     <th className="px-8 py-8 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Inventory</th>
                     <th className="px-8 py-8 text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Status</th>
                     <th className="pr-10 py-8 text-right text-[0.65rem] font-black text-stone-300 uppercase tracking-widest">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-stone-50">
                  {products.map((product) => (
                    <tr key={product.id} className="group hover:bg-stone-50/50 transition-all duration-300">
                       <td className="pl-10 py-7">
                          <div className="flex items-center gap-6">
                             <div className="h-16 w-16 bg-stone-50 rounded-[22px] border border-stone-100 overflow-hidden flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                                {product.imageUrl ? (
                                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <LayoutGrid className="w-6 h-6 text-stone-200" />
                                )}
                             </div>
                             <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                   <span className="text-[0.6rem] font-black uppercase text-orange-600 tracking-wider font-sans">{product.categoryName || 'GENERAL'}</span>
                                   {product.featured && <Star className="w-3 h-3 text-orange-400 fill-orange-400" />}
                                </div>
                                <h3 className="text-base font-black text-stone-950 tracking-tight group-hover:text-orange-600 transition-colors uppercase">{product.name}</h3>
                                <p className="text-[0.7rem] font-medium text-stone-400 line-clamp-1 max-w-[250px] mt-1 font-sans italic">
                                  {product.description || 'No description provided.'}
                                </p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-7">
                          <div className="flex flex-col gap-1">
                             <span className="text-sm font-black text-stone-950 tracking-tight">{(product.price || 0).toLocaleString()}đ</span>
                             {product.compareAtPrice > 0 && (
                               <span className="text-[0.7rem] font-bold text-stone-300 line-through">{(product.compareAtPrice).toLocaleString()}đ</span>
                             )}
                          </div>
                       </td>
                       <td className="px-8 py-7 text-sm font-bold text-stone-600 font-sans">
                          {product.internalStock} <span className="text-[0.65rem] font-black text-stone-300 uppercase ml-1">in stock</span>
                       </td>
                       <td className="px-8 py-7">
                          <div className={`w-fit px-4 py-1.5 rounded-full text-[0.6rem] font-black uppercase tracking-widest border transition-colors ${
                            product.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' :
                            product.status === 'INACTIVE' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-stone-50 text-stone-400 border-stone-100'
                          }`}>
                             {product.status || 'DRAFT'}
                          </div>
                       </td>
                       <td className="pr-10 py-7 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                             <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-50 border border-stone-100 text-stone-400 hover:bg-stone-950 hover:text-white transition-all shadow-sm">
                                <Eye className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => openEditModal(product)}
                               className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-50 border border-stone-100 text-stone-400 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                             >
                                <Edit2 className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => handleDelete(product.id)}
                               className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-50 border border-stone-100 text-red-300 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                             <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-50 border border-stone-100 text-stone-400 hover:bg-stone-950 hover:text-white transition-all shadow-sm">
                                <MoreHorizontal className="w-4.5 h-4.5" />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingProduct}
        onSuccess={fetchProducts}
        storeId={selectedStoreId}
      />
    </div>
  );
}

export default ProductCatalog;
