import MerchantSidebar from "../components/merchant/Sidebar";
import AdminTopBar from "../components/admin/TopBar";
import { Outlet } from "react-router-dom";

function MerchantDashboard() {
  return (
    <div className="flex h-screen bg-[#fafafc] overflow-hidden text-stone-950">
      <MerchantSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />
        
        <main className="flex-1 overflow-y-auto px-10 py-10">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MerchantDashboard;
