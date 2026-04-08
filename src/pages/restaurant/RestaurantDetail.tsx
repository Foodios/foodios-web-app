import {
  Star,
  Clock,
  MapPin,
  Search,
  ChevronDown,
  Plus,
  Map as MapIcon,
  Menu,
  Info,
  Navigation,
  ShoppingBag,
  Loader2
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Footer from "../../components/Footer";
import SideNav from "../../components/SideNav";
import { useAuth } from "../../context/AuthContext";
import { publicService } from "../../services/publicService";
import { cartService } from "../../services/cartService";

const initialData = {
  name: "Loading...",
  logo: "🏪",
  coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
  coords: [106.660172, 10.762622] as [number, number],
  address: "Premium Foodios Partner",
  status: "OPEN",
  rating: 0.0,
  reviewsCount: 0,
  overallReview: {
    averageRating: 0.0,
    totalReviews: 0,
    fiveStarCount: 0,
    fourStarCount: 0,
    threeStarCount: 0,
    twoStarCount: 0,
    oneStarCount: 0
  },
  deliveryTime: "25-35",
  menu: [],
  stores: []
};

function StoreBranchCard({ store }: { store: any }) {
  const fullAddress = store.address 
    ? `${store.address.line1}${store.address.district ? `, Dist ${store.address.district}` : ''}, ${store.address.city || ''}`
    : "Address details not available";

  return (
    <div className="bg-white p-4 rounded-[22px] border border-stone-100 shadow-sm hover:shadow-md transition-all duration-500 group border-l-4 border-l-transparent hover:border-l-orange-500">
       <div className="flex justify-between items-start mb-2.5">
          <div className="h-7 w-7 bg-stone-50 rounded-lg flex items-center justify-center group-hover:bg-orange-50 transition-colors">
             <MapPin className="w-3.5 h-3.5 text-stone-400 group-hover:text-orange-600 transition-colors" />
          </div>
          <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[0.5rem] font-black rounded-full uppercase tracking-widest">
             {store.opensAt?.substring(0, 5)} - {store.closesAt?.substring(0, 5)}
          </span>
       </div>
       <h4 className="text-[0.8rem] font-black text-stone-950 mb-0.5 tracking-tight group-hover:text-orange-600 transition-colors">{store.name}</h4>
       <p className="text-[0.65rem] font-medium text-stone-400 leading-relaxed mb-3 line-clamp-2">{fullAddress}</p>
       <div className="flex items-center justify-between pt-2.5 border-t border-stone-50">
          <span className="text-[0.55rem] font-black text-stone-300 uppercase tracking-widest flex items-center gap-1">
             <Navigation className="w-2.5 h-2.5" />
             {store.phone}
          </span>
          <button className="h-7 px-3 bg-stone-950 text-white rounded-lg text-[0.55rem] font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95">Direction</button>
       </div>
    </div>
  );
}

function ProductCard({ item, onAdd }: { item: any, onAdd: (item: any) => void }) {
  return (
    <div className={`group cursor-pointer flex flex-col font-sans scale-[0.98] hover:scale-100 transition-transform`}>
      <div className="relative h-36 w-full bg-stone-50 rounded-[22px] border border-stone-100 flex items-center justify-center text-5xl transition-all group-hover:bg-stone-100 shadow-sm overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
        ) : (
          <span className="scale-[0.8] group-hover:scale-[0.9] transition-transform duration-700 ease-out">🥘</span>
        )}
        <div 
          onClick={(e) => { e.stopPropagation(); onAdd(item); }}
          className="absolute right-3 bottom-3 h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-md border border-stone-200 transition-all scale-95 group-hover:scale-100 active:scale-90"
        >
          <Plus className="w-4 h-4 text-stone-950 transition-colors group-hover:text-orange-600" />
        </div>
      </div>
      <div className="mt-3 px-1">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h4 className="font-black text-[0.75rem] tracking-tight uppercase leading-tight flex-1 line-clamp-1">{item.name}</h4>
        </div>
        <p className="text-stone-400 font-bold text-[0.7rem] italic">{(item.price || 0).toLocaleString()}đ</p>
        {item.description && (
           <p className="text-stone-400 text-[0.65rem] mt-1.5 line-clamp-2 opacity-70 leading-relaxed font-medium">{item.description}</p>
        )}
      </div>
    </div>
  );
}

function RatingBar({ star, count, total }: { star: number, count: number, total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[0.6rem] font-black text-stone-400 w-2.5">{star}</span>
      <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[0.6rem] font-bold text-stone-300 w-6 text-right">{count}</span>
    </div>
  );
}

function RestaurantDetail() {
  const { shortName } = useParams();
  const { user } = useAuth();
  const [merchant, setMerchant] = useState<any>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  const addToCart = async (item: any) => {
    try {
      // If no storeId on item, fallback to first store in merchant list
      const storeId = item.storeId || merchant.stores[0]?.id;
      if (!storeId) throw new Error("Store information not found");

      await cartService.addItem(storeId, item.id, 1);
      localStorage.setItem('lastStoreId', storeId);
      
      setCartCount(prev => prev + 1);
      setLastAddedItem(item.name);
      setTimeout(() => setLastAddedItem(null), 3000);
    } catch (err: any) {
      console.error("Add to cart failed:", err);
      alert(err.message || "Failed to add item to bag");
    }
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    const fetchMerchant = async () => {
      if (!shortName) return;

      setIsLoading(true);
      try {
        const result = await publicService.getMerchantBySlug(shortName);
        const d = result.data;

        const transformedStores = d.storeLocations.map((s: any) => ({
          ...s,
          coords: [s.address?.longitude || 106.660172, s.address?.latitude || 10.762622]
        }));

        setMerchant({
          ...initialData,
          id: d.merchantId,
          name: d.merchantName,
          logo: d.logoUrl || "🏪",
          description: d.description,
          address: d.storeLocations[0]?.address?.line1 || "Premium Partner",
          status: "OPEN NOW",
          coverImage: d.storeLocations[0]?.heroImageUrl || initialData.coverImage,
          rating: d.overallReview?.averageRating || 0.0,
          reviewsCount: d.overallReview?.totalReviews || 0,
          overallReview: d.overallReview || initialData.overallReview,
          menu: d.menuByCategory || [],
          stores: transformedStores,
          coords: transformedStores[0]?.coords || initialData.coords
        });

        if (d.menuByCategory?.length > 0) {
          setActiveCategory(d.menuByCategory[0].name);
        }
      } catch (err) {
        console.error("Fetch merchant detail error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchant();
  }, [shortName]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || isLoading || merchant.stores.length === 0) return;
    
    if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
    }

    try {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: merchant.coords,
        zoom: 15,
        attributionControl: false
      });

      merchant.stores.forEach((store: any) => {
          const el = document.createElement('div');
          el.className = 'w-6 h-6 bg-orange-600 border-[2.5px] border-white rounded-lg rotate-45 shadow-md flex items-center justify-center';
          el.innerHTML = '<div style="transform: rotate(-45deg); font-size: 8px;">🏪</div>';
          
          new maplibregl.Marker({ element: el })
              .setLngLat(store.coords)
              .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<b>${store.name}</b>`))
              .addTo(mapRef.current!);
      });
    } catch (e) {
      console.warn("Map loading failed:", e);
    }

    return () => { 
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, [isLoading, merchant.coords, merchant.stores]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white font-sans scale-[0.8]">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin mb-4" />
        <p className="text-stone-400 font-black uppercase tracking-widest text-[0.5rem] animate-pulse">Designing Gourmet Experience...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans antialiased">
      <SideNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled ? "bg-white/95 backdrop-blur-xl border-stone-100 h-[56px] shadow-sm" : "bg-white border-transparent h-[85px]"}`}>
         <div className="mx-auto max-w-[1080px] h-full px-6 flex items-center justify-between text-stone-950">
            <div className="flex items-center gap-3.5">
                <button onClick={() => setIsSideNavOpen(true)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-stone-50 transition-colors">
                   <Menu className="w-3.5 h-3.5 shrink-0" />
                </button>
                <Link to="/" className="flex items-center gap-0.5 group shrink-0">
                   <span className="text-[1.1rem] font-black tracking-[-0.04em] uppercase">Foodio</span>
                   <span className="text-[1.1rem] font-black text-orange-600">.</span>
                </Link>
                <div className={`hidden lg:flex items-center gap-2 bg-stone-100 h-7 px-3.5 rounded-full ml-3 transition-all duration-500 ${isScrolled ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12 pointer-events-none"}`}>
                   <MapPin className="w-3 h-3 text-stone-900" />
                   <span className="text-[0.6rem] font-black truncate max-w-[180px] uppercase tracking-wide">{merchant.address}</span>
                   <ChevronDown className="w-2.5 h-2.5 text-stone-400" />
                </div>
            </div>
            <div className="flex items-center gap-3.5">
               <div className={`hidden sm:flex relative transition-all duration-500 ${isScrolled ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400" />
                  <input placeholder="Search..." className="h-7 pl-8 pr-3 bg-stone-100 rounded-full text-[0.6rem] font-bold w-40 focus:ring-4 focus:ring-orange-500/10 shadow-inner outline-none" />
               </div>

               <Link to="/cart" className="relative h-8 w-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-50 transition-colors group">
                  <ShoppingBag className="w-4 h-4 text-stone-950 group-hover:text-orange-600 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1.5 flex items-center justify-center bg-orange-600 text-white text-[0.5rem] font-black rounded-full shadow-lg">
                       {cartCount}
                    </span>
                  )}
               </Link>
               
               {user ? (
                 <Link to="/profile" className="flex items-center gap-2 pl-3 border-l border-stone-200 group">
                    <div className="flex flex-col items-end">
                       <span className="text-[0.5rem] font-black uppercase tracking-widest text-stone-400 group-hover:text-stone-600">Logged in</span>
                       <span className="text-[0.65rem] font-bold text-stone-950">{user.fullName || user.name}</span>
                    </div>
                    <div className="h-7 w-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[0.55rem] overflow-hidden shadow-sm group-hover:border-orange-500 transition-all">
                       {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : "👤"}
                    </div>
                 </Link>
               ) : (
                 <>
                   <Link to="/login" className="px-2.5 text-[0.55rem] font-black uppercase tracking-[0.2em] hover:text-orange-600 transition-colors">Log In</Link>
                   <Link to="/register" className="px-4.5 h-7 flex items-center bg-stone-950 text-white rounded-full text-[0.55rem] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-lg active:scale-95">Sign Up</Link>
                 </>
               )}
            </div>
         </div>
      </nav>
      
      <div className={`sticky top-[56px] z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 transition-all duration-300 ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
         <div className="mx-auto max-w-[1080px] px-6 flex items-center gap-5 h-10 overflow-x-auto no-scrollbar">
            {merchant.menu?.map((cat: any) => (
               <button 
                 key={cat.name}
                 onClick={() => setActiveCategory(cat.name)}
                 className={`text-[0.55rem] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all ${activeCategory === cat.name ? "text-orange-600 border-b-2 border-orange-600 pb-0.5" : "text-stone-400 hover:text-stone-950"}`}
               >
                  {cat.name}
               </button>
            ))}
         </div>
      </div>

      <section className="relative h-[360px] w-full overflow-hidden mt-[85px]">
         <img src={merchant.coverImage} className="w-full h-full object-cover" alt="Cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/10 to-transparent" />
         <div className="absolute bottom-0 left-0 w-full pb-8">
            <div className="mx-auto max-w-[1080px] px-6 flex items-end gap-6 text-white">
               <div className="h-20 w-20 rounded-[22px] bg-white shadow-2xl flex items-center justify-center text-3xl border-[2.5px] border-white rotate-[-2deg] shrink-0 text-stone-950 font-black overflow-hidden">
                 {merchant.logo?.startsWith('http') ? (
                   <img src={merchant.logo} className="w-full h-full object-cover" alt="Logo" />
                 ) : (
                   <span className="text-orange-600">{merchant.name?.charAt(0).toUpperCase() || "🏪"}</span>
                 )}
               </div>
               <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight drop-shadow-2xl">{merchant.name}</h1>
                  </div>
                  <div className="flex flex-wrap gap-5 text-[0.75rem] font-black uppercase tracking-[0.15em] drop-shadow-xl">
                     <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> {Number(merchant.rating).toFixed(1)} ({merchant.reviewsCount})</span>
                     <span className="opacity-40">•</span>
                     <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-stone-400" /> {merchant.deliveryTime} MINS</span>
                     <span className="opacity-40">•</span>
                     <span className="text-orange-400">{merchant.status}</span>
                  </div>
               </div>
               <button className="h-9 px-5 border-2 border-white/50 rounded-lg text-white font-black text-[0.6rem] uppercase tracking-[0.2em] hover:bg-white hover:text-stone-950 transition-all shadow-xl">Group Order</button>
            </div>
         </div>
      </section>

      <div className="bg-white">
         <div className="mx-auto max-w-[1080px] py-10 px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               <div className="md:col-span-2 space-y-8">
                  <div className="bg-slate-900 text-white rounded-[24px] p-6 relative overflow-hidden shadow-xl border border-white/5">
                     <div className="flex items-center justify-between mb-5 relative z-10">
                        <div className="flex flex-col gap-1">
                           <h3 className="text-base font-black uppercase tracking-widest italic leading-tight">Fastest Delivery.</h3>
                           <p className="text-[0.6rem] font-black text-stone-500 uppercase tracking-widest">Premium contactless delivery to your door</p>
                        </div>
                        <div className="h-9 w-9 rounded-lg bg-orange-600 flex items-center justify-center shadow-lg"><Clock className="w-4 h-4 text-white" /></div>
                     </div>
                     <div className="relative z-10 flex gap-2.5">
                        <div className="relative flex-1">
                           <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                           <input placeholder="Your delivery address..." className="w-full h-9 bg-white rounded-[14px] pl-11 pr-5 text-stone-950 font-black text-[0.75rem] outline-none" />
                        </div>
                        <button className="h-9 px-5 bg-orange-600 text-white rounded-[14px] text-[0.6rem] font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg">Confirm</button>
                     </div>
                     <div className="absolute top-[-30%] right-[-10%] h-56 w-56 bg-orange-600/10 rounded-full blur-[70px]" />
                  </div>

                  {/* Customer Reviews Section */}
                  <section className="bg-stone-50/50 p-6 rounded-[28px] border border-stone-100/50">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2.5 mb-0.5">
                          <h2 className="text-[0.9rem] font-black uppercase tracking-widest text-stone-950">Customer Reviews</h2>
                          <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                        </div>
                        <p className="text-[0.55rem] font-bold text-stone-400 uppercase tracking-[0.1rem]">Genuine feedback from the Foodio community</p>
                      </div>
                      <button className="h-8 px-4 bg-stone-950 text-white rounded-lg text-[0.55rem] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md">Rate us</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
                      <div className="sm:col-span-4 flex flex-col items-center justify-center p-5 bg-white rounded-[24px] border border-stone-100 shadow-sm">
                        <p className="text-4xl font-black text-stone-950 mb-0.5">{Number(merchant.rating).toFixed(1)}</p>
                        <div className="flex items-center gap-0.5 mb-2.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-3 h-3 ${s <= Math.round(merchant.rating) ? "text-orange-500 fill-orange-500" : "text-stone-100 fill-stone-100"}`} 
                            />
                          ))}
                        </div>
                        <p className="text-[0.5rem] font-black text-stone-400 uppercase tracking-widest">{merchant.reviewsCount} REVIEWS</p>
                      </div>

                      <div className="sm:col-span-8 space-y-1.5">
                        <RatingBar star={5} count={merchant.overallReview.fiveStarCount} total={merchant.reviewsCount} />
                        <RatingBar star={4} count={merchant.overallReview.fourStarCount} total={merchant.reviewsCount} />
                        <RatingBar star={3} count={merchant.overallReview.threeStarCount} total={merchant.reviewsCount} />
                        <RatingBar star={2} count={merchant.overallReview.twoStarCount} total={merchant.reviewsCount} />
                        <RatingBar star={1} count={merchant.overallReview.oneStarCount} total={merchant.reviewsCount} />
                      </div>
                    </div>
                  </section>

                  <section>
                     <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                           <h2 className="text-[0.9rem] font-black uppercase tracking-widest text-stone-950">Store Locations</h2>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {merchant.stores.map((store: any) => <StoreBranchCard key={store.id} store={store} />)}
                     </div>
                  </section>
               </div>

               <div className="flex flex-col gap-5">
                   <div className="bg-stone-50 h-[260px] rounded-[28px] overflow-hidden border border-stone-200 relative shadow-inner group">
                      <div ref={mapContainerRef} className="absolute inset-0" />
                      <div className="absolute top-3 left-3 z-10 bg-stone-950 text-white px-3 py-1 rounded-full text-[0.55rem] font-black uppercase tracking-widest border border-white/10 group-hover:bg-orange-600 transition-colors">Map View</div>
                      <div className="absolute inset-x-3 bottom-3 z-10 pointer-events-none">
                         <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-stone-100 flex items-center gap-3">
                            <div className="h-7 w-7 rounded-lg bg-stone-950 flex items-center justify-center text-white"><MapIcon className="w-3.5 h-3.5 text-orange-500" /></div>
                            <div>
                               <p className="text-[0.65rem] font-black text-stone-950 uppercase leading-none mb-0.5 tracking-tight">Active Reach</p>
                               <p className="text-[0.55rem] font-bold text-stone-400 uppercase tracking-widest">{merchant.stores?.length || 0} Locations</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="bg-stone-50 p-5 rounded-[24px] border border-stone-100 flex flex-col gap-2.5">
                      <p className="text-[0.6rem] font-black text-stone-500 flex items-center gap-2 uppercase tracking-[0.2em]">
                        <Info className="w-3.5 h-3.5 text-orange-500" /> Standards
                      </p>
                      <p className="text-[0.7rem] font-medium text-stone-400 leading-relaxed italic line-clamp-3">{merchant.description || "Consistent quality, service standards, and culinary excellence across all locations."}</p>
                   </div>
               </div>
            </div>

            <div className="mt-16 space-y-16">
               {merchant.menu?.length === 0 ? (
                 <div className="py-12 text-center bg-stone-50 rounded-[28px] border-2 border-dashed border-stone-100">
                    <p className="text-stone-400 font-bold italic text-xs uppercase tracking-widest">Menu updating...</p>
                 </div>
               ) : (
                 merchant.menu.map((category: any) => (
                   <section key={category.name}>
                      <div className="flex items-center gap-2.5 mb-6">
                         <h2 className="text-[0.9rem] font-black uppercase tracking-widest text-stone-950">{category.name}</h2>
                         <div className="h-1 w-1 rounded-full bg-orange-600" />
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
                         {category.products?.map((item: any) => (
                           <ProductCard key={item.id} item={item} onAdd={addToCart} />
                         ))}
                      </div>
                   </section>
                 ))
               )}
            </div>
         </div>
      </div>

      {lastAddedItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-stone-950 text-white px-5 py-2.5 rounded-[20px] shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-8 duration-500">
           <div className="h-7 w-7 rounded-lg bg-orange-600 flex items-center justify-center text-base">✨</div>
           <div>
              <p className="text-[0.5rem] font-black uppercase tracking-widest text-orange-500 leading-none mb-0.5">Added to bag</p>
              <p className="text-[0.7rem] font-bold line-clamp-1">{lastAddedItem}</p>
           </div>
           <button onClick={() => setLastAddedItem(null)} className="ml-2.5 h-6 w-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
              <Plus className="w-3 rotate-45" />
           </button>
        </div>
      )}

      <Footer snapping={false} />
    </div>
  );
}

export default RestaurantDetail;
