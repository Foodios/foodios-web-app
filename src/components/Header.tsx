import { Link } from "react-router-dom";
import logo from "../assets/logo-transparent-logo.png";
import { Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type HeaderProps = {
  isHeroActive: boolean;
  onMenuClick?: () => void;
};

function Header({ isHeroActive, onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  
  const shellClass = isHeroActive
    ? "bg-transparent text-white"
    : "bg-white/92 text-stone-950 shadow-[0_10px_30px_rgba(0,0,0,0.08)]";
  
  const iconColor = isHeroActive ? "text-stone-900" : "text-stone-950";
  
  const ghostButtonClass = isHeroActive
    ? "border-white/20 bg-white/75 text-stone-900"
    : "border-black/10 bg-white text-stone-900";

  return (
    <header className={`fixed left-0 right-0 top-0 z-30 transition-colors duration-300 backdrop-blur-md ${shellClass}`}>
      <div className="flex w-full items-center justify-between gap-5 px-3 py-4 sm:px-4 lg:px-5 max-[820px]:items-start">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={onMenuClick}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-stone-950/5 transition-all active:scale-90 group"
            type="button"
            aria-label="Open navigation"
          >
            <Menu className={`w-6 h-6 ${iconColor} group-hover:scale-110 transition-transform`} />
          </button>
          <Link className="flex min-w-0 items-center gap-3 ml-1" to="/" aria-label="Foodio home">
            <img className="h-auto w-[118px] object-contain max-[560px]:w-[92px]" src={logo} alt="" />
            <span className="sr-only">Foodio</span>
          </Link>
        </div>

        <nav className="flex items-center gap-3 max-[820px]:flex-wrap max-[820px]:justify-end" aria-label="Primary">
          {!user && (
            <>
              <Link className={`inline-flex min-w-[84px] items-center justify-center rounded-full px-5 py-[11px] text-sm font-bold shadow-sm transition-transform duration-200 hover:-translate-y-0.5 ${ghostButtonClass}`} to="/login">
                Log in
              </Link>
              <Link className="inline-flex min-w-[84px] items-center justify-center rounded-full bg-stone-950 px-5 py-[11px] text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5" to="/register">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
export default Header;
