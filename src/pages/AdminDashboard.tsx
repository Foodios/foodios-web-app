import AdminSidebar from "../components/admin/Sidebar";
import AdminTopBar from "../components/admin/TopBar";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user, isLoading } = useAuth();
  
  // Debug roles to see why it redirects
  console.log("Current User Roles:", user?.roles);

  // While auth is still initializing, show a loader
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#fafafb]">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-orange-600 rounded-full animate-spin mb-4" />
        <p className="text-stone-500 font-bold animate-pulse text-sm uppercase tracking-widest">Verifying Admin Access...</p>
      </div>
    );
  }

  // Redirect to login if no user is found after loading
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check for ADMIN, ROLE_ADMIN, MANAGER, or ROLE_MANAGER
  const isAdmin = user.roles?.some(role => {
    const r = role.toUpperCase();
    return r.includes('ADMIN') || r.includes('MANAGER');
  });

  if (!isAdmin) {
    console.warn("User is not an admin, redirecting to profile. Roles found:", user.roles);
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="flex h-screen bg-[#fafafb] overflow-hidden text-stone-950">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
