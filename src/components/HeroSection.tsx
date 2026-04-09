import { useState, useEffect, useRef } from "react";
import banner from "../assets/main-banner.jpg";
import { Link, useNavigate } from "react-router-dom";
import { publicService } from "../services/publicService";
import { Search, MapPin, Store, ChevronRight, Loader2 } from "lucide-react";

type HeroSectionProps = {
  active?: boolean;
};

function HeroSection({ active }: HeroSectionProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Debounce Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setShowResults(true);
      try {
        console.log("Global searching for:", searchQuery);
        const response = await publicService.globalSearch(searchQuery);
        console.log("Search response:", response);
        
        // Handle standard response structure with .data.items
        // Handle standard response structure or new global search structure
        const rawData = response.data || response;
        let finalResults = [];
        
        if (rawData.stores || rawData.products) {
          finalResults = [...(rawData.stores || []), ...(rawData.products || [])];
        } else {
          finalResults = Array.isArray(rawData) 
            ? rawData 
            : (rawData.items || rawData.content || rawData.merchants || rawData.data || []);
        }
          
        setResults(finalResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      // Navigate to the first result if exists
      const first = results[0];
      navigate(`/restaurant/${first.slug || first.shortName || first.id}`);
    }
  };

  return (
    <section id="hero" className="snap-start snap-always relative min-h-screen overflow-hidden text-white group" data-active={active}>
      <img
        className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[10000ms] ease-out ${active ? "scale-110" : "scale-100"}`}
        src={banner}
        alt=""
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.45)_34%,rgba(0,0,0,0.15)_60%,rgba(0,0,0,0.08)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(0,0,0,0.18),transparent_34%)]" />
      
      <div className="relative mx-auto flex h-full w-[min(1240px,calc(100%-32px))] flex-col justify-center gap-8 pb-14 pt-37.5 max-[560px]:w-[min(1240px,calc(100%-20px))] max-[560px]:pt-32">
        <div className={`max-w-180 transition-all duration-1000 ease-out delay-300 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/80 px-3.5 py-2 text-sm font-semibold text-stone-700 shadow-sm backdrop-blur-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_0_6px_rgba(255,90,31,0.14)]" />
            Fast food delivery that feels local
          </div>
          <h1 className="mt-5 mb-5 max-w-[9.0ch] text-[clamp(3rem,6vw,5.9rem)] leading-[0.9] tracking-[-0.09em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] max-[560px]:text-[clamp(2.5rem,14vw,3.6rem)]">
            Order delivery near you
          </h1>
          <p className="mb-7 max-w-135 text-[clamp(1rem,1.6vw,1.12rem)] leading-[1.65] text-white/88 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            Search restaurants, discover nearby favorites, and get Foodio moving
            in just a few taps.
          </p>

          <div ref={searchRef} className="relative max-w-195">
            <form onSubmit={handleSearchSubmit} className={`grid grid-cols-[minmax(0,1.5fr)_minmax(140px,.6fr)_auto] items-center gap-2 max-[820px]:grid-cols-1 max-[820px]:max-w-none transition-all duration-1000 delay-500 ${active ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
              <label className="flex min-h-13.5 items-center gap-3 rounded-[14px] bg-white px-4 shadow-[inset_0_0_0_1px_rgba(29,20,15,0.12)] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                <Search className="shrink-0 w-4 h-4 text-stone-950" />
                <input
                  className="w-full border-0 bg-transparent text-stone-900 outline-none placeholder:text-stone-500 text-sm font-bold"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowResults(true)}
                  placeholder="Search for restaurants, dishes or cuisines"
                />
              </label>
              <div className="flex min-h-13.5 items-center gap-3 rounded-[14px] bg-white px-4 shadow-[inset_0_0_0_1px_rgba(29,20,15,0.12)]">
                <span className="shrink-0 text-stone-950 opacity-60">🕒</span>
                <span className="text-sm font-bold text-stone-900 line-clamp-1 whitespace-nowrap">Deliver now</span>
              </div>
              <button
                type="submit"
                className="min-h-13.5 rounded-[14px] bg-stone-950 px-6 font-black text-[0.7rem] uppercase tracking-widest text-white shadow-lg transition-all duration-200 hover:bg-orange-600 active:scale-95"
              >
                Find Food
              </button>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                <div className="max-h-[350px] overflow-y-auto">
                  {isSearching ? (
                    <div className="p-8 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 text-orange-600 animate-spin" />
                      <p className="text-[0.65rem] font-black uppercase tracking-widest text-stone-400">Searching merchants...</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="p-2">
                       <p className="px-3 py-2 text-[0.6rem] font-black uppercase tracking-[0.2em] text-stone-300">Matching Restaurants</p>
                       <div className="flex flex-col gap-1">
                         {results.map((merchant) => (
                           <Link 
                             key={merchant.id} 
                             to={`/restaurant/${merchant.slug || merchant.shortName || merchant.id}`}
                             className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors group"
                             onClick={() => setShowResults(false)}
                           >
                              <div className="h-10 w-10 rounded-[10px] bg-stone-100 flex items-center justify-center overflow-hidden shrink-0 border border-stone-50">
                                {merchant.logoUrl ? (
                                  <img src={merchant.logoUrl} alt={merchant.displayName} className="w-full h-full object-cover" />
                                ) : (
                                  <Store className="w-5 h-5 text-stone-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-stone-950 truncate group-hover:text-orange-600 transition-colors uppercase italic">
                                  {merchant.displayName || merchant.name}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <MapPin className="w-3 h-3 text-stone-300" />
                                  <p className="text-[0.65rem] font-bold text-stone-400 truncate">
                                    {merchant.description || "Restaurant partner"}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-stone-400 transform group-hover:translate-x-1 transition-all" />
                           </Link>
                         ))}
                       </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm font-bold text-stone-500 italic">No restaurants found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            className={`mt-6 inline-flex text-sm font-bold text-white underline underline-offset-4 transition-all duration-700 delay-700 ${active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
            to="/pick-it-up"
          >
            or Pick it up
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
