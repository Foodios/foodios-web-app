import {
  Star,
  Clock,
  MapPin,
  Search,
  ChevronDown,
  Plus,
  ArrowRight,
  ArrowLeft,
  Map as MapIcon,
  Menu,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Footer from "../../components/Footer";
import SideNav from "../../components/SideNav";

const pizza4psData = {
  name: "Pizza 4P's® (Ben Thanh)",
  shortName: "pizza4ps",
  rating: 4.8,
  reviewsCount: "1,200+",
  deliveryTime: "25-35",
  deliveryFee: "15,000đ",
  category: "Japanese-Italian • Pizza • Gourmet",
  address: "8 Thu Khoa Huan, District 1, HCMC",
  coords: [106.6989, 10.7719] as [number, number],
  status: "Open until 10:00 PM",
  coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
  logo: "🍕",
  featuredItems: [
    { id: "f1", name: "4P's Cheese Platter", price: 295000, image: "🧀", rank: "#1 MOST LIKED" },
    { id: "f2", name: "Burrata Parma Ham", price: 345000, image: "🍕", rank: "#2 MOST LIKED" },
    { id: "f3", name: "Crab Tomato Pasta", price: 215000, image: "🍝", rank: "#3 MOST LIKED" },
    { id: "f4", name: "House-made Ginger Ale", price: 55000, image: "🥤" },
    { id: "f5", name: "Salmon Sashimi Pizza", price: 245000, image: "🐟" },
  ],
  menu: [
    {
      category: "Most Popular",
      items: [
        { id: "m1", name: "Burrata Parma Ham Pizza", price: 345000, description: "Signature pizza with house-made fresh burrata cheese & premium parma ham.", image: "🍕", tags: ["MUST TRY"] },
        { id: "m2", name: "Crab Tomato Cream Pasta", price: 215000, description: "Handmade pasta with rich crab & sweet tomato cream sauce.", image: "🍝", tags: ["CHEF'S PICK"] },
        { id: "m3", name: "Petit Burrata Salad", price: 145000, description: "Fresh burrata with organic arugula and balsamic reduction.", image: "🥗" },
      ]
    },
    {
       category: "Classic Pizzas",
       items: [
         { id: "p1", name: "Three-Cheese Pizza", price: 185000, description: "Mozzarella, Parmesan, and Gorgonzola served with honey.", image: "🍯" },
         { id: "p2", name: "Margherita Pizza", price: 165000, description: "Simple classic with house-made fresh mozzarella and basil.", image: "🍅" },
         { id: "p3", name: "Salami Pizza", price: 195000, description: "Iberico salami with spicy honey drizzle.", image: "🌶️" },
       ]
    }
  ],
};

function ProductCard({ item, rank, isWide = false }: { item: any, rank?: string, isWide?: boolean }) {
  return (
    <div className={`group cursor-pointer flex flex-col ${isWide ? "" : "min-w-[280px]"}`}>
      <div className="relative h-52 w-full bg-stone-50 rounded-[32px] border border-stone-100 flex items-center justify-center text-7xl transition-all group-hover:bg-stone-100 shadow-md overflow-hidden">
        {rank && (
          <span className="absolute top-4 left-4 bg-white text-stone-950 text-[0.6rem] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest z-10 border border-stone-200 shadow-sm">
            {rank}
          </span>
        )}
        <span className="scale-[0.8] group-hover:scale-[0.9] transition-transform duration-700 ease-out">{item.image}</span>
        <div className="absolute right-5 bottom-5 h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-stone-100 group-hover:bg-stone-950 group-hover:text-white transition-all scale-95 group-hover:scale-100">
          <Plus className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-5 px-1">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h4 className="font-black text-[1.05rem] tracking-tight uppercase leading-tight flex-1">{item.name}</h4>
          {item.tags?.map((t: string) => (
             <span key={t} className="px-2 py-0.5 bg-orange-600 text-white text-[0.55rem] font-black rounded-lg uppercase tracking-widest shrink-0 shadow-lg shadow-orange-600/20">{t}</span>
          ))}
        </div>
        <p className="text-stone-400 font-bold text-[0.9rem] italic">{item.price.toLocaleString()}đ</p>
        {!rank && item.description && (
           <p className="text-stone-400 text-[0.85rem] mt-3 line-clamp-2 opacity-80 leading-relaxed font-medium">{item.description}</p>
        )}
      </div>
    </div>
  );
}

function RestaurantDetail() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Most Popular");
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const featuredScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: pizza4psData.coords,
      zoom: 16,
      attributionControl: false
    });
    const el = document.createElement('div');
    el.className = 'w-7 h-7 bg-orange-600 border-4 border-white rounded-full shadow-[0_0_15px_rgba(234,88,12,0.3)]';
    new maplibregl.Marker({ element: el }).setLngLat(pizza4psData.coords).addTo(mapRef.current);
    return () => { mapRef.current?.remove(); };
  }, []);

  const scrollFeatured = (dir: 'left' | 'right') => {
     if (featuredScrollRef.current) {
        const amt = dir === 'left' ? -320 : 320;
        featuredScrollRef.current.scrollBy({ left: amt, behavior: 'smooth' });
     }
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans antialiased">
      <SideNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />

      {/* Premium Multi-state Header */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled ? "bg-white/95 backdrop-blur-xl border-stone-100 py-2 shadow-sm" : "bg-white border-transparent py-4"}`}>
         <div className="w-full px-10 flex items-center justify-between text-stone-950">
            <div className="flex items-center gap-5">
                <button onClick={() => setIsSideNavOpen(true)} className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-stone-50 transition-colors">
                   <Menu className="w-5 h-5 shrink-0" />
                </button>
                <Link to="/" className="flex items-center gap-0.5 group shrink-0">
                   <span className="text-[1.5rem] font-black tracking-[-0.04em] uppercase">Foodio</span>
                   <span className="text-[1.5rem] font-black text-orange-600">.</span>
                </Link>
                <div className={`hidden lg:flex items-center gap-3 bg-stone-100 h-9 px-5 rounded-full ml-6 transition-all duration-500 ${isScrolled ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12 pointer-events-none"}`}>
                   <MapPin className="w-4 h-4 text-stone-900" />
                   <span className="text-[0.75rem] font-black truncate max-w-[250px] uppercase tracking-wide">{pizza4psData.address}</span>
                   <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </div>
            </div>
            <div className="flex items-center gap-5">
               <div className={`hidden sm:flex relative transition-all duration-500 ${isScrolled ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input placeholder="What would you like to eat?" className="h-9 pl-11 pr-5 bg-stone-100 rounded-full text-[0.75rem] font-bold w-64 focus:ring-4 focus:ring-orange-500/10 shadow-inner outline-none" />
               </div>
               <Link to="/login" className="px-5 text-[0.7rem] font-black uppercase tracking-[0.2em] hover:text-orange-600 transition-colors">Log In</Link>
               <Link to="/register" className="px-7 h-9 flex items-center bg-stone-950 text-white rounded-full text-[0.7rem] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl active:scale-95">Sign Up</Link>
            </div>
         </div>
      </nav>

      {/* High-Impact Hero Section */}
      <section className="relative h-[480px] w-full overflow-hidden mt-[76px]">
         <img src={pizza4psData.coverImage} className="w-full h-full object-cover scale-105" />
         <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/10 to-transparent" />
         <div className="absolute bottom-0 left-0 w-full pb-14">
            <div className="mx-auto w-[min(1280px,calc(100%-48px))] px-10 flex items-end gap-10 text-white">
               <div className="h-28 w-28 rounded-3xl bg-white shadow-2xl flex items-center justify-center text-6xl border-4 border-white rotate-[-2deg] shrink-0 text-stone-950 font-black">{pizza4psData.logo}</div>
               <div className="flex-1 pb-2">
                  <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 drop-shadow-2xl">{pizza4psData.name}</h1>
                  <div className="flex flex-wrap gap-8 text-[0.95rem] font-black uppercase tracking-[0.15em] drop-shadow-xl">
                     <span className="flex items-center gap-2"><Star className="w-5 h-5 text-orange-400 fill-orange-400" /> {pizza4psData.rating} ({pizza4psData.reviewsCount})</span>
                     <span className="opacity-40">•</span>
                     <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-stone-400" /> {pizza4psData.deliveryTime} MINS</span>
                     <span className="opacity-40">•</span>
                     <span className="text-orange-400">{pizza4psData.status}</span>
                  </div>
               </div>
               <button className="h-14 px-8 border-2 border-white/50 rounded-2xl text-white font-black text-[0.8rem] uppercase tracking-[0.2em] hover:bg-white hover:text-stone-950 transition-all shadow-2xl active:scale-95">Group Order</button>
            </div>
         </div>
      </section>

      {/* Main Content Area */}
      <div className="bg-white">
         <div className="mx-auto w-[min(1280px,calc(100%-48px))] py-16 px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
               <div className="md:col-span-2 space-y-12">
                  <div className="bg-slate-900 text-white rounded-[38px] p-10 relative overflow-hidden shadow-2xl border border-white/5">
                     <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex flex-col gap-2">
                           <h3 className="text-xl font-black uppercase tracking-widest italic">Get it delivered to your door.</h3>
                           <p className="text-[0.75rem] font-black text-stone-500 uppercase tracking-widest">Premium contactless delivery to your door</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-xl shadow-orange-600/20"><Clock className="w-6 h-6 text-white" /></div>
                     </div>
                     <div className="relative z-10 flex gap-4">
                        <div className="relative flex-1">
                           <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-500" />
                           <input placeholder="Enter your delivery address..." className="w-full h-12 bg-white rounded-[24px] pl-16 pr-6 text-stone-950 font-black text-[1rem] outline-none shadow-inner" />
                        </div>
                        <button className="h-12 px-8 bg-orange-600 text-white rounded-[24px] text-[0.8rem] font-black uppercase tracking-widest hover:bg-orange-500 transition-all active:scale-95 shadow-2xl shadow-orange-600/30">Confirm</button>
                     </div>
                     <div className="absolute top-[-30%] right-[-10%] h-80 w-80 bg-orange-600/10 rounded-full blur-[100px]" />
                  </div>

                  <div className="bg-stone-50 rounded-[44px] p-6 border border-stone-100 flex items-center gap-12 shadow-sm relative overflow-hidden group">
                      <div className="text-center pr-12 border-r border-stone-200 shrink-0">
                         <div className="text-5xl font-black text-stone-950 mb-2">{pizza4psData.rating}</div>
                         <div className="flex gap-1 justify-center">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-orange-500 fill-orange-500" />)}
                         </div>
                         <p className="text-[0.65rem] font-black text-stone-400 uppercase tracking-widest mt-4">Verified Reputation</p>
                      </div>
                      <div className="flex-1 space-y-6">
                         <p className="text-stone-600 font-medium italic text-[1.0rem] leading-relaxed">"One of the best dining experiences in HCMC. The artisanal cheese makes a massive difference, and the crab pasta is simply legendary."</p>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="h-10 w-10 rounded-full bg-stone-200" />
                               <span className="text-[0.70rem] font-black text-stone-900 uppercase tracking-widest">Sarah M. • Premium Member</span>
                            </div>
                            <button className="text-[0.65rem] font-black text-orange-600 underline underline-offset-8 uppercase tracking-widest hover:text-stone-950 transition-colors">View All Reviews</button>
                         </div>
                      </div>
                  </div>
               </div>

               {/* Map & Sidebar Context */}
               <div className="flex flex-col gap-8">
                   <div className="bg-stone-50 h-[280px] rounded-[44px] overflow-hidden border border-stone-200 relative shadow-inner group">
                      <div ref={mapContainerRef} className="absolute inset-0" />
                      <div className="absolute top-6 left-6 z-10 bg-stone-950 text-white px-5 py-2 rounded-full text-[0.7rem] font-black uppercase tracking-widest shadow-2xl border border-white/10 group-hover:bg-orange-600 transition-colors">Store Map</div>
                      <div className="absolute inset-x-6 bottom-6 z-10 pointer-events-none">
                         <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-stone-100 flex items-center gap-5">
                            <div className="h-11 w-11 rounded-2xl bg-stone-950 flex items-center justify-center text-white"><MapIcon className="w-5 h-5 text-orange-500" /></div>
                            <div>
                               <p className="text-[0.85rem] font-black text-stone-950 uppercase leading-none mb-1 tracking-tight">{pizza4psData.address}</p>
                               <p className="text-[0.65rem] font-bold text-stone-400 uppercase tracking-widest">Open until 10:00 PM</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="bg-stone-50 p-8 rounded-[40px] border border-stone-100 flex flex-col gap-4">
                      <p className="text-[0.75rem] font-black text-stone-500 flex items-center gap-3 uppercase tracking-[0.2em]">
                        <Info className="w-5 h-5 text-orange-500" /> Nutrition Guideline
                      </p>
                      <p className="text-[0.9rem] font-medium text-stone-400 leading-relaxed italic">Daily energy needs based on 2,000 calorie diet. Individual requirements may vary based on health status and lifestyle.</p>
                   </div>
               </div>
            </div>

            {/* Featured Selection Slider */}
            <section className="mt-24 pt-16 border-t border-stone-100">
               <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-6">
                    <h2 className="text-[1.3rem] font-black uppercase tracking-[0.25em] text-stone-950">Featured Collection</h2>
                    <div className="h-2 w-2 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.5)]" />
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => scrollFeatured('left')} className="h-12 w-12 rounded-2xl border border-stone-200 flex items-center justify-center hover:bg-stone-950 hover:text-white transition-all shadow-sm active:scale-90"><ArrowLeft className="w-6 h-6" /></button>
                     <button onClick={() => scrollFeatured('right')} className="h-12 w-12 rounded-2xl border border-stone-200 flex items-center justify-center hover:bg-stone-950 hover:text-white transition-all shadow-sm active:scale-90"><ArrowRight className="w-6 h-6" /></button>
                  </div>
               </div>
               <div ref={featuredScrollRef} className="flex gap-10 overflow-x-auto no-scrollbar scroll-smooth pb-8">
                  {pizza4psData.featuredItems.map((item) => <ProductCard key={item.id} item={item} rank={item.rank} />)}
               </div>
            </section>

            {/* Category Subnav & Grid */}
            <div className="mt-24 space-y-24">
               <div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-xl py-6 flex gap-12 overflow-x-auto no-scrollbar border-b border-stone-100 shadow-sm px-4">
                  {pizza4psData.menu.map(cat => (
                     <button key={cat.category} onClick={() => setActiveCategory(cat.category)} className={`text-[0.8rem] font-black uppercase tracking-[0.25em] transition-all relative ${activeCategory === cat.category ? "text-orange-600" : "text-stone-400 hover:text-stone-950"}`}>
                        {cat.category}
                        {activeCategory === cat.category && <div className="absolute bottom-[-24px] left-[-20%] right-[-20%] h-1.5 bg-orange-600 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.3)]" />}
                     </button>
                  ))}
               </div>

               {pizza4psData.menu.map((section) => (
                  <section key={section.category} className="scroll-mt-36">
                     <div className="flex items-center gap-8 mb-16">
                        <h2 className="text-[1.8rem] font-black uppercase tracking-tight text-stone-950">{section.category}</h2>
                        <div className="flex-1 h-px bg-stone-100" />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                        {section.items.map(item => <ProductCard key={item.id} item={item} isWide={true} />)}
                     </div>
                  </section>
               ))}
            </div>
         </div>
      </div>

      <Footer snapping={false} />
    </div>
  );
}

export default RestaurantDetail;
