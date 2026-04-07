import { 
  LayoutDashboard, 
  Activity,
  Store,
  ShoppingBag,
  Bike,
  Utensils,
  Percent,
  Users,
  Settings,
  UserCircle,
  Building2,
  BellRing,
  ChevronRight,
  Circle
} from "lucide-react";
import tabIcon from "../../assets/tab-icon.png";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { group: "Overview", items: [
    { name: "Global Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Real-time Monitor", icon: Activity, path: "/admin/monitor" }
  ]},
  { 
    group: "Management", 
    items: [
      { name: "Merchants", icon: Store, path: "/admin/merchants", subItems: ["Active Shops", "Applications", "Schedules", "Payments"] },
      { name: "Live Orders", icon: ShoppingBag, path: "/admin/orders", subItems: ["In Progress", "Scheduled", "Canceled"] },
      { name: "Driver Fleet", icon: Bike, path: "/admin/drivers", subItems: ["Active Riders", "KYC Verification", "Payouts"] },
      { name: "Catalog & Menus", icon: Utensils, path: "/admin/catalog", subItems: ["Categories", "Product List", "Add-ons"] },
      { name: "Promotions", icon: Percent, path: "/admin/promotions", subItems: ["Coupons", "Flash Sales", "Banner Ads"] }
    ] 
  },
  {
    group: "Clients & Users",
    items: [
      { name: "Customers", icon: Users },
      { name: "Corporate", icon: Building2 },
      { name: "Admin Staff", icon: UserCircle }
    ]
  },
  {
    group: "System",
    items: [
      { name: "Notifications", icon: BellRing },
      { name: "Global Settings", icon: Settings }
    ]
  }
];

function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen border-r border-stone-200 bg-white flex flex-col p-4 shrink-0 overflow-y-auto">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 px-2 mb-8 hover:opacity-80 transition-opacity cursor-pointer">
        <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center p-1 shadow-lg shadow-orange-200">
          <img src={tabIcon} alt="logo" className="w-full h-full object-contain brightness-0 invert" />
        </div>
        <span className="font-bold text-stone-900 tracking-[-0.05em] text-xl">Foodio</span>
      </Link>

      <nav className="flex flex-col gap-8">
        {menuItems.map((group) => (
          <div key={group.group}>
            <h3 className="px-3 mb-3 text-[0.65rem] font-black text-stone-400 uppercase tracking-[0.2em] opacity-80">
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
                      className={`w-full group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${active ? "bg-stone-950 text-white shadow-lg shadow-stone-200" : "text-stone-500 hover:bg-stone-50 hover:text-stone-950"}`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${active ? "text-white" : "text-stone-400 group-hover:text-stone-950"} transition-colors`} />
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.subItems && <ChevronRight className={`w-3.5 h-3.5 ${active ? "text-white/40" : "text-stone-300 group-hover:text-stone-400"}`} />}
                    </Link>
                    {active && item.subItems && (
                      <ul className="mt-2 ml-5 flex flex-col gap-1 border-l-2 border-stone-100 pl-4 py-1">
                        {item.subItems.map((sub: string) => (
                          <li key={sub}>
                            <button className="w-full py-2 text-left text-[0.8rem] text-stone-500 hover:text-stone-950 font-medium transition-colors relative before:content-[''] before:absolute before:left-[-18px] before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-stone-300 before:rounded-full hover:before:bg-orange-500 hover:before:scale-150 transition-all">
                              {sub}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
