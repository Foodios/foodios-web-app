import { 
  Search, 
  Sun, 
  History, 
  Bell, 
  Sidebar as SidebarIcon, 
  Star,
  ChevronRight
} from "lucide-react";

function AdminTopBar() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-stone-200">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-stone-50 transition-colors">
            <SidebarIcon className="w-4.5 h-4.5 text-stone-950" />
          </button>
          <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-stone-50 transition-colors">
            <Star className="w-4.5 h-4.5 text-stone-400" />
          </button>
        </div>

        <nav className="flex items-center gap-2 text-sm text-stone-500 font-medium">
          <span className="hover:text-stone-900 transition-colors">Dashboards</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <span className="text-stone-900">Default</span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative flex items-center bg-stone-100 rounded-lg px-3 h-9 min-w-[260px] max-w-[320px]">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input 
            className="w-full bg-transparent border-none outline-none px-2 text-sm text-stone-950 placeholder:text-stone-400" 
            type="text" 
            placeholder="Search" 
          />
          <span className="text-[0.6rem] font-bold text-stone-300 tracking-tighter bg-white px-1 py-0.5 rounded border border-stone-200">⌘/</span>
        </div>

        <div className="flex items-center gap-1">
          {[Sun, History, Bell, SidebarIcon].map((Icon, i) => (
            <button key={i} className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-stone-50 transition-colors">
              <Icon className="w-4.5 h-4.5 text-stone-600" />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default AdminTopBar;
