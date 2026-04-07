import AdminSidebar from "../components/admin/Sidebar";
import AdminTopBar from "../components/admin/TopBar";
import AdminRightPanel from "../components/admin/RightPanel";
import { Outlet } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="flex h-screen bg-[#fafafb] overflow-hidden text-stone-950">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <AdminRightPanel />
    </div>
  );
}

export default AdminDashboard;
