import { Store, MapPin, Camera, Save, Lock, Bell, ShieldCheck } from "lucide-react";
import { useState } from "react";

function SettingsView() {
  const [activeTab, setActiveTab] = useState<"general" | "account" | "notifications">("general");

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-black text-stone-950 tracking-tight">Shop Settings</h1>
        <p className="text-sm font-medium text-stone-500 mt-1">Manage your shop profile, account preferences and security.</p>
      </header>

      <div className="flex gap-1.5 p-1.5 bg-stone-100 rounded-[24px] self-start mb-2">
         {[
           { id: "general", label: "General Info", icon: Store },
           { id: "account", label: "Security", icon: Lock },
           { id: "notifications", label: "Preferences", icon: Bell },
         ].map((tab) => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-6 py-2.5 rounded-[18px] text-[0.8rem] font-black flex items-center gap-2.5 transition-all ${activeTab === tab.id ? 'bg-white text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
           >
              <tab.icon className="w-4 h-4" />
              {tab.label}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* Left Column: Forms */}
         <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-[40px] border border-stone-100 p-10 shadow-sm">
               <div className="flex items-center gap-4 mb-10">
                  <div className="h-12 w-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-100">
                     <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-stone-950">Store Identity</h2>
                    <p className="text-sm text-stone-400 font-medium">Public information about your restaurant.</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-2">
                     <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Restaurant Name</label>
                     <input type="text" defaultValue="Pizza 4P's Ben Thanh" className="w-full h-14 px-6 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all" />
                  </div>

                  <div>
                     <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Store Slug (URL)</label>
                     <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 font-bold text-sm">foodios.vn/</span>
                        <input type="text" defaultValue="pizza-4ps-bt" className="w-full h-14 pl-[92px] pr-6 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all" />
                     </div>
                  </div>

                  <div>
                     <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Merchant Category</label>
                     <select className="w-full h-14 px-6 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 appearance-none transition-all">
                        <option>Italian Cuisine</option>
                        <option>Fast Food</option>
                        <option>Drinks & Cafe</option>
                     </select>
                  </div>

                  <div className="col-span-2">
                     <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Store Description</label>
                     <textarea rows={4} defaultValue="Pizza 4P's is a Japanese-Italian pizza restaurant chain located in Vietnam. We believe in 'Delivering Wow, Sharing Happiness' through our house-made cheese and farm-to-table ingredients." className="w-full p-6 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all resize-none" />
                  </div>

                  <div className="col-span-2">
                     <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Address</label>
                     <div className="relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                        <input type="text" defaultValue="8 Thu Khoa Huan, Ward Ben Thanh, District 1, HCMC" className="w-full h-14 pl-14 pr-6 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all" />
                     </div>
                  </div>
               </div>

               <div className="mt-12 pt-10 border-t border-stone-50 flex justify-end">
                  <button className="h-14 px-10 bg-stone-950 text-white rounded-2xl text-sm font-bold flex items-center gap-3 shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all active:scale-95">
                     <Save className="w-4.5 h-4.5" />
                     Save Changes
                  </button>
               </div>
            </div>
         </div>

         {/* Right Column: Visuals & Stats */}
         <div className="flex flex-col gap-8">
            <div className="bg-white rounded-[40px] border border-stone-100 p-8 shadow-sm">
                <h3 className="text-sm font-black text-stone-950 uppercase tracking-widest mb-6">Store Branding</h3>
                <div className="relative group">
                   <div className="h-40 w-full rounded-[32px] bg-stone-100 overflow-hidden border border-stone-100">
                      <img src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" />
                   </div>
                   <button className="absolute inset-0 flex items-center justify-center bg-stone-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all rounded-[32px]">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                         <Camera className="w-5 h-5 text-stone-950" />
                      </div>
                   </button>
                </div>
                <div className="flex items-center gap-4 mt-6">
                   <div className="h-16 w-16 rounded-2xl bg-stone-900 border-4 border-white shadow-xl -mt-12 ml-4 relative z-10 flex items-center justify-center">
                      <Store className="w-8 h-8 text-white" />
                   </div>
                   <div className="mt-2">
                      <p className="text-xs font-black text-stone-950">Store Logo</p>
                      <p className="text-[0.65rem] text-stone-400 font-bold">500x500px Recommended</p>
                   </div>
                </div>
            </div>

            <div className="bg-orange-50 rounded-[40px] p-8 border border-orange-100/50">
               <ShieldCheck className="w-8 h-8 text-orange-600 mb-4" />
               <h3 className="text-base font-black text-stone-950">Store Verification</h3>
               <p className="text-sm text-stone-600 font-medium mt-2 leading-relaxed">Your store profile is currently 100% complete and verified for public display.</p>
               <button className="mt-6 text-sm font-black text-orange-600 hover:underline">View Public Page</button>
            </div>
         </div>
      </div>
    </div>
  );
}

export default SettingsView;
