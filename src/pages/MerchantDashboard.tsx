import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { generateApiMetadata } from "../utils/apiMetadata";
import MerchantSidebar from "../components/merchant/Sidebar";
import AdminTopBar from "../components/admin/TopBar";

function MerchantDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [merchant, setMerchant] = useState<any>(null);
  const [isMerchantLoading, setIsMerchantLoading] = useState(true);

  const fetchMerchantProfile = useCallback(async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    const metadata = generateApiMetadata("ONL");
    
    try {
      const response = await fetch("http://localhost:8080/api/v1/merchants/profile-me", {
        headers: {
          "authorization": `Bearer ${accessToken}`,
          "accept": "*/*",
          "rt-request-id": metadata.requestId,
          "rt-request_date_time": metadata.requestDateTime,
          "rt-channel": metadata.channel
        }
      });

      if (response.status === 401) {
        import("../utils/auth").then(m => m.forceLogout());
        return;
      }

      if (response.ok) {
        const result = await response.json();
        setMerchant(result.data);
      }
    } catch (error) {
      console.error("Fetch merchant profile error:", error);
    } finally {
      setIsMerchantLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.roles?.some(role => role.toUpperCase().includes('MERCHANT'))) {
      fetchMerchantProfile();
    } else if (!isAuthLoading) {
      setIsMerchantLoading(false);
    }
  }, [user, isAuthLoading, fetchMerchantProfile]);

  // If still loading auth state, show a loader
  if (isAuthLoading || isMerchantLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#fafafb]">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-stone-500 font-bold animate-pulse text-sm uppercase tracking-widest">Verifying Merchant Access...</p>
      </div>
    );
  }

  // Redirect to login if no user is found
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check for MERCHANT role (flexible check to account for ROLE_ prefix)
  const isMerchant = user.roles?.some(role => role.toUpperCase().includes('MERCHANT'));

  if (!isMerchant) {
    // If not a merchant, redirect to profile or show unauthorized
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="flex h-screen bg-[#fafafc] overflow-hidden text-stone-950">
      <MerchantSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />
        
        <main className="flex-1 overflow-y-auto px-10 py-10">
          <div className="max-w-[1440px] mx-auto">
            <Outlet context={{ merchant }} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MerchantDashboard;
