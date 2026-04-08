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
  { name: "Orders", icon: FileText, path: "#" },
  { name: "Wallet", icon: Wallet, path: "#" },
  { name: "Help", icon: LifeBuoy, path: "#" },
  { name: "Promotions", icon: Tag, path: "#" },
  { name: "Invite friends", icon: Gift, path: "#" },
];

function SideNav({ isOpen, onClose }: SideNavProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  const isAdmin = user?.roles?.includes("SUPER_ADMIN");
  const isMerchant = user?.roles?.some(role =>
    role === "MERCHANT_OWNER" || role === "MERCHANT_MANAGER"
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-stone-950/30 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed left-0 top-0 z-[70] h-full w-full max-w-[320px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col overflow-y-auto pt-8 pb-10">

          {/* Close Button */}
          <div className="px-6 mb-4 flex justify-end">
            <button
              onClick={onClose}
              className="group flex h-9 w-9 items-center justify-center rounded-fill transition-all hover:bg-stone-50"
            >
              <X className="h-5 w-5 text-stone-900" />
            </button>
          </div>

          {!user ? (
            /* Guest / Not Logged In View */
            <div className="px-6 flex flex-col gap-8">
               <div className="flex flex-col gap-3">
                  <Link
                    to="/register"
                    className="flex h-12 items-center justify-center rounded-xl bg-stone-950 text-sm font-bold text-white transition-transform active:scale-95"
                    onClick={onClose}
                  >
                    Sign up
                  </Link>
                  <Link
                    to="/login"
                    className="flex h-12 items-center justify-center rounded-xl bg-stone-100 text-sm font-bold text-stone-950 transition-all hover:bg-stone-200 active:scale-95"
                    onClick={onClose}
                  >
                    Log in
                  </Link>
               </div>
               <nav className="flex flex-col gap-1">
                  {businessLinks.map((link) => {
                    // Only show "Sign up to deliver" if user is guest or a CUSTOMER
                    if (link.name === "Sign up to deliver") {
                      const isCustomer = user?.roles?.includes("CUSTOMER");
                      if (user && !isCustomer) return null;
                    }
                    
                    return (
                      <a
                        key={link.name}
                        href={link.path}
                        className="py-3 text-[1rem] font-medium text-stone-950 hover:bg-stone-50 px-2 rounded-lg transition-colors"
                      >
                        {link.name}
                      </a>
                    );
                  })}
               </nav>
            </div>
          ) : (
            /* Logged In View - Uber Eats Style */
            <div className="flex flex-col px-6">

              {/* User Profile Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle className="h-10 w-10 text-stone-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-950 leading-tight">{user.fullName || user.name}</h3>
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="text-[0.9rem] font-medium text-green-700 hover:underline block"
                  >
                    Manage account
                  </Link>
                </div>
              </div>

              {/* Special Role-based Portal Links */}
              {(isAdmin || isMerchant) && (
                <div className="mb-6 p-2 bg-stone-50 rounded-2xl space-y-1">
                  <p className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest px-2 mb-2">Management</p>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={onClose}
                      className="flex items-center gap-4 py-3 px-2 rounded-xl transition-colors hover:bg-stone-100 group"
                    >
                      <ShieldCheck className="h-5 w-5 text-orange-600" />
                      <span className="text-[1rem] font-bold text-stone-900">Admin Portal</span>
                    </Link>
                  )}
                  {isMerchant && (
                    <Link
                      to="/merchant"
                      onClick={onClose}
                      className="flex items-center gap-4 py-3 px-2 rounded-xl transition-colors hover:bg-stone-100 group"
                    >
                      <Store className="h-5 w-5 text-blue-600" />
                      <span className="text-[1rem] font-bold text-stone-900">Merchant Hub</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Main Navigation */}
              <nav className="flex flex-col gap-1 mb-6">
                {userNavLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="flex items-center gap-4 py-3 px-2 rounded-xl transition-colors hover:bg-stone-50 group"
                  >
                    <link.icon className="h-5 w-5 text-stone-950" />
                    <span className="text-[1rem] font-medium text-stone-900 flex-1">{link.name}</span>
                  </a>
                ))}
              </nav>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 py-3 px-2 rounded-xl transition-colors hover:bg-stone-50 text-stone-600 mb-8"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-[1rem] font-medium">Sign out</span>
              </button>

              <hr className="border-stone-100 mb-8" />

              {/* Middle Business Links */}
              <nav className="flex flex-col gap-1 mb-10">
                {businessLinks.map((link) => {
                  // Only show "Sign up to deliver" if user is guest or a CUSTOMER
                  if (link.name === "Sign up to deliver") {
                    const isCustomer = user?.roles?.includes("CUSTOMER");
                    if (user && !isCustomer) return null;
                  }
                  
                  return (
                    <a
                      key={link.name}
                      href={link.path}
                      className="py-3 px-2 rounded-xl text-[1rem] font-medium text-stone-900 transition-colors hover:bg-stone-50"
                    >
                      {link.name}
                    </a>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Bottom Promo Section (Common) */}
          <div className="px-6 mt-auto">
            <div className="flex items-start gap-4 mb-6">
               <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-stone-950 flex items-center justify-center p-3 shadow-sm border border-stone-800">
                  <img src={logo} alt="app" className="w-full h-full object-contain brightness-0 invert" />
               </div>
               <div>
                  <p className="text-[1.1rem] font-bold text-stone-950 leading-tight">There's more to love in the app.</p>
               </div>
            </div>

            <div className="flex gap-3">
               <button className="flex-1 flex items-center justify-center gap-2 h-11 bg-stone-100 rounded-full text-[0.9rem] font-bold text-stone-950 transition-all hover:bg-stone-200">
                  <Apple className="h-4 w-4" />
                  iPhone
               </button>
               <button className="flex-1 flex items-center justify-center gap-2 h-11 bg-stone-100 rounded-full text-[0.9rem] font-bold text-stone-950 transition-all hover:bg-stone-200">
                  <Smartphone className="h-4 w-4" />
                  Android
               </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
export default SideNav;
