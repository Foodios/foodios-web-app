import Header from "../../components/Header";
import { Store, TrendingUp, Users, ArrowRight, Globe } from "lucide-react";
import Footer from "../../components/Footer";

const RestaurantDelivery = () => {
  return (
    <div className="min-h-screen bg-stone-50 font-outfit">
      <Header isHeroActive={false} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 sm:px-10 max-w-[1200px] mx-auto">
        <div className="bg-stone-950 rounded-[40px] overflow-hidden relative min-h-[350px] flex items-center p-10 lg:p-16 group">
          <div className="absolute inset-0 opacity-30">
             <img 
               src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop" 
               alt="Restaurant Kitchen" 
               className="w-full h-full object-cover grayscale"
             />
          </div>
          <div className="relative z-10 max-w-xl">
             <span className="inline-block px-4 py-1.5 bg-orange-600 text-white rounded-full text-[0.6rem] font-black uppercase tracking-[0.2em] mb-6">For Partners</span>
             <h1 className="text-4xl lg:text-5xl font-black text-white leading-[0.95] mb-6 uppercase tracking-tighter">
                Your Restaurant <br/><span className="text-orange-500 italic">Delivered.</span>
             </h1>
             <p className="text-stone-400 text-base font-bold leading-relaxed mb-8 max-w-md">
                Reach more customers beyond your dining room. Partner with Foodio to scale your business with the industry's most reliable delivery network.
             </p>
             <button className="h-14 px-8 bg-white text-stone-950 rounded-full text-[0.7rem] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all transform active:scale-95 shadow-2xl">
                Become a Partner
             </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-6 sm:px-10 max-w-3xl mx-auto">
         <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-sm border border-stone-100">
            <h2 className="text-2xl font-black text-stone-950 mb-8 leading-none">Why Partner with us?</h2>
            
            <div className="space-y-10">
               {[
                 {
                   title: "Access New Customers",
                   desc: "Showcase your menu to thousands of food lovers in your city. Our platform handles the discovery so you can focus on cooking.",
                   icon: <Users className="w-5 h-5 text-orange-600" />
                 },
                 {
                   title: "Increase Revenue",
                   desc: "Add an extra stream of income without increasing your overhead. Most partners see a 30% increase in revenue after joining.",
                   icon: <TrendingUp className="w-5 h-5 text-orange-600" />
                 },
                 {
                   title: "Intelligent Marketing",
                   desc: "Benefit from our data-driven marketing campaigns and loyalty programs that keep customers coming back to your store.",
                   icon: <Globe className="w-5 h-5 text-orange-600" />
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

            <div className="mt-16 p-10 bg-orange-600 rounded-[32px] text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 scale-125 rotate-12 transition-transform group-hover:scale-150">
                  <Store className="w-32 h-32" />
               </div>
               <h4 className="text-xl font-black mb-3 relative z-10 uppercase tracking-tight">Ready to serve more people?</h4>
               <p className="text-orange-50 font-bold mb-6 relative z-10 max-w-xs text-sm">Our merchant hub provides all the tools you need to manage orders, analytics, and menus in one place.</p>
               <button className="h-12 px-6 bg-black text-white rounded-xl text-[0.65rem] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2">
                  Start Application <ArrowRight className="w-3 h-3" />
               </button>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default RestaurantDelivery;
