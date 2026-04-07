import { featureCards } from "../utils/landingData";

type FeatureCardsProps = {
  active?: boolean;
};

function FeatureCards({ active }: FeatureCardsProps) {
  return (
    <section
      id="features"
      className="snap-start snap-always relative z-20 flex min-h-screen items-start overflow-hidden bg-[#fff8ef] py-10 shadow-[0_-18px_50px_rgba(0,0,0,0.08)] group"
      aria-label="Foodio highlights"
      data-active={active}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,196,120,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(80,180,150,0.14),transparent_26%)]" />
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute top-40 -left-20 h-96 w-96 rounded-full bg-stone-200/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 -right-20 h-96 w-96 rounded-full bg-orange-100/10 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/4 right-10 flex flex-col gap-2 opacity-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-2">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="h-1 w-1 rounded-full bg-stone-900" />
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto w-[min(1240px,calc(100%-32px))] max-[560px]:w-[min(1240px,calc(100%-20px))]">
        <div className={`mb-10 flex items-end justify-between gap-8 max-[820px]:flex-col max-[820px]:items-start transition-all duration-1000 ease-out ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative max-w-xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-stone-900/5 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-stone-600">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-pulse" />
              Partnership & Business
            </span>
            <h2 className="m-0 text-[clamp(2.4rem,4.2vw,3.8rem)] font-bold leading-[1.1] tracking-[-0.06em] text-stone-950">
              Empowering food <br />
              <span className="bg-gradient-to-r from-stone-950 via-stone-700 to-stone-400 bg-clip-text text-transparent">
                delivery ecosystem
              </span>
            </h2>
          </div>
          <div className="flex flex-col gap-4 max-w-sm">
            <p className="m-0 text-[1.05rem] font-medium leading-relaxed text-stone-700">
              Join thousands of businesses, restaurants, and couriers growing with Foodio across the globe.
            </p>
            <div className="flex gap-2">
              <div className="h-1 w-8 rounded-full bg-stone-950" />
              <div className="h-1 w-4 rounded-full bg-stone-200" />
              <div className="h-1 w-4 rounded-full bg-stone-200" />
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featureCards.map((card, index) => (
            <article
              className={`group overflow-hidden rounded-[28px] bg-white shadow-[0_20px_55px_rgba(72,34,0,0.12)] transition-all duration-700 hover:-translate-y-1 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
              key={card.title}
              style={{ transitionDelay: `${400 + index * 150}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.1]"
                  src={card.image}
                  alt={card.title}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_40%,rgba(0,0,0,0.6)_100%)] opacity-80" />
                <span className="absolute left-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold tracking-[0.06em] text-white backdrop-blur-xl border border-white/20">
                  {index + 1}
                </span>
                <span className="absolute bottom-5 left-5 inline-flex rounded-full border border-white/30 bg-black/20 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-xl">
                  {card.eyebrow}
                </span>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="m-0 text-[1.4rem] font-bold leading-tight tracking-[-0.03em] text-stone-950 transition-colors group-hover:text-stone-700">
                      {card.title}
                    </h3>
                    <p className="mt-2.5 mb-0 text-[0.9rem] leading-relaxed text-stone-500">
                      {card.note}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-950 text-white shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-12 group-hover:bg-stone-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                </div>
                <div className="pt-5 border-t border-stone-100 flex items-center justify-between">
                  <a
                    className="group/btn relative inline-flex items-center text-sm font-bold text-stone-950"
                    href="#footer"
                  >
                    <span className="relative z-10">{card.description}</span>
                    <div className="absolute -bottom-1 left-0 h-1.5 w-full bg-stone-100 transition-all duration-300 group-hover/btn:h-0.5 group-hover/btn:bg-stone-400" />
                  </a>
                  <span className="text-[0.6rem] font-black uppercase tracking-[0.25em] text-stone-300">
                    Join Now
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={`mt-12 grid gap-8 rounded-[40px] bg-white border border-stone-100 p-8 shadow-[0_32px_64px_-16px_rgba(40,20,0,0.06)] lg:grid-cols-3 relative overflow-hidden group/stats transition-all duration-1000 delay-[900ms] ${active ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"}`}>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-stone-50 transition-transform duration-700 group-hover/stats:scale-110" />
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff8ef] text-stone-800">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h4 className="m-0 text-xl font-bold tracking-[-0.03em] text-stone-950">
                Fast setup
              </h4>
              <p className="mt-2 mb-0 text-[0.95rem] leading-relaxed text-stone-500">
                Get your account, menu, or delivery flow ready in minutes with our intuitive dashboard.
              </p>
            </div>
            <div className={`mt-auto h-1.5 rounded-full bg-stone-100 transition-all duration-[1500ms] delay-[1800ms] ${active ? "w-full" : "w-0"}`} />
          </div>

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff6ff] text-stone-800">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 100-8 4 4 0 000 8z" /></svg>
            </div>
            <div>
              <h4 className="m-0 text-xl font-bold tracking-[-0.03em] text-stone-950">
                Better reach
              </h4>
              <p className="mt-2 mb-0 text-[0.95rem] leading-relaxed text-stone-500">
                Match with nearby customers and high-volume corporate teams who already need you.
              </p>
            </div>
            <div className={`mt-auto h-1.5 rounded-full bg-stone-100 transition-all duration-[1500ms] delay-[2000ms] ${active ? "w-full" : "w-0"}`} />
          </div>

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f5f4] text-stone-800">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <div>
              <h4 className="m-0 text-xl font-bold tracking-[-0.03em] text-stone-950">
                Always moving
              </h4>
              <p className="mt-2 mb-0 text-[0.95rem] leading-relaxed text-stone-500">
                Keep orders, deliveries, and team meals flowing smoothly with real-time tracking.
              </p>
            </div>
            <div className={`mt-auto h-1.5 rounded-full bg-stone-100 transition-all duration-[1500ms] delay-[2200ms] ${active ? "w-full" : "w-0"}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureCards;
