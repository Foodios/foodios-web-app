import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Link } from "react-router-dom";
import { cities, countries } from "../utils/landingData";
import { Activity } from "lucide-react";

type LocationsSectionProps = {
  active?: boolean;
};

// Extremely stable 2D tiles for Leaflet
const TILE_LAYER = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

function LocationsSection({ active }: LocationsSectionProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Small delay to ensure container is ready
    const timer = setTimeout(() => {
      try {
        // Initialize Leaflet - Much more stable as it's 2D and doesn't use WebGL
        mapRef.current = L.map(mapContainer.current!, {
          center: [10.7769, 106.7011], // HCMC centers (Lat, Lng for Leaflet)
          zoom: 13,
          zoomControl: false,
          scrollWheelZoom: false,
          dragging: true,
          attributionControl: false
        });

        L.tileLayer(TILE_LAYER, {
          maxZoom: 19
        }).addTo(mapRef.current);

        const locations = [
          { name: "District 1 (Downtown)", coords: [10.7769, 106.7011] as [number, number] },
          { name: "Thao Dien (D2)", coords: [10.8037, 106.7359] as [number, number] },
          { name: "Phu My Hung (D7)", coords: [10.7303, 106.7218] as [number, number] },
          { name: "District 3", coords: [10.7813, 106.6853] as [number, number] },
          { name: "Binh Thanh", coords: [10.7938, 106.7119] as [number, number] },
          { name: "District 4", coords: [10.7613, 106.7021] as [number, number] },
        ];

        locations.forEach((l) => {
          const customIcon = L.divIcon({
            className: "custom-leaflet-marker",
            html: `
              <div class="group/marker relative flex flex-col items-center">
                <div class="relative flex h-5 w-5 items-center justify-center">
                  <div class="absolute inset-0 animate-pulse rounded-full bg-orange-400 opacity-40"></div>
                  <div class="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,1)] border-2 border-white"></div>
                </div>
                <span class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-900 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-xl border border-white/50 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                  ${l.name}
                </span>
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          L.marker(l.coords, { icon: customIcon }).addTo(mapRef.current!);
        });

        setIsReady(true);
        // Sync size
        setTimeout(() => mapRef.current?.invalidateSize(), 200);

      } catch (err) {
        console.error("Leaflet Init Error:", err);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync size on visibility
  useEffect(() => {
    if (active && mapRef.current) {
        const t = setTimeout(() => {
            mapRef.current?.invalidateSize();
        }, 300);
        return () => clearTimeout(t);
    }
  }, [active]);

  return (
    <section id="locations" className="snap-start snap-always relative min-h-screen overflow-hidden bg-[#fafafa] py-24 group" data-active={active}>
      <div className="relative mx-auto w-[min(1240px,calc(100%-32px))]">
        <div className={`mb-12 flex items-end justify-between gap-6 max-[820px]:flex-col max-[820px]:items-start transition-all duration-1000 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-stone-900/5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Local Presence
            </span>
            <h2 className="m-0 text-[clamp(2.4rem,4vw,3.6rem)] font-bold leading-tight tracking-[-0.06em] text-stone-950">
              Restaurants in <span className="text-stone-400">Ho Chi Minh</span>
            </h2>
          </div>
          <button 
            onClick={() => mapRef.current?.invalidateSize()}
            className="group flex items-center gap-3 text-sm font-bold text-stone-950 transition-all"
          >
            <span className="underline underline-offset-8 decoration-stone-200 transition-all group-hover:decoration-stone-950">Recenter & Sync Map</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-stone-100">
              <Activity className="w-4 h-4 text-stone-400" />
            </div>
          </button>
        </div>

        <div className={`relative min-h-[540px] overflow-hidden rounded-[40px] bg-stone-100 border border-stone-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-1000 ${active ? "opacity-100" : "opacity-0"}`}>
          <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />
          
          <div className="absolute inset-0 z-10 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          {!isReady && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-50 gap-4">
              <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-[0.6rem] font-black uppercase tracking-widest text-stone-400">Initializing Engine...</p>
            </div>
          )}

          <div className={`absolute bottom-8 left-8 max-w-[280px] z-10 bg-white/60 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-sm transition-all duration-700 delay-500 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <p className="m-0 text-[0.7rem] font-bold text-stone-500 uppercase tracking-[0.2em] mb-2 font-black">Live Network</p>
            <h3 className="m-0 text-[1.1rem] font-bold text-stone-950 mb-4 leading-tight tracking-[-0.02em]">Connecting 120+ restaurants to your door</h3>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-9 w-9 rounded-full border-4 border-white bg-stone-100 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${n+10}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="h-9 w-9 rounded-full border-4 border-white bg-orange-600 flex items-center justify-center text-[0.6rem] font-bold text-white shadow-lg">+4.9k</div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {[
            { title: "Popular Restaurants", items: cities.slice(0, 8), accent: "border-orange-500", type: 'restaurant' },
            { title: "Late Night Bites", items: cities.slice(8, 16), accent: "border-stone-200" },
            { title: "Districts Covered", items: countries.slice(0, 8), accent: "border-stone-200", prefix: "@ " },
            { title: "Regional Hubs", items: countries.slice(8, 16), accent: "border-stone-200", suffix: " Hub" },
          ].map((col, i) => (
            <div key={i} className={`transition-all duration-1000 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${800 + i * 100}ms` }}>
              <h4 className={`text-[0.75rem] font-bold text-stone-400 uppercase tracking-[0.2em] mb-6 border-l-2 ${col.accent} pl-4`}>{col.title}</h4>
              <div className="flex flex-col gap-3">
                {col.items.map((item) => {
                    const slug = item.toLowerCase().replace(/['\s]+/g, '');
                    return col.type === 'restaurant' ? (
                        <Link key={item} to={`/restaurant/${slug}`} className="text-sm font-bold text-stone-600 hover:text-orange-600 hover:translate-x-1 transition-all">
                            {item}
                        </Link>
                    ) : (
                        <a key={item} href="#" className="text-sm font-medium text-stone-600 hover:text-stone-950 hover:translate-x-1 transition-all">
                            {col.prefix}{item}{col.suffix}
                        </a>
                    );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LocationsSection;
