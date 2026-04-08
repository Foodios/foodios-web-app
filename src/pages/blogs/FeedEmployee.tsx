import Header from "../../components/Header";
import { Clock, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import Footer from "../../components/Footer";

const FeedEmployee = () => {
  return (
    <div className="min-h-screen bg-stone-50 font-outfit">
      <Header isHeroActive={false} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 sm:px-10 max-w-[1200px] mx-auto">
        <div className="bg-stone-950 rounded-[40px] overflow-hidden relative min-h-[350px] flex items-center p-10 lg:p-16 group">
          <div className="absolute inset-0 opacity-30">
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
               alt="Corporate Lunch" 
               className="w-full h-full object-cover grayscale"
             />
          </div>
          <div className="relative z-10 max-w-xl">
             <span className="inline-block px-4 py-1.5 bg-orange-600 text-white rounded-full text-[0.6rem] font-black uppercase tracking-[0.2em] mb-6">For Businesses</span>
             <h1 className="text-4xl lg:text-5xl font-black text-white leading-[0.95] mb-6 uppercase tracking-tighter">
                Feed your <br/><span className="text-orange-500 italic">Employees.</span>
             </h1>
             <p className="text-stone-400 text-base font-bold leading-relaxed mb-8 max-w-md">
                The most flexible and delightful office food solution. Corporate meals, event catering, and employee perks all in one platform.
             </p>
             <button className="h-14 px-8 bg-white text-stone-950 rounded-full text-[0.7rem] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all transform active:scale-95 shadow-2xl">
                Get Started with Corporate
             </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-6 sm:px-10 max-w-3xl mx-auto">
         <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-sm border border-stone-100">
            <h2 className="text-2xl font-black text-stone-950 mb-8 leading-none">Why Foodio for Business?</h2>
            
            <div className="space-y-10">
               {[
                 {
                   title: "Simplify Office Catering",
                   desc: "From daily lunch programs to large corporate events, we handle the logistics so you can focus on building your team culture.",
                   icon: <Clock className="w-5 h-5 text-orange-600" />
                 },
                 {
                   title: "Boost Productivity",
                   desc: "Happy and well-fed employees are more engaged and productive. Eliminate the lunchtime stress and provide a benefit everyone loves.",
                   icon: <Heart className="w-5 h-5 text-orange-600" />
                 },
                 {
                   title: "Consolidated Billing",
                   desc: "Get one invoice for all your company's meal expenses. Simplify your accounting and control your budget with ease.",
                   icon: <ShieldCheck className="w-5 h-5 text-orange-600" />
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

            <div className="mt-16 p-8 bg-stone-950 rounded-[32px] text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[50px] rounded-full" />
               <h4 className="text-xl font-black mb-3 relative z-10">Ready to transform your workplace?</h4>
               <p className="text-stone-400 font-bold mb-6 relative z-10 text-xs">Join over 500+ companies that trust Foodio for their office meals.</p>
               <button className="flex items-center gap-2 text-orange-500 font-black uppercase text-[0.6rem] tracking-widest hover:text-white transition-colors">
                  Speak to our sales team <ArrowRight className="w-3 h-3" />
               </button>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeedEmployee;
