import { Link } from "react-router-dom";
import { footerLinks } from "../utils/landingData";
import logo from "../assets/logo-transparent-logo.png";

type FooterProps = {
  active?: boolean;
  snapping?: boolean;
};

function Footer({ active, snapping = true }: FooterProps) {
  // Let's make EVERYTHING visible by default to debug, then add subtle animations
  return (
    <footer id="footer" className={`${snapping ? 'snap-start snap-always' : ''} relative min-h-screen flex flex-col justify-between bg-[#fffaf5] text-stone-950 overflow-hidden border-t border-stone-100`}>
      
      {/* Decorative large brand name - Always visible but faint */}
      <div className={`absolute bottom-[-5%] left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.04] select-none w-full text-center z-0 transition-all duration-[2000ms] ${active ? "translate-y-0" : "translate-y-10"}`}>
        <h2 className="text-[clamp(6rem,20vw,22rem)] font-black tracking-tighter leading-none m-0 whitespace-nowrap uppercase">FOODIO</h2>
      </div>

      <div className="relative z-10 w-full pt-20 pb-12 flex-1 flex flex-col">
        <div className="mx-auto w-[min(1240px,calc(100%-48px))] h-full flex flex-col justify-center">
          
          {/* Top CTA Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center border-b border-stone-200/50 pb-16 mb-16">
            <div className={`transition-all duration-1000 ${active ? "opacity-100 translate-y-0" : "opacity-80 translate-y-4"}`}>
              <h2 className="text-[clamp(2.4rem,5vw,4rem)] font-black leading-[1.05] tracking-[-0.07em] mb-8 text-stone-900">
                Ready to eat? <br />
                Let's get <span className="text-orange-600 italic">started.</span>
              </h2>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="flex h-14 items-center gap-4 rounded-2xl bg-stone-950 px-6 text-white transition-all hover:bg-stone-800 hover:-translate-y-1 shadow-md hover:shadow-xl group/apple">
                   <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.96.95-2.06 1.9-3.21 1.9-1.11 0-1.46-.68-2.73-.68-1.27 0-1.66.66-2.73.66-1.11 0-2.31-1.05-3.32-2.07-2.07-2.08-3.66-5.88-3.66-9.15 0-3.32 2.05-5.07 4.02-5.07 1.05 0 2.03.73 2.68.73s1.7-.73 2.94-.73c1.28 0 2.47.46 3.23 1.25-1.21.75-2.02 2.1-2.02 3.73 0 2.04 1.7 3.37 3.51 3.37.13 0 .25 0 .37-.01-.33 1.25-.87 3.25-2.02 4.98zM12.03 5.07c0-1.84 1.5-3.33 3.33-3.33.11 0 .22 0 .32.01-.13 1.91-1.66 3.41-3.51 3.41-.05 0-.1 0-.14-.01v-.08z"/></svg>
                   <div className="flex flex-col leading-tight">
                    <span className="text-[0.55rem] uppercase tracking-wider opacity-50">Download on the</span>
                    <span className="font-bold text-base">App Store</span>
                  </div>
                </Link>
                <Link to="/register" className="flex h-14 items-center gap-4 rounded-2xl bg-stone-950 px-6 text-white transition-all hover:bg-stone-800 hover:-translate-y-1 shadow-md hover:shadow-xl group/play">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M5.929 1.58L10.37 6.02v.01l4.45 4.45-.04.04 4.19 2.39c1.07.61 1.07 1.62 0 2.23l-4.13 2.36-.06.06-4.44 4.44v.01l-4.44 4.44c-.7.71-1.39.4-1.54-.51L3.02 3.2c-.17-.91.43-1.31 1.1-.96l1.809.94Zm1.565 12.42 2.876-2.876-2.876-2.876V14Zm1.414-1.414 2.876 2.876 2.876-2.876-2.876-2.876-2.876 2.876Zm5.752 4.338 2.876-1.462-2.876-1.414v2.876Zm0-8.676 2.876 1.414-2.876 1.462V8.248Z"/></svg>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[0.55rem] uppercase tracking-wider opacity-50">Get it on</span>
                    <span className="font-bold text-base">Google Play</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className={`bg-white p-8 lg:p-10 rounded-[44px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-stone-100 transition-all duration-1000 delay-300 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
               <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-stone-400 mb-6">Stay Hungry</p>
               <h4 className="text-2xl font-black mb-8 tracking-tight text-stone-900">Be the first to know about local deals.</h4>
               <form className="flex flex-col gap-3">
                  <input type="email" placeholder="Your email..." className="h-14 bg-stone-50 rounded-2xl px-6 font-bold text-sm outline-none border border-transparent focus:border-orange-500 focus:bg-white transition-all" />
                  <button className="h-14 bg-stone-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-stone-800 transition-all active:scale-95">Subscribe</button>
               </form>
            </div>
          </div>

          {/* Sinks Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
            <div className="col-span-1 lg:col-span-2">
               <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center p-2">
                   <img src={logo} className="w-full h-full object-contain brightness-0 invert" alt="logo" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-stone-900">FOODIO</span>
               </div>
               <p className="text-stone-400 font-bold text-[0.95rem] leading-relaxed max-w-sm mb-8">
                Bringing your favorite flavors to your doorstep, one delivery at a time. Join the food revolution.
               </p>
               <div className="flex gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:bg-stone-950 hover:text-white transition-all cursor-pointer">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
               {[
                 { title: "Company", links: footerLinks.company },
                 { title: "Discover", links: footerLinks.discover },
                 { title: "Support", links: footerLinks.extra },
               ].map((col) => (
                 <div key={col.title}>
                    <h5 className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-stone-950 mb-6">{col.title}</h5>
                    <ul className="flex flex-col gap-4">
                      {col.links.map(link => (
                        <li key={link}><a href="#" className="text-[0.9rem] font-bold text-stone-400 hover:text-stone-950 transition-colors">{link}</a></li>
                      ))}
                    </ul>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 w-full border-t border-stone-200/50 py-10">
        <div className="mx-auto w-[min(1240px,calc(100%-48px))] flex flex-col md:flex-row justify-between items-center gap-8 text-[0.75rem] font-bold text-stone-400 uppercase tracking-widest">
           <div className="flex gap-10">
              <a href="#" className="hover:text-stone-950 transition-colors">Privacy</a>
              <a href="#" className="hover:text-stone-950 transition-colors">Terms</a>
              <a href="#" className="hover:text-stone-950 transition-colors">Cookies</a>
           </div>
           <p>© 2026 Foodio Vietnamese Ecosystem</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
