import { Search, Plus, Filter, MoreHorizontal, UtensilsCrossed, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import ProductForm from "../forms/ProductForm";

const mockCategories = [
  { id: "C1", name: "Appetizers", itemCount: 8, status: "Active" },
  { id: "C2", name: "Main Courses", itemCount: 24, status: "Active" },
  { id: "C3", name: "Desserts", itemCount: 12, status: "Active" },
  { id: "C4", name: "Drinks", itemCount: 15, status: "Inactive" },
];

const mockProducts = [
  { id: "P1", name: "Burrata Pizza", category: "Main Courses", price: 245000, stock: 42, status: "Available", image: "🍕" },
  { id: "P2", name: "Garlic Focaccia", category: "Appetizers", price: 85000, stock: 12, status: "Low Stock", image: "🥗" },
  { id: "P3", name: "Tiramisu", category: "Desserts", price: 120000, stock: 15, status: "Available", image: "🍰" },
  { id: "P4", name: "Espresso Martini", category: "Drinks", price: 155000, stock: 0, status: "Out of Stock", image: "🍸" },
];

function MenuManagement() {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-950 tracking-tight">Catalogs & Inventory</h1>
          <p className="text-sm font-medium text-stone-500 mt-1">Manage your shop's menu items, categories and pricing.</p>
        </div>
        <div className="flex bg-stone-100 p-1.5 rounded-[20px] shadow-inner shadow-black/5 self-end">
           <button 
              onClick={() => setActiveTab("products")}
              className={`px-6 py-2 rounded-[14px] text-[0.8rem] font-black transition-all ${activeTab === 'products' ? 'bg-white text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
           >
              Products List
           </button>
           <button 
              onClick={() => setActiveTab("categories")}
              className={`px-6 py-2 rounded-[14px] text-[0.8rem] font-black transition-all ${activeTab === 'categories' ? 'bg-white text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
           >
              Categories
           </button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 max-w-md items-center gap-3 bg-white px-5 rounded-[22px] border border-stone-100 h-14 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/10 transition-all group">
           <Search className="w-5 h-5 text-stone-300 group-hover:text-stone-400 transition-colors" />
           <input className="w-full bg-transparent border-none outline-none text-sm font-medium placeholder:text-stone-300 text-stone-950" placeholder={`Quick search ${activeTab}...`} />
        </div>
        <div className="flex items-center gap-3">
           <button className="h-14 w-14 bg-white border border-stone-100 rounded-[22px] flex items-center justify-center hover:bg-stone-50 transition shadow-sm">
              <Filter className="w-5 h-5 text-stone-500" />
           </button>
           <button 
              onClick={openAddModal}
              className="h-14 bg-stone-950 text-white rounded-[22px] px-8 text-sm font-bold flex items-center gap-3 shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all active:scale-95"
           >
              <Plus className="w-5 h-5" />
              Add New {activeTab === 'products' ? 'Item' : 'Category'}
           </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
           {mockProducts.map((product) => (
             <div key={product.id} className="bg-white rounded-[32px] border border-stone-100 p-6 flex flex-col group hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                   <div className="h-16 w-16 bg-stone-50 rounded-[20px] flex items-center justify-center text-3xl shadow-sm border border-stone-100 transition-all group-hover:scale-110">
                      {product.image}
                   </div>
                   <button 
                      onClick={() => openEditModal(product)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-stone-50 hover:bg-stone-950 hover:text-white transition-all text-stone-300"
                   >
                      <Edit2 className="w-4 h-4" />
                   </button>
                </div>
                <div className="flex-1">
                   <span className="text-[0.65rem] font-black uppercase text-stone-400 tracking-widest">{product.category}</span>
                   <h3 className="text-xl font-black text-stone-950 mt-1 tracking-tight">{product.name}</h3>
                   <div className="flex items-center gap-2 mt-4">
                      <span className="text-lg font-black text-stone-900">{product.price.toLocaleString()}đ</span>
                      <span className="h-3.5 w-0.5 bg-stone-100 mx-1" />
                      <span className="text-[0.8rem] font-bold text-stone-400">{product.stock} in active stock</span>
                   </div>
                </div>
                <div className="mt-8 flex items-center justify-between pt-6 border-t border-stone-50">
                   <div className={`px-4 py-1.5 rounded-full text-[0.7rem] font-black uppercase tracking-widest border ${
                     product.status === 'Available' ? 'bg-green-50 text-green-600 border-green-100' :
                     product.status === 'Low Stock' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                     'bg-red-50 text-red-600 border-red-100'
                   }`}>
                      {product.status}
                   </div>
                   <div className="flex items-center gap-1">
                       <button className="p-2 text-stone-300 hover:text-red-500 transition-colors"><Trash2 className="w-4.5 h-4.5" /></button>
                       <button className="p-2 text-stone-300 hover:text-stone-950 transition-colors"><MoreHorizontal className="w-4.5 h-4.5" /></button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-stone-100 p-2 shadow-sm overflow-hidden">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-stone-50/50">
                    <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em]">Category Name</th>
                    <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em]">Item Count</th>
                    <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em]">Status</th>
                    <th className="px-8 py-5 text-[0.7rem] font-black uppercase text-stone-400 tracking-[0.2em] text-right">Settings</th>
                 </tr>
              </thead>
              <tbody>
                 {mockCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-stone-50/30 transition-colors border-b border-stone-50/50 cursor-pointer group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 flex items-center justify-center bg-stone-900 rounded-xl">
                                <UtensilsCrossed className="w-4 h-4 text-white" />
                             </div>
                             <span className="text-base font-black text-stone-900 tracking-tight group-hover:text-orange-500 transition-colors">{cat.name}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-[0.95rem] font-bold text-stone-400">{cat.itemCount} menu items</span>
                       </td>
                       <td className="px-8 py-6">
                          <div className={`inline-flex h-2.5 w-2.5 rounded-full mr-2 ${cat.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-stone-300'}`} />
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
                                onClick={(e) => { e.stopPropagation(); }}
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
        </div>
      )}

      {/* Product/Category Form Modal */}
      <ProductForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingItem} 
      />
    </div>
  );
}

export default MenuManagement;
