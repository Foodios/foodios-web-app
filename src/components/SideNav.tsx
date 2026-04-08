import { X, FileText, Wallet, LifeBuoy, Tag, Gift, LogOut, Apple, Smartphone, UserCircle, ShieldCheck, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-transparent-logo.png";
import { useAuth } from "../context/AuthContext";

type SideNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

const businessLinks = [
  { name: "Register for your Merchant", path: "/merchant/register" },
  { name: "Sign up to deliver", path: "#" },
];

const userNavLinks = [
  { name: "Orders", icon: FileText, path: "/profile?view=orders" },
  { name: "Wallet", icon: Wallet, path: "/profile?view=wallet" },
  { name: "Help", icon: LifeBuoy, path: "/profile?view=help" },
  { name: "Promotions", icon: Tag, path: "/profile?view=promotions" },
  { name: "Invite friends", icon: Gift, path: "/profile?view=invite" },
];

function SideNav({ isOpen, onClose }: SideNavProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  const isAdmin = user?.roles?.some(role => {
    const r = role.toUpperCase();
    return r.includes('ADMIN') || r.includes('MANAGER');
  });
  
  const isMerchant = user?.roles?.some(role => {
    const r = role.toUpperCase();
    return r.includes('MERCHANT');
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-stone-950/30 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer Panel - Compact */}
      <aside
        className={`fixed left-0 top-0 z-[70] h-full w-full max-w-[260px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col overflow-y-auto pt-6 pb-8">

          {/* Close Button */}
          <div className="px-5 mb-3 flex justify-end">
            <button
              onClick={onClose}
              className="group flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-stone-50"
            >
              <X className="h-4 w-4 text-stone-900" />
            </button>
          </div>

          {!user ? (
            /* Guest / Not Logged In View */
            <div className="px-5 flex flex-col gap-6">
               <div className="flex flex-col gap-2.5">
                  <Link
                    to="/register"
                    className="flex h-10 items-center justify-center rounded-lg bg-stone-950 text-[0.8rem] font-bold text-white transition-transform active:scale-95"
                    onClick={onClose}
                  >
                    Sign up
                  </Link>
                  <Link
                    to="/login"
                    className="flex h-10 items-center justify-center rounded-lg bg-stone-100 text-[0.8rem] font-bold text-stone-950 transition-all hover:bg-stone-200 active:scale-95"
                    onClick={onClose}
                  >
                    Log in
                  </Link>
               </div>
               <nav className="flex flex-col gap-0.5">
                  {businessLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.path}
                      className="py-2.5 text-[0.85rem] font-medium text-stone-950 hover:bg-stone-50 px-2 rounded-lg transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
               </nav>
            </div>
          ) : (
            /* Logged In View */
            <div className="flex flex-col px-5">

              {/* User Profile Info - Compact */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle className="h-7 w-7 text-stone-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[0.95rem] font-black text-stone-950 leading-tight truncate">{user.fullName || user.name}</h3>
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="text-[0.7rem] font-bold text-green-700 hover:underline block uppercase tracking-wider mt-0.5"
                  >
                    Account settings
                  </Link>
                </div>
              </div>

              {/* Special Role-based Portal Links */}
              {(isAdmin || isMerchant) && (
                <div className="mb-5 p-1.5 bg-stone-50 rounded-xl space-y-0.5">
                  <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest px-2 mb-1.5">Portals</p>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={onClose}
                      className="flex items-center gap-3.5 py-2.5 px-2 rounded-lg transition-colors hover:bg-stone-100 group"
                    >
                      <ShieldCheck className="h-4 w-4 text-orange-600" />
                      <span className="text-[0.8rem] font-bold text-stone-900">Admin Portal</span>
                    </Link>
                  )}
                  {isMerchant && (
                    <Link
                      to="/merchant"
                      onClick={onClose}
                      className="flex items-center gap-3.5 py-2.5 px-2 rounded-lg transition-colors hover:bg-stone-100 group"
                    >
                      <Store className="h-4 w-4 text-blue-600" />
                      <span className="text-[0.8rem] font-bold text-stone-900">Merchant Hub</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Main Navigation */}
              <nav className="flex flex-col gap-0.5 mb-5">
                {userNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={onClose}
                    className="flex items-center gap-3.5 py-2.5 px-2 rounded-lg transition-colors hover:bg-stone-50 group"
                  >
                    <link.icon className="h-4 w-4 text-stone-950" />
                    <span className="text-[0.85rem] font-medium text-stone-900 flex-1">{link.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3.5 py-2.5 px-2 rounded-lg transition-colors hover:bg-stone-50 text-stone-600 mb-6"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-[0.85rem] font-medium">Sign out</span>
              </button>

              <hr className="border-stone-100 mb-6" />

              {/* Middle Business Links */}
              <nav className="flex flex-col gap-0.5 mb-8">
                {businessLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="py-2.5 px-2 rounded-lg text-[0.85rem] font-medium text-stone-900 transition-colors hover:bg-stone-50"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Bottom Promo Section (Common) - Refined */}
          <div className="px-5 mt-auto">
            <div className="flex items-center gap-3 mb-5 p-3 bg-stone-50 rounded-xl border border-stone-100 shadow-sm">
               <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-stone-950 flex items-center justify-center p-2 border border-stone-800">
                  <img src={logo} alt="app" className="w-full h-full object-contain brightness-0 invert" />
               </div>
               <div>
                  <p className="text-[0.7rem] font-black text-stone-950 leading-tight uppercase tracking-tight">Foodio App</p>
                  <p className="text-[0.6rem] font-bold text-stone-400 mt-0.5">Explore more on mobile.</p>
               </div>
            </div>

            <div className="flex gap-2">
               <button className="flex-1 flex items-center justify-center gap-2 h-9 bg-stone-100 rounded-full text-[0.7rem] font-black text-stone-950 transition-all hover:bg-stone-200 uppercase tracking-widest">
                  <Apple className="h-3 w-3" />
                  iOS
               </button>
               <button className="flex-1 flex items-center justify-center gap-2 h-9 bg-stone-100 rounded-full text-[0.7rem] font-black text-stone-950 transition-all hover:bg-stone-200 uppercase tracking-widest">
                  <Smartphone className="h-3 w-3" />
                  Andr.
               </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
export default SideNav;
