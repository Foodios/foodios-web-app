import { useState } from "react";
import { Search, Filter, Plus, MoreHorizontal, Star, MapPin } from "lucide-react";
import AddMerchantModal from "../modals/AddMerchantModal";

const initialMerchants = [
  { id: "M001", name: "Pizza 4P's", logo: "🍕", category: "Italian", location: "District 1", status: "Active", rating: 4.8, orders: 1240 },
  { id: "M002", name: "Banh Mi Huynh Hoa", logo: "🥖", category: "Vietnamese", location: "District 1", status: "Active", rating: 4.9, orders: 5402 },
  { id: "M003", name: "Maison Marou", logo: "🍫", category: "Dessert", location: "District 3", status: "Pending", rating: 4.7, orders: 0 },
  { id: "M004", name: "The Deck Saigon", logo: "🍷", category: "Fine Dining", location: "District 2", status: "Active", rating: 4.6, orders: 856 },
  { id: "M005", name: "Quan Ut Ut", logo: "🍖", category: "BBQ", location: "Binh Thanh", status: "Busy", rating: 4.5, orders: 2130 },
  { id: "M006", name: "Poke Saigon", logo: "🥗", category: "Healthy", location: "District 1", status: "Active", rating: 4.6, orders: 1120 },
];

function MerchantsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [merchantsList, setMerchantsList] = useState(initialMerchants);

  const handleAddMerchant = (newMerchant: any) => {
    setMerchantsList([newMerchant, ...merchantsList]);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-stone-950">Merchants Management</h1>
          <p className="text-sm text-stone-500 mt-1">Manage and monitor all restaurant partners across the platform.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-stone-950 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-800 transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Merchant
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center bg-white border border-stone-200 rounded-xl px-4 h-11 min-w-[320px] focus-within:ring-2 focus-within:ring-stone-950/10 transition-all">
            <Search className="w-4.5 h-4.5 text-stone-400 shrink-0" />
            <input
              className="w-full bg-transparent border-none outline-none px-3 text-sm text-stone-950 placeholder:text-stone-400"
              type="text"
              placeholder="Search merchants by name, ID or category..."
            />
          </div>
          <button className="h-11 px-4 flex items-center gap-2 bg-white border border-stone-200 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-50 transition-all">
            <Filter className="w-4 h-4" />
            Category
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-11 px-4 bg-white border border-stone-200 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-50 transition-all">Export Report</button>
          <div className="flex items-center bg-stone-100 p-1 rounded-xl">
             <button className="px-3 py-1.5 text-[0.8rem] font-bold bg-white text-stone-950 rounded-lg shadow-sm">Grid</button>
             <button className="px-3 py-1.5 text-[0.8rem] font-bold text-stone-500">List</button>
          </div>
        </div>
      </div>

      {/* Merchant Table */}
      <div className="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50">
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Merchant</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Category</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Location</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Orders</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Status</th>
              <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {merchantsList.map((merchant) => (
              <tr key={merchant.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors group cursor-pointer">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-stone-100 flex items-center justify-center text-xl shadow-sm border border-stone-200/50 group-hover:scale-110 transition-transform">
                      {merchant.logo}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-950">{merchant.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                        <span className="text-[0.7rem] font-bold text-stone-600">{merchant.rating}</span>
                        <span className="text-[0.7rem] text-stone-300 mx-1">|</span>
                        <span className="text-[0.7rem] font-medium text-stone-400 uppercase tracking-tighter">ID: {merchant.id}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-stone-600 bg-stone-50 px-3 py-1 rounded-lg border border-stone-100">{merchant.category}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{merchant.location}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-stone-950">{merchant.orders.toLocaleString()}</span>
                </td>
                <td className="px-6 py-5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold border ${
                    merchant.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' :
                    merchant.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      merchant.status === 'Active' ? 'bg-green-500' :
                      merchant.status === 'Pending' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} />
                    {merchant.status}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-stone-200 transition-colors">
                    <MoreHorizontal className="w-4.5 h-4.5 text-stone-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-stone-50/50 px-6 py-4 flex items-center justify-between border-t border-stone-100">
          <span className="text-[0.75rem] font-bold text-stone-400 uppercase tracking-widest">Showing {merchantsList.length} of {842 + (merchantsList.length - initialMerchants.length)} merchants</span>
          <div className="flex items-center gap-2">
             <button className="h-9 w-9 flex items-center justify-center border border-stone-200 rounded-lg bg-white text-stone-400 hover:text-stone-900 transition-all shadow-sm active:scale-90">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
             </button>
             <div className="flex items-center gap-1">
               {[1, 2, 3, "...", 12].map((n, i) => (
                 <button key={i} className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${n === 1 ? 'bg-stone-950 text-white shadow-md' : 'text-stone-500 hover:bg-stone-100'}`}>
                   {n}
                 </button>
               ))}
             </div>
             <button className="h-9 w-9 flex items-center justify-center border border-stone-200 rounded-lg bg-white text-stone-400 hover:text-stone-900 transition-all shadow-sm active:scale-90">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
             </button>
          </div>
        </div>
      </div>

      {/* Add Merchant Modal */}
      <AddMerchantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddMerchant}
      />
    </div>
  );
}
export default MerchantsView;
