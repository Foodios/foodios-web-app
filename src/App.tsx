import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import RestaurantDetail from "./pages/restaurant/RestaurantDetail";
import MerchantRegistration from "./pages/MerchantRegistration";
import ScrollToTop from "./components/ScrollToTop";

// Admin Views
import DashboardHome from "./components/admin/views/DashboardHome";
import MerchantsView from "./components/admin/views/MerchantsView";
import OrdersView from "./components/admin/views/OrdersView";
import DriversView from "./components/admin/views/DriversView";

// Merchant Views
import MerchantOverview from "./components/merchant/views/MerchantOverview";
import MenuManagement from "./components/merchant/views/MenuManagement";
import PromotionsView from "./components/merchant/views/PromotionsView";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/restaurant/:shortName" element={<RestaurantDetail />} />
          <Route path="/merchant/register" element={<MerchantRegistration />} />

          {/* Admin Portal (Global Management) */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="merchants" element={<MerchantsView />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="drivers" element={<DriversView />} />
            <Route path="catalog" element={<div className="p-8 text-center text-stone-400 font-bold bg-white rounded-3xl border border-stone-100">Catalog Management View (Developing...)</div>} />
            <Route path="promotions" element={<div className="p-8 text-center text-stone-400 font-bold bg-white rounded-3xl border border-stone-100">Promotions Management View (Developing...)</div>} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Merchant Portal (Shop Management) */}
          <Route path="/merchant" element={<MerchantDashboard />}>
            <Route index element={<MerchantOverview />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="products" element={<MenuManagement />} />
            <Route path="orders" element={<div className="p-10 text-center text-stone-400 font-bold bg-white rounded-[40px] border border-stone-100">Shop Order Management (Developing...)</div>} />
            <Route path="promotions" element={<PromotionsView />} />
            <Route path="*" element={<Navigate to="/merchant" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
