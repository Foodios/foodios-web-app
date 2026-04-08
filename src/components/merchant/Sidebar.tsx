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
  LogOut,
  Store,
  Bike
} from "lucide-react";
import tabIcon from "../../assets/tab-icon.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const merchantMenuItems = [
  { group: "Operations", items: [
    { name: "Live Dashboard", icon: LayoutDashboard, path: "/merchant" },
    { name: "Order Queue", icon: ShoppingBag, path: "/merchant/orders" },
    { name: "Order History", icon: History, path: "/merchant/history" },
    { name: "Fleet Drivers", icon: Bike, path: "/merchant/drivers" }
  ]},
  { 
    group: "Inventory", 
    items: [
      { name: "Stores", icon: Store, path: "/merchant/stores" },
      { name: "Categories", icon: Utensils, path: "/merchant/categories" },
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 h-screen border-r border-stone-100 bg-[#f8f9fb] flex flex-col p-4 shrink-0 overflow-y-auto">
      {/* Merchant Branding - Refined */}
      <Link to="/" className="flex items-center gap-3 px-1 mb-7 hover:opacity-80 transition-opacity cursor-pointer">
        <div className="h-8 w-8 rounded-[10px] bg-orange-600 flex items-center justify-center p-1 shadow-md shadow-orange-100">
          <img src={tabIcon} alt="logo" className="w-full h-full object-contain brightness-0 invert" />
        </div>
        <div>
          <span className="block font-black text-stone-900 tracking-[-0.05em] text-base leading-none">Merchant Hub</span>
          <span className="block text-[0.45rem] font-black text-orange-600 uppercase tracking-widest mt-0.5">Partner Portal</span>
        </div>
      </Link>

      <nav className="flex-1 flex flex-col gap-6">
        {merchantMenuItems.map((group) => (
          <div key={group.group}>
            <h3 className="px-2.5 mb-2.5 text-[0.55rem] font-black text-stone-300 uppercase tracking-[0.2em]">
              {group.group}
            </h3>
            <ul className="flex flex-col gap-1">
              {group.items.map((item: any) => {
                const Icon = item.icon || Circle;
                const active = location.pathname === item.path;

                return (
                  <li key={item.name}>
                    <Link 
                      to={item.path || "#"}
                      className={`w-full group flex items-center gap-3 px-3 py-2 rounded-xl text-[0.7rem] font-bold transition-all ${active ? "bg-stone-950 text-white shadow-lg shadow-stone-200" : "text-stone-500 hover:bg-white hover:text-stone-950 hover:shadow-sm"}`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? "text-white" : "text-stone-400 group-hover:text-stone-950"} transition-colors`} />
                      <span className="flex-1 text-left line-clamp-1">{item.name}</span>
                      {active ? (
                        <div className="h-1 w-1 rounded-full bg-orange-500" />
                      ) : (
                         <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Account Switcher - Compact */}
      <div className="mt-auto pt-4 border-t border-stone-200/50">
         <button 
           onClick={handleLogout}
           className="w-full group flex items-center gap-3 p-2 rounded-xl hover:bg-red-50 transition-colors"
         >
            <div className="h-8 w-8 rounded-lg bg-stone-200 border-2 border-white overflow-hidden shrink-0">
               {user?.avatar ? (
                 <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-600 font-black text-[0.55rem] uppercase">
                    {user?.name?.substring(0, 2) || "AD"}
                 </div>
               )}
            </div>
            <div className="flex-1 text-left min-w-0">
               <p className="text-[0.7rem] font-black text-stone-950 line-clamp-1 truncate">{user?.name || "Merchant Admin"}</p>
               <p className="text-[0.55rem] font-bold text-stone-400 uppercase tracking-widest line-clamp-1">
                  {(user?.roles?.find(r => r.toUpperCase().includes('MERCHANT')) || user?.roles?.[0])?.toLowerCase().replace('role_', '').replace('_', ' ') || "Merchant"}
               </p>
            </div>
            <LogOut className="w-3.5 h-3.5 text-stone-300 group-hover:text-red-500 transition-colors shrink-0" />
         </button>
      </div>
    </aside>
  );
}

export default MerchantSidebar;
