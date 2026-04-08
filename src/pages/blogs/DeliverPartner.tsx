import Header from "../../components/Header";
import { DollarSign, Calendar, ArrowRight, Shield, Award } from "lucide-react";
import Footer from "../../components/Footer";

const DeliverPartner = () => {
  return (
    <div className="min-h-screen bg-stone-50 font-outfit">
      <Header isHeroActive={false} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 sm:px-10 max-w-[1200px] mx-auto">
        <div className="bg-stone-950 rounded-[40px] overflow-hidden relative min-h-[350px] flex items-center p-10 lg:p-16 group">
          <div className="absolute inset-0 opacity-30">
             <img 
               src="https://images.unsplash.com/photo-1595152230461-85166718d0cc?q=80&w=2070&auto=format&fit=crop" 
               alt="Delivery Rider" 
               className="w-full h-full object-cover grayscale"
             />
          </div>
          <div className="relative z-10 max-w-xl">
             <span className="inline-block px-4 py-1.5 bg-orange-600 text-white rounded-full text-[0.6rem] font-black uppercase tracking-[0.2em] mb-6">For Couriers</span>
             <h1 className="text-4xl lg:text-5xl font-black text-white leading-[0.95] mb-6 uppercase tracking-tighter">
                Deliver with <br/><span className="text-orange-500 italic">Foodios.</span>
             </h1>
             <p className="text-stone-400 text-base font-bold leading-relaxed mb-8 max-w-md">
                Be your own boss. Enjoy the freedom and flexibility of delivering whenever and wherever you want. Earn competitive pay and great incentives.
             </p>
             <button className="h-14 px-8 bg-white text-stone-950 rounded-full text-[0.7rem] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all transform active:scale-95 shadow-2xl">
                Sign Up to Deliver
             </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-6 sm:px-10 max-w-3xl mx-auto">
         <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-sm border border-stone-100">
            <h2 className="text-2xl font-black text-stone-950 mb-8 leading-none">Why Drive with Foodios?</h2>
            
            <div className="space-y-10">
               {[
                 {
                   title: "Work When You Want",
                   desc: "You have your own schedule. Whether it's morning, evening or weekends — you decide when to start and when to stop.",
                   icon: <Calendar className="w-5 h-5 text-orange-600" />
                 },
                 {
                   title: "Competitive Earnings",
                   desc: "Fast payments and transparent earnings. Keep 100% of your tips and benefit from our peak-hour incentive bonuses.",
                   icon: <DollarSign className="w-5 h-5 text-orange-600" />
                 },
                 {
                   title: "Supportive Network",
                   desc: "Get 24/7 support while you're on the road. We provide professional insurance and safety equipment for all our partners.",
                   icon: <Shield className="w-5 h-5 text-orange-600" />
                 }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 group">
                    <div className="h-12 w-12 bg-stone-50 rounded-xl flex items-center justify-center shrink-0 border border-stone-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-all">
                       {item.icon}
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-stone-950 mb-2">{item.title}</h3>
                       <p className="text-stone-500 font-bold leading-relaxed text-sm">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-16 p-8 bg-stone-50 rounded-[32px] border border-stone-100 flex flex-col md:flex-row items-center gap-8">
               <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center shadow-md border border-stone-100 shrink-0">
                  <Award className="w-10 h-10 text-orange-600" />
               </div>
               <div className="text-center md:text-left">
                  <h4 className="text-lg font-black text-stone-950 mb-1 italic uppercase">Rewards Program</h4>
                  <p className="text-stone-500 font-bold text-xs mb-3">Complete more orders to reach Elite status and unlock exclusive benefits, discounts at partner restaurants, and lower fees.</p>
                  <button className="flex items-center gap-2 text-orange-600 font-black uppercase text-[0.6rem] tracking-[0.2em] hover:text-stone-950 transition-colors mx-auto md:mx-0">
                     Explore Benefits <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default DeliverPartner;
