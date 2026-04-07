import banner from "../assets/main-banner.jpg";

type HeroSectionProps = {
  active?: boolean;
};

function HeroSection({ active }: HeroSectionProps) {
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

          <form className={`grid max-w-195 grid-cols-[minmax(0,1.5fr)_minmax(160px,.7fr)_auto] items-center gap-2 max-[820px]:grid-cols-1 max-[820px]:max-w-none transition-all duration-1000 delay-500 ${active ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <label className="flex min-h-13.5 items-center gap-3 rounded-[14px] bg-white px-4 shadow-[inset_0_0_0_1px_rgba(29,20,15,0.12)]">
              <span
                className="shrink-0 text-sm text-stone-950"
                aria-hidden="true"
              >
                ⌖
              </span>
              <input
                className="w-full border-0 bg-transparent text-stone-900 outline-none placeholder:text-stone-500"
                type="text"
                placeholder="Enter delivery address"
              />
            </label>
            <label className="flex min-h-13.5 items-center justify-between gap-3 rounded-[14px] bg-white px-4 shadow-[inset_0_0_0_1px_rgba(29,20,15,0.12)]">
              <span
                className="shrink-0 text-sm text-stone-950"
                aria-hidden="true"
              >
                ☺
              </span>
              <select
                className="w-full cursor-pointer border-0 bg-transparent text-stone-900 outline-none"
                defaultValue="deliver-now"
                aria-label="Delivery time"
              >
                <option value="deliver-now">Deliver now</option>
                <option value="schedule">Schedule for later</option>
              </select>
            </label>
            <button
              type="submit"
              className="min-h-13.5 rounded-[14px] bg-stone-950 px-5 font-bold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              Search here
            </button>
          </form>

          <a
            className={`mt-6 inline-flex text-sm font-bold text-white underline underline-offset-4 transition-all duration-700 delay-700 ${active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
            href="#footer"
          >
            or Sign in
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
