import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import RestaurantDetail from "./pages/restaurant/RestaurantDetail";
import PickItUp from "./pages/PickItUp";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import FeedEmployee from "./pages/blogs/FeedEmployee";
import RestaurantDelivery from "./pages/blogs/RestaurantDelivery";
import DeliverPartner from "./pages/blogs/DeliverPartner";
import MerchantRegistration from "./pages/MerchantRegistration";
import ScrollToTop from "./components/ScrollToTop";

// Admin Views
import DashboardHome from "./components/admin/views/DashboardHome";
import MerchantsView from "./components/admin/views/MerchantsView";
import MerchantDetail from "./components/admin/views/MerchantDetail";
import OrdersView from "./components/admin/views/OrdersView";
import UsersView from "./components/admin/views/UsersView";
import PromotionsView from "./components/admin/views/PromotionsView";

// Merchant Views
import MerchantOverview from "./components/merchant/views/MerchantOverview";
import CategoryManagement from "./components/merchant/views/CategoryManagement";
import CategoryDetail from "./components/merchant/views/CategoryDetail";
import ProductCatalog from "./components/merchant/views/ProductCatalog";
import ReviewsView from "./components/merchant/views/ReviewsView";
import SettingsView from "./components/merchant/views/SettingsView";
import OperationalHoursView from "./components/merchant/views/OperationalHoursView";
import OrderQueue from "./components/merchant/views/OrderQueue";
import OrderHistory from "./components/merchant/views/OrderHistory";
import PromotionsManagement from "./components/merchant/views/PromotionsManagement";
import PromotionDetail from "./components/merchant/views/PromotionDetail";
import StoresManagement from "./components/merchant/views/StoresManagement";
import StoreDetail from "./components/merchant/views/StoreDetail";
import StoreEdit from "./components/merchant/views/StoreEdit";
import DriversManagement from "./components/merchant/views/DriversManagement";

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
          <Route path="/pick-it-up" element={<PickItUp />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/tracking/:orderId" element={<OrderTracking />} />
          <Route path="/merchant/register" element={<MerchantRegistration />} />

          {/* Blog Pages */}
          <Route path="/blog/feed-your-employee" element={<FeedEmployee />} />
          <Route path="/blog/your-restaurant-delivered" element={<RestaurantDelivery />} />
          <Route path="/blog/deliver-with-foodio" element={<DeliverPartner />} />

          {/* Admin Portal (Global Management) */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="merchants" element={<MerchantsView />} />
            <Route path="merchants/:merchantId" element={<MerchantDetail />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="users/:role" element={<UsersView />} />
            <Route path="promotions" element={<PromotionsView />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Merchant Portal (Shop Management) */}
          <Route path="/merchant" element={<MerchantDashboard />}>
            <Route index element={<MerchantOverview />} />
            <Route path="stores" element={<StoresManagement />} />
            <Route path="stores/:storeId" element={<StoreDetail />} />
            <Route path="stores/:storeId/edit" element={<StoreEdit />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="categories/:categoryId" element={<CategoryDetail />} />
            <Route path="products" element={<ProductCatalog />} />
            <Route path="orders" element={<OrderQueue />} />
            <Route path="history" element={<OrderHistory />} />
            <Route path="promotions" element={<PromotionsManagement />} />
            <Route path="promotions/:promoId" element={<PromotionDetail />} />
            <Route path="reviews" element={<ReviewsView />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="hours" element={<OperationalHoursView />} />
            <Route path="drivers" element={<DriversManagement />} />
            <Route path="*" element={<Navigate to="/merchant" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
