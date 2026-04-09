import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard, ChevronRight, Tag, Gift, CheckCircle2, Clock, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideNav from "../components/SideNav";
import { useState, useEffect } from "react";
import { cartService } from "../services/cartService";

function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    const storeId = localStorage.getItem('lastStoreId');
    if (!storeId) return;

    try {
      const result = await cartService.validatePromo(promoCode.trim(), storeId, subtotal);
      // Lấy chính xác số tiền được giảm từ trường discountAmount
      const discount = result.data?.discountAmount || 0;
      setDiscountAmount(discount);
      localStorage.setItem('appliedPromoCode', promoCode.trim());
      alert(`Success! You saved ${discount.toLocaleString()}đ`);
    } catch (err: any) {
      alert(err.message || "Invalid promo code");
      setDiscountAmount(0);
      localStorage.removeItem('appliedPromoCode');
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      const storeId = localStorage.getItem('lastStoreId');
      if (!storeId) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await cartService.getCart(storeId);
        const cartData = result.data?.items || result.data || [];
        const mappedItems = cartData.map((item: any) => ({
          cartItemId: item.id,
          id: item.productId,
          name: item.productName,
          price: item.unitPrice || 0,
          quantity: item.quantity || 1,
          image: item.imageUrl || null,
          restaurant: item.storeName || "Selected Store"
        }));
        setItems(mappedItems);
      } catch (err: any) {
        console.error("Fetch cart error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discountAmount);

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-stone-200 animate-spin mb-4" />
        <p className="text-[0.65rem] font-black text-stone-300 uppercase tracking-[0.3em]">Curating your bag...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-500">
           <ShoppingBag className="w-7 h-7" />
        </div>
        <p className="text-[0.65rem] font-black text-stone-950 uppercase tracking-[0.2em] mb-4">Something went wrong</p>
        <p className="text-stone-500 text-sm mb-8 max-w-xs">{error}</p>
        <Link to="/" className="text-[0.7rem] font-black text-orange-600 underline underline-offset-8 uppercase tracking-widest">Back to Discover</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      <Header isHeroActive={false} onMenuClick={() => setIsSideNavOpen(true)} />
      <SideNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />
      
      <main className="flex-1 w-full max-w-[1020px] mx-auto px-6 py-20">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-12 px-1">
           <Link to="/pick-it-up" className="inline-flex items-center gap-2 group text-stone-600 hover:text-stone-950 transition-all font-black text-[0.6rem] uppercase tracking-[0.3em]">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Return to Menu
           </Link>
           <div className="flex items-center gap-3 bg-stone-50/80 px-4 py-2 rounded-full border border-stone-100 backdrop-blur-sm">
              <Clock className="w-3 h-3 text-stone-500" />
              <span className="text-[0.55rem] font-black text-stone-600 uppercase tracking-widest">Est: 35-45 mins</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           
           {/* LEFT: Items List */}
           <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center gap-3 mb-8">
                 <h1 className="text-2xl font-black text-stone-950 uppercase tracking-tight">Your Bag</h1>
                 <span className="px-2 py-0.5 bg-stone-100 rounded-md text-[0.6rem] font-black text-stone-600">{items.length} ITMS</span>
              </div>

              <div className="space-y-0">
                 {items.map((item, idx) => (
                   <div key={item.id} className={`py-8 flex items-center gap-6 ${idx !== items.length - 1 ? "border-b border-stone-50" : ""}`}>
                      <div className="h-24 w-24 bg-stone-50 rounded-[28px] flex items-center justify-center overflow-hidden shadow-sm border border-stone-100 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 duration-500 shrink-0">
                         {item.image ? (
                           <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                         ) : (
                           <div className="text-4xl text-stone-200">🥘</div>
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-[0.55rem] font-black text-stone-500 uppercase tracking-[0.2em] mb-1 truncate">{item.restaurant}</p>
                         <h3 className="text-[1.05rem] font-black text-stone-950 tracking-tight leading-tight mb-4 truncate">{item.name}</h3>
                         
                         <div className="flex items-center gap-8">
                            <div className="flex items-center gap-4 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100">
                               <button onClick={() => updateQuantity(item.id, -1)} className="p-0.5 text-stone-400 hover:text-stone-950 transition-colors"><Minus className="w-3 h-3" /></button>
                               <span className="text-[0.7rem] font-black text-stone-950 w-4 text-center">{item.quantity}</span>
                               <button onClick={() => updateQuantity(item.id, 1)} className="p-0.5 text-stone-400 hover:text-stone-950 transition-colors"><Plus className="w-3 h-3" /></button>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-[0.55rem] font-black text-stone-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1.5 group">
                               <Trash2 className="w-3 h-3 transition-transform group-hover:scale-110" />
                               Remove
                            </button>
                         </div>
                      </div>
                      <div className="text-right shrink-0">
                         <span className="text-base font-black text-stone-950 tracking-tight">{ (item.price * item.quantity).toLocaleString() }đ</span>
                      </div>
                   </div>
                 ))}

                 {items.length === 0 && (
                   <div className="py-24 text-center">
                      <div className="w-16 h-16 bg-stone-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                         <ShoppingBag className="w-6 h-6 text-stone-200" />
                      </div>
                      <p className="text-[0.65rem] font-black text-stone-500 uppercase tracking-[0.3em] mb-8">Your bag is longing for something delicious</p>
                      <Link to="/" className="inline-flex h-11 px-8 items-center bg-stone-950 text-white rounded-xl text-[0.6rem] font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-stone-100">Start Exploring</Link>
                   </div>
                 )}
              </div>

              {/* Upsell */}
              <div className="mt-16 pt-10 border-t border-stone-100">
                 <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    <h2 className="text-[0.65rem] font-black text-stone-950 uppercase tracking-[0.3em]">Elevate your palette</h2>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="flex items-center gap-4 p-4 rounded-2xl border border-stone-50 bg-stone-50/30 hover:bg-white hover:border-stone-950 hover:shadow-xl hover:shadow-stone-950/5 transition-all text-left group overflow-hidden relative">
                       <span className="text-3xl opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">🍹</span>
                       <div className="flex-1 min-w-0">
                          <p className="text-[0.6rem] font-black text-stone-950 uppercase tracking-widest truncate">Cold-Brew Hibiscus</p>
                          <p className="text-[0.55rem] font-bold text-stone-600 uppercase mt-0.5 tracking-wider">45,000đ • Add</p>
                       </div>
                    </button>
                    <button className="flex items-center gap-4 p-4 rounded-2xl border border-stone-50 bg-stone-50/30 hover:bg-white hover:border-stone-950 hover:shadow-xl hover:shadow-stone-950/5 transition-all text-left group overflow-hidden relative">
                       <span className="text-3xl opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">🍰</span>
                       <div className="flex-1 min-w-0">
                          <p className="text-[0.6rem] font-black text-stone-950 uppercase tracking-widest">Matcha Tiramisu</p>
                          <p className="text-[0.55rem] font-bold text-stone-600 uppercase mt-0.5 tracking-wider">85,000đ • Add</p>
                       </div>
                    </button>
                 </div>
              </div>
           </div>

           {/* RIGHT: Summary */}
           <div className="lg:col-span-5 relative">
              <div className="bg-[#fcfcff] p-8 md:p-10 rounded-[42px] border border-stone-100 shadow-[0_24px_48px_rgba(0,0,0,0.02)] sticky top-32 overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-[60px] opacity-60 -mr-16 -mt-16" />
                 
                 <div className="relative z-10">
                    <div className="mb-10 flex items-center justify-between">
                       <h2 className="text-[0.65rem] font-black text-stone-950 uppercase tracking-[0.4em]">Order Summary</h2>
                       <div className="h-6 w-6 rounded-full bg-orange-50 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                       </div>
                    </div>

                    <div className="space-y-6 mb-10">
                       <div className="flex justify-between items-center group">
                          <span className="text-[0.55rem] font-black text-stone-600 uppercase tracking-[0.2em]">Bag Subtotal</span>
                          <span className="text-[0.8rem] font-black text-stone-950 ">{subtotal.toLocaleString()}đ</span>
                       </div>
                       <div className="flex justify-between items-center group">
                          <span className="text-[0.55rem] font-black text-stone-600 uppercase tracking-[0.2em]">Priority Shipping</span>
                          <span className="text-[0.55rem] font-black text-green-600 uppercase tracking-[0.2em] px-2 py-0.5 bg-green-50 rounded-md">Free</span>
                       </div>
                       {discountAmount > 0 && (
                         <div className="flex justify-between items-center group animate-in fade-in slide-in-from-top-2 duration-500">
                           <span className="text-[0.55rem] font-black text-orange-600 uppercase tracking-[0.2em]">Promotion Discount</span>
                           <span className="text-[0.8rem] font-black text-orange-600">-{discountAmount.toLocaleString()}đ</span>
                         </div>
                       )}
                       <div className="flex justify-between items-center p-3.5 bg-stone-950/5 rounded-2xl border border-stone-100/50">
                           <div className="flex items-center gap-2">
                              <Gift className="w-3.5 h-3.5 text-orange-600" />
                              <span className="text-[0.55rem] font-black text-stone-600 uppercase tracking-[0.2em]">Est. Reward Pts</span>
                           </div>
                          <span className="text-[0.8rem] font-black text-orange-600">+{Math.floor(total/10000)}</span>
                       </div>
                    </div>

                    <div className="mb-10 group">
                       <div className="flex items-center gap-3 border-b border-stone-200 focus-within:border-stone-950 transition-all pb-2.5 px-1">
                          <Tag className="w-3.5 h-3.5 text-stone-500 group-focus-within:text-orange-600" />
                          <input 
                            placeholder="HAVE A PROMO CODE?" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            className="flex-1 bg-transparent text-[0.6rem] font-black uppercase tracking-[0.2em] outline-none placeholder:text-stone-400" 
                          />
                          <button 
                            onClick={handleApplyPromo}
                            className="text-[0.55rem] font-black text-stone-950 hover:text-orange-600 transition-colors uppercase tracking-widest"
                          >
                            Apply
                          </button>
                       </div>
                    </div>

                    <div className="flex justify-between items-end mb-10 pt-6 border-t border-stone-100/50">
                       <div>
                          <p className="text-[0.55rem] font-black text-stone-500 uppercase tracking-[0.3em] mb-1">Grand Total</p>
                          <p className="text-2xl font-black text-stone-950 tracking-tighter ">{total.toLocaleString()}đ</p>
                       </div>
                       <div className="h-10 w-10 bg-white rounded-xl border border-stone-50 flex items-center justify-center text-stone-300 shadow-sm">
                          <CreditCard className="w-5 h-5" />
                       </div>
                    </div>

                    <Link to="/checkout" className="w-full h-16 bg-stone-950 text-white rounded-[22px] font-black uppercase tracking-[0.3em] text-[0.7rem] flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-stone-200 active:scale-95 group">
                       Verify and Pay
                       <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <div className="mt-8 flex flex-col items-center gap-4 text-stone-400">
                       <div className="flex items-center gap-4 opacity-40 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0">
                          <span className="text-[0.5rem] font-black tracking-widest text-stone-950">VISA</span>
                          <span className="text-[0.5rem] font-black tracking-widest text-stone-950">MC</span>
                          <span className="text-[0.5rem] font-black tracking-widest text-stone-950">APPLE</span>
                       </div>
                       <p className="text-[0.45rem] font-black uppercase tracking-[0.4em] text-stone-400">Encrypted • Secure • Foodio</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <Footer snapping={false} />
    </div>
  );
}

export default Cart;
