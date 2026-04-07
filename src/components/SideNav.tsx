import { X, ArrowUpRight, Apple, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-transparent-logo.png";

type SideNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

const menuLinks = [
  { name: "Create a business account", path: "#" },
  { name: "Add your restaurant", path: "#" },
  { name: "Sign up to deliver", path: "#" },
  { name: "Get a ride", path: "#", external: true },
];

function SideNav({ isOpen, onClose }: SideNavProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[60] bg-stone-950/30 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside 
        className={`fixed left-0 top-0 z-[70] h-full w-full max-w-[300px] bg-white shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 py-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" onClick={onClose} className="flex items-center gap-0.5 group">
                <span className="text-[1.3rem] font-black tracking-[-0.04em] uppercase">Foodio</span>
                <span className="text-[1.3rem] font-black text-orange-600">.</span>
            </Link>
            <button 
              onClick={onClose}
              className="group flex h-9 w-9 items-center justify-center rounded-xl bg-stone-50 transition-all hover:bg-stone-100"
            >
              <X className="h-4 w-4 text-stone-400 group-hover:text-stone-950 transition-colors" />
            </button>
          </div>

          {/* Action Buttons (Downsized) */}
          <div className="mb-8 flex flex-col gap-2.5">
             <Link 
                to="/register" 
                className="flex h-11 items-center justify-center rounded-2xl bg-stone-950 text-[0.75rem] font-black text-white uppercase tracking-[0.15em] shadow-lg shadow-stone-200 transition-transform active:scale-95"
                onClick={onClose}
             >
                Sign up
             </Link>
             <Link 
                to="/login" 
                className="flex h-11 items-center justify-center rounded-2xl bg-stone-50 text-[0.75rem] font-black text-stone-950 uppercase tracking-[0.15em] transition-all hover:bg-stone-100 active:scale-95"
                onClick={onClose}
             >
                Log in
             </Link>
          </div>

          {/* Primary Navigation links (Downsized) */}
          <nav className="mb-auto flex flex-col">
            {menuLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path}
                className="group flex items-center justify-between py-3.5 text-[0.8rem] font-black uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-950 border-b border-stone-50"
              >
                {link.name}
                {link.external && <ArrowUpRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" />}
              </a>
            ))}
          </nav>

          {/* Footer Promo Section (Downsized) */}
          <div className="mt-8 rounded-[24px] bg-[#f7f8fa] p-4 border border-stone-100 relative overflow-hidden group/promo">
             <div className="absolute top-[-20px] right-[-20px] h-20 w-20 bg-orange-500/5 rounded-full blur-2xl group-hover/promo:scale-150 transition-transform duration-1000" />
             
             <div className="flex items-center gap-3.5 mb-4 relative z-10">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-stone-950 flex items-center justify-center p-1.5 shadow-xl">
                   <img src={logo} alt="app" className="w-full h-full object-contain brightness-0 invert" />
                </div>
                <div>
                   <p className="text-[0.75rem] font-black text-stone-950 leading-tight uppercase tracking-tight">Foodio App</p>
                   <p className="text-[0.6rem] text-stone-400 font-bold mt-0.5 uppercase tracking-wide">Instant delivery 24/7</p>
                </div>
             </div>
             
             <div className="flex gap-2 relative z-10">
                <button className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-white rounded-xl border border-stone-100 text-[0.6rem] font-black uppercase tracking-widest text-stone-600 shadow-sm hover:translate-y-[-1px] transition-all">
                   <Apple className="h-3 w-3" />
                   iOS
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-white rounded-xl border border-stone-100 text-[0.6rem] font-black uppercase tracking-widest text-stone-600 shadow-sm hover:translate-y-[-1px] transition-all">
                   <PlayCircle className="h-3 w-3" />
                   Android
                </button>
             </div>
          </div>

          <p className="mt-6 text-center text-[0.55rem] font-black text-stone-300 uppercase tracking-[0.2em] italic pr-2">
            © 2026 Foodio International
          </p>
        </div>
      </aside>
    </>
  );
}

export default SideNav;
