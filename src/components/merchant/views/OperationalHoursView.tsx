import { Clock, Save, AlertCircle, Info, ChevronRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const initialDays = [
  { day: "Monday", open: "09:00", close: "21:00", active: true },
  { day: "Tuesday", open: "09:00", close: "21:00", active: true },
  { day: "Wednesday", open: "09:00", close: "21:00", active: true },
  { day: "Thursday", open: "09:00", close: "21:00", active: true },
  { day: "Friday", open: "09:00", close: "22:00", active: true },
  { day: "Saturday", open: "10:00", close: "22:30", active: true },
  { day: "Sunday", open: "10:00", close: "21:30", active: true },
];

function OperationalHoursView() {
  const [days, setDays] = useState(initialDays);

  const toggleDay = (index: number) => {
    const newDays = [...days];
    newDays[index].active = !newDays[index].active;
    setDays(newDays);
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-stone-950 tracking-tight">Operational Hours</h1>
          <p className="text-sm font-medium text-stone-500 mt-1">Configure when your store is open for orders.</p>
        </div>
        <button className="h-14 px-8 bg-stone-950 text-white rounded-[22px] text-sm font-bold flex items-center gap-3 shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all active:scale-95">
           <Save className="w-5 h-5" />
           Save Changes
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Schedule */}
         <div className="lg:col-span-2 bg-white rounded-[40px] border border-stone-100 p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
               <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
               </div>
               <h2 className="text-lg font-black text-stone-950">Weekly Schedule</h2>
            </div>

            <div className="flex flex-col gap-4">
               {days.map((d, i) => (
                 <div key={d.day} className={`flex items-center justify-between p-6 rounded-[28px] border transition-all ${d.active ? 'border-stone-100 bg-white' : 'border-stone-50 bg-stone-50/50 opacity-60'}`}>
                    <div className="flex items-center gap-6">
                       <button 
                         onClick={() => toggleDay(i)}
                         className={`h-6 w-12 rounded-full relative transition-colors ${d.active ? 'bg-orange-600' : 'bg-stone-300'}`}
                       >
                          <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${d.active ? 'left-7' : 'left-1'}`} />
                       </button>
                       <div>
                          <span className="block text-[0.85rem] font-black text-stone-950">{d.day}</span>
                          <span className={`text-[0.65rem] font-bold uppercase tracking-widest ${d.active ? 'text-green-600' : 'text-stone-400'}`}>
                             {d.active ? 'Accepting Orders' : 'Store Closed'}
                          </span>
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-stone-400 uppercase tracking-widest">Open</span>
                          <input 
                            type="time" 
                            value={d.open} 
                            disabled={!d.active}
                            className="h-12 px-4 rounded-xl bg-stone-50 border border-transparent focus:border-stone-200 outline-none text-sm font-bold text-stone-950 disabled:opacity-50" 
                          />
                       </div>
                       <ChevronRight className="w-4 h-4 text-stone-200" />
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-stone-400 uppercase tracking-widest">Close</span>
                          <input 
                            type="time" 
                            value={d.close} 
                            disabled={!d.active}
                            className="h-12 px-4 rounded-xl bg-stone-50 border border-transparent focus:border-stone-200 outline-none text-sm font-bold text-stone-950 disabled:opacity-50" 
                          />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Sidebar info */}
         <div className="flex flex-col gap-6">
            <div className="bg-orange-50 rounded-[40px] p-8 border border-orange-100/50">
               <div className="flex items-center gap-3 mb-4">
                  <Info className="w-5 h-5 text-orange-600" />
                  <h3 className="text-base font-black text-stone-950">Store Status</h3>
               </div>
               <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-orange-100 mb-6">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  <span className="text-sm font-black text-stone-950 uppercase tracking-tight">Open for Orders</span>
               </div>
               <p className="text-sm text-stone-600 font-medium leading-relaxed">Customers will be able to place orders during these hours. Outside these hours, your store will be marked as "Closed" on the public page.</p>
            </div>

            <div className="bg-stone-950 rounded-[40px] p-8 text-white">
               <AlertCircle className="w-8 h-8 text-orange-400 mb-4" />
               <h3 className="text-base font-black">Special Closures?</h3>
               <p className="text-sm text-stone-400 font-medium mt-2 leading-relaxed">Going on a holiday or need a temporary break? You can set custom closure dates here.</p>
               <button className="mt-6 h-12 w-full bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                  Add Special Closure
                  <ChevronRight className="w-4 h-4" />
               </button>
            </div>

            <div className="bg-white rounded-[40px] border border-stone-100 p-8 shadow-sm">
               <h3 className="text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-4">Quick Tip</h3>
               <div className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <p className="text-xs font-medium text-stone-600 leading-relaxed">Updating your hours regularly helps maintain a good customer experience and higher search ranking.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default OperationalHoursView;
