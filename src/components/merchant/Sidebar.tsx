import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  Tag, 
  Settings, 
  Star, 
  ChevronRight, 
  Circle,
  History,
  Clock,
  LogOut
} from "lucide-react";
import tabIcon from "../../assets/tab-icon.png";
import { Link, useLocation } from "react-router-dom";

const merchantMenuItems = [
  { group: "Operations", items: [
    { name: "Live Dashboard", icon: LayoutDashboard, path: "/merchant" },
    { name: "Order Queue", icon: ShoppingBag, path: "/merchant/orders" },
    { name: "Order History", icon: History, path: "/merchant/history" }
  ]},
  { 
    group: "Inventory", 
    items: [
      { name: "Menu & Categories", icon: Utensils, path: "/merchant/menu" },
      { name: "Product Catalog", icon: Circle, path: "/merchant/products" },
      { name: "Global Promotions", icon: Tag, path: "/merchant/promotions" }
    ] 
  },
  {
    group: "Presence",
    items: [
      { name: "Customer Reviews", icon: Star, path: "/merchant/reviews" },
      { name: "Shop Settings", icon: Settings, path: "/merchant/settings" },
      { name: "Operational Hours", icon: Clock, path: "/merchant/hours" }
    ]
  }
];

function MerchantSidebar() {
  const location = useLocation();

  return (
    <aside className="w-68 h-screen border-r border-stone-100 bg-[#f8f9fb] flex flex-col p-5 shrink-0 overflow-y-auto">
      {/* Merchant Branding */}
      <Link to="/" className="flex items-center gap-4 px-2 mb-10 hover:opacity-80 transition-opacity cursor-pointer">
        <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center p-1.5 shadow-lg shadow-orange-100">
          <img src={tabIcon} alt="logo" className="w-full h-full object-contain brightness-0 invert" />
        </div>
        <div>
          <span className="block font-bold text-stone-900 tracking-[-0.05em] text-lg">Merchant Hub</span>
          <span className="block text-[0.6rem] font-bold text-orange-600 uppercase tracking-widest mt-0.5">Partner Portal</span>
        </div>
      </Link>

      <nav className="flex-1 flex flex-col gap-9">
        {merchantMenuItems.map((group) => (
          <div key={group.group}>
            <h3 className="px-3 mb-4 text-[0.65rem] font-black text-stone-300 uppercase tracking-[0.2em]">
              {group.group}
            </h3>
            <ul className="flex flex-col gap-1.5">
              {group.items.map((item: any) => {
                const Icon = item.icon || Circle;
                const active = location.pathname === item.path;

                return (
                  <li key={item.name}>
                    <Link 
                      to={item.path || "#"}
                      className={`w-full group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[0.85rem] font-bold transition-all ${active ? "bg-stone-950 text-white shadow-xl shadow-stone-200" : "text-stone-500 hover:bg-white hover:text-stone-950 hover:shadow-sm"}`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${active ? "text-white" : "text-stone-400 group-hover:text-stone-950"} transition-colors`} />
                      <span className="flex-1 text-left">{item.name}</span>
                      {active ? (
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      ) : (
                         <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Account Switcher / Sign out */}
      <div className="mt-auto pt-6 border-t border-stone-200/50">
         <button className="w-full group flex items-center gap-4 p-3 rounded-2xl hover:bg-red-50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-stone-200 border-2 border-white overflow-hidden">
               <img src="https://i.pravatar.cc/100?img=12" alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-left">
               <p className="text-[0.8rem] font-bold text-stone-800">Pizza 4P's Boss</p>
               <p className="text-[0.65rem] text-stone-400">Merchant Admin</p>
            </div>
            <LogOut className="w-4 h-4 text-stone-300 group-hover:text-red-500 transition-colors" />
         </button>
      </div>
    </aside>
  );
}

export default MerchantSidebar;
