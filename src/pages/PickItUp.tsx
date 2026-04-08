import { Search, MapPin, Star, Clock, Filter, ChevronLeft, Loader2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import Footer from "../components/Footer";
import { useState, useEffect, useCallback } from "react";
import { publicService } from "../services/publicService";
import { userService } from "../services/userService";
import { useAuth } from "../context/AuthContext";

function PickItUp() {
  const { user } = useAuth();
  const [merchants, setMerchants] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSideNav = () => setIsSideNavOpen(!isSideNavOpen);
  const closeSideNav = () => setIsSideNavOpen(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [merchantsRes, savedRes] = await Promise.all([
        publicService.getMerchants(),
        user ? userService.getSavedRestaurants().catch(() => ({ data: { items: [] } })) : Promise.resolve({ data: { items: [] } })
      ]);

      const merchantsList = merchantsRes.data?.merchants || merchantsRes.merchants || [];
      setMerchants(Array.isArray(merchantsList) ? merchantsList : []);

      // Fix: Handle data.items for saved restaurants
      const savedData = savedRes.data || {};
      const savedList = Array.isArray(savedData) ? savedData : (savedData.items || []);
      setSavedIds(new Set(savedList.map((m: any) => m.merchantId || m.id)));
    } catch (err) {
      console.error("Fetch data error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredMerchants = merchants.filter(m => {
    const matchesSearch = m.merchantName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.cuisineCategory?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSaved = showSavedOnly ? savedIds.has(m.merchantId) : true;
    return matchesSearch && matchesSaved;
  });

  const toggleFavorite = async (e: React.MouseEvent, merchantId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert("Please login to save restaurants!");
      return;
    }

    const isFavorite = savedIds.has(merchantId);
    try {
      await userService.toggleFavorite(merchantId);
      
      setSavedIds(prev => {
        const next = new Set(prev);
        if (isFavorite) next.delete(merchantId);
        else next.add(merchantId);
        return next;
      });
    } catch (err) {
      console.error("Toggle favorite error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col">
      <Header isHeroActive={false} onMenuClick={toggleSideNav} />
      <SideNav isOpen={isSideNavOpen} onClose={closeSideNav} />
      
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 py-32">
        <header className="mb-12">
           <Link to="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-950 transition-colors font-bold text-sm mb-6 uppercase tracking-widest">
              <ChevronLeft className="w-4 h-4" />
              Back to Home
           </Link>
           <h1 className="text-4xl md:text-5xl font-black text-stone-950 tracking-tight">Pick it up near you</h1>
           <p className="text-lg text-stone-500 font-medium mt-3">Discover the best restaurants in your neighborhood.</p>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-stone-950 transition-colors" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for restaurants, cuisines or dishes..." 
                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white border border-stone-100 shadow-sm outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-medium"
                />
            </div>
            <button 
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`h-14 px-8 border rounded-2xl flex items-center gap-3 font-bold transition-all shadow-sm ${
                    showSavedOnly ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-stone-100 text-stone-600 hover:bg-stone-50"
                }`}
            >
                <Heart className={`w-5 h-5 ${showSavedOnly ? "fill-current" : ""}`} />
                {showSavedOnly ? "Showing Saved" : "Saved Places"}
            </button>
            <button className="h-14 px-8 bg-white border border-stone-100 rounded-2xl flex items-center gap-3 font-bold text-stone-600 hover:bg-stone-50 transition-all shadow-sm">
                <Filter className="w-5 h-5" />
                Filter
            </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-stone-200 animate-spin mb-4" />
            <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">Finding available merchants...</p>
          </div>
        ) : (
          /* Restaurant Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredMerchants.length > 0 ? filteredMerchants.map((restaurant) => (
               <Link 
                 key={restaurant.merchantId} 
                 to={`/restaurant/${restaurant.merchantSlug}`}
                 className="group flex flex-col bg-white rounded-[40px] border border-stone-100 overflow-hidden hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500"
               >
                  <div className="h-64 w-full relative overflow-hidden">
                     <img 
                       src={restaurant.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"} 
                       alt={restaurant.merchantName} 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                     
                     {/* Favorite Button */}
                     <button
                        onClick={(e) => toggleFavorite(e, restaurant.merchantId)}
                        className={`absolute top-5 left-5 h-10 w-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 z-10 shadow-sm border ${
                            savedIds.has(restaurant.merchantId) 
                            ? "bg-orange-500 text-white border-orange-400" 
                            : "bg-white/90 text-stone-400 border-white hover:text-orange-500"
                        }`}
                     >
                        <Heart className={`w-5 h-5 ${savedIds.has(restaurant.merchantId) ? "fill-current" : ""}`} />
                     </button>

                     <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                        <span className="text-sm font-black text-stone-900">{restaurant.overallReview?.averageRating || "4.5"}</span>
                        <span className="text-[0.65rem] font-bold text-stone-400">({restaurant.overallReview?.totalReviews || "0"})</span>
                     </div>
                     <div className="absolute bottom-5 left-5 px-3 py-1.5 bg-stone-950/80 backdrop-blur-md rounded-xl">
                        <span className="text-xs font-black text-white uppercase tracking-widest">{restaurant.activeStoreCount} STORES OPEN</span>
                     </div>
                  </div>
                  
                  <div className="p-8">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black text-stone-950 tracking-tight group-hover:text-orange-600 transition-colors uppercase">{restaurant.merchantName}</h3>
                     </div>
                     <p className="text-sm font-bold text-stone-400 mb-6">{restaurant.cuisineCategory || "Premium Cuisines"}</p>
                     
                     <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                        <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-orange-500" />
                           <span className="text-sm font-black text-stone-600">{restaurant.distance || "Near you"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-stone-400 font-bold group-hover:text-stone-950 transition-colors">
                           <span className="text-xs uppercase tracking-widest">View Menu</span>
                           <Clock className="w-4 h-4" />
                        </div>
                     </div>
                  </div>
               </Link>
             )) : (
              <div className="col-span-full py-40 text-center">
                <p className="text-stone-400 font-bold italic">No merchants available at the moment.</p>
              </div>
             )}
          </div>
        )}
      </main>

      <Footer active={false} />
    </div>
  );
}

export default PickItUp;
