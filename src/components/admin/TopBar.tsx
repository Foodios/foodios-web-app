import React from 'react';
import { 
  Search, 
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";

function AdminTopBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Generate breadcrumbs from path
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-stone-200">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-all text-stone-400 hover:text-stone-950 active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigate(1)}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-all text-stone-400 hover:text-stone-950 active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex items-center gap-2 text-sm text-stone-500 font-medium">
          <Link to="/admin" className="hover:text-stone-900 transition-colors capitalize">
            Admin
          </Link>
          {pathnames.slice(1).map((value, index) => {
            const last = index === pathnames.length - 2;
            const to = `/${pathnames.slice(0, index + 2).join('/')}`;

            return (
              <React.Fragment key={to}>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                {last ? (
                  <span className="text-stone-900 capitalize">{value.replace('-', ' ')}</span>
                ) : (
                  <Link to={to} className="hover:text-stone-900 transition-colors capitalize">
                    {value.replace('-', ' ')}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
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

      </div>
    </header>
  );
}

export default AdminTopBar;
