import { ArrowLeft, CreditCard, MapPin, ChevronRight, Lock, Store, Banknote, Smartphone, Plus, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { cartService } from "../services/cartService";

function Checkout() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("delivery");
  const [payment, setPayment] = useState("card");
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const fetchCartAndPromo = async () => {
      const storeId = localStorage.getItem('lastStoreId');
      if (!storeId) {
        setIsLoading(false);
        return;
      }

      try {
        const [cartResult, promoCode] = await Promise.all([
          cartService.getCart(storeId),
          Promise.resolve(localStorage.getItem('appliedPromoCode'))
        ]);

        const cartData = cartResult.data?.items || cartResult.data || [];
        setItems(cartData);

        if (promoCode) {
          const sub = cartData.reduce((acc: any, item: any) => acc + ((item.unitPrice || item.price || 0) * (item.quantity || 1)), 0);
          try {
            const promoResult = await cartService.validatePromo(promoCode, storeId, sub);
            setDiscountAmount(promoResult.data?.discountAmount || 0);
          } catch (e) {
            console.error("Promo validation failed on checkout:", e);
            localStorage.removeItem('appliedPromoCode');
          }
        }
      } catch (err) {
        console.error("Fetch checkout error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartAndPromo();
  }, []);

  const subtotal = items.reduce((acc, item) => acc + ((item.unitPrice || item.price || 0) * (item.quantity || 1)), 0);
  const shipping = method === "delivery" ? 0 : 0;
  const total = Math.max(0, subtotal + shipping - discountAmount);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-stone-200 animate-spin mb-4" />
        <p className="text-[0.65rem] font-black text-stone-400 uppercase tracking-[0.3em]">Preparing checkout...</p>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      const storeId = localStorage.getItem('lastStoreId');
      if (!storeId) throw new Error("Store session expired");

      const appliedPromo = localStorage.getItem('appliedPromoCode') || "";

      const orderData = {
        storeId,
        serviceMethod: method,
        paymentMethod: payment,
        totalAmount: total,
        currency: "VND",
        shippingAddress: method === "delivery" ? {
          fullAddress: "8 Thu Khoa Huan Street, Ben Thanh Ward, District 1, HCM",
          latitude: 10.7725,
          longitude: 106.6980,
          receiverName: "Nguyen Van A",
          receiverPhone: "0901234567"
        } : null,
        items: items.map(it => ({ 
          productId: it.productId, 
          quantity: it.quantity,
          unitPrice: it.unitPrice || it.price
        })),
        notes: "Please deliver carefully.",
        promoCode: appliedPromo
      };

      const result = await cartService.checkout(orderData);
      const orderId = result.data?.id || result.data?.orderId || result.id;
      
      localStorage.removeItem('appliedPromoCode');
      
      if (orderId) {
        navigate(`/tracking/${orderId}`);
      } else {
        alert("Order placed successfully!");
        navigate("/");
      }
    } catch (err: any) {
      console.error("Place order failed:", err);
      alert(err.message || "Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      <Header isHeroActive={false} onMenuClick={() => {}} />

      <main className="flex-1 w-full max-w-[1020px] mx-auto px-6 py-20">
        {/* Progress Navigation - Compact */}
        <div className="flex items-center justify-between mb-12 px-1">
           <Link to="/cart" className="inline-flex items-center gap-2 group text-stone-500 hover:text-stone-950 transition-all font-black text-[0.6rem] uppercase tracking-[0.3em]">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Return to Bag
           </Link>
           <div className="flex items-center gap-6">
              <span className="text-[0.55rem] font-black text-stone-300 uppercase tracking-widest line-through">01 Bag</span>
              <span className="w-3 h-px bg-stone-100" />
              <span className="text-[0.55rem] font-black text-stone-950 uppercase tracking-widest underline underline-offset-8">02 Details</span>
              <span className="w-3 h-px bg-stone-100" />
              <span className="text-[0.55rem] font-black text-stone-300 uppercase tracking-widest">03 Success</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           {/* LEFT CONTENT */}
           <div className="lg:col-span-7 space-y-12">

              {/* Service Selection */}
              <section className="space-y-6">
                 <div className="flex items-center gap-4">
                    <span className="text-[0.65rem] font-black text-stone-950 uppercase tracking-[0.3em]">Service Method</span>
                    <div className="flex-1 h-px bg-stone-50" />
                 </div>
                 <div className="flex bg-stone-50 p-1 rounded-[20px] border border-stone-100">
                    <button
                      onClick={() => setMethod("delivery")}
                      className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-[16px] text-[0.6rem] font-black uppercase tracking-widest transition-all ${method === "delivery" ? "bg-white text-stone-950 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}
                    >
                       <MapPin className="w-3.5 h-3.5" />
                       Delivery
                    </button>
                    <button
                      onClick={() => setMethod("pickup")}
                      className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-[16px] text-[0.6rem] font-black uppercase tracking-widest transition-all ${method === "pickup" ? "bg-white text-stone-950 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}
                    >
                       <Store className="w-3.5 h-3.5" />
                       Store Pickup
                    </button>
                 </div>
              </section>

              {/* Address Segment */}
              <section className="space-y-6">
                 <div className="flex items-center gap-4">
                    <span className="text-[0.65rem] font-black text-stone-950 uppercase tracking-[0.3em]">{method === "delivery" ? "Shipping To" : "Pickup From"}</span>
                    <div className="flex-1 h-px bg-stone-50" />
                 </div>

                 <div className="p-7 rounded-[28px] border border-stone-100 bg-white hover:border-stone-950 hover:shadow-xl hover:shadow-stone-950/5 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-5">
                       <div className="flex items-center gap-2.5">
                          {method === "delivery" ? <MapPin className="w-4 h-4 text-orange-600" /> : <Store className="w-4 h-4 text-orange-600" />}
                          <h3 className="text-[0.6rem] font-black text-stone-950 uppercase tracking-widest">{method === "delivery" ? "Home Address" : "Selected Merchant Store"}</h3>
                       </div>
                       <span className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest group-hover:text-stone-950">Modify</span>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[1rem] font-black text-stone-800 tracking-tight">
                          {method === "delivery" ? "8 Thu Khoa Huan Street" : items[0]?.storeName || "Authentic Store"}
                       </p>
                       <p className="text-[0.7rem] font-bold text-stone-500 leading-relaxed uppercase tracking-wide">
                          {method === "delivery" ? "Ben Thanh Ward, District 1, HCM" : "Bến Thành, Quận 1, Hồ Chí Minh"}
                       </p>
                    </div>
                 </div>
              </section>

              {/* Payment Section */}
              <section className="space-y-6">
                 <div className="flex items-center gap-4">
                    <span className="text-[0.65rem] font-black text-stone-950 uppercase tracking-[0.3em]">Payment</span>
                    <div className="flex-1 h-px bg-stone-50" />
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setPayment("card")}
                      className={`p-6 rounded-[24px] border text-left transition-all relative ${payment === "card" ? "border-stone-950 bg-stone-950 text-white shadow-xl" : "border-stone-100 bg-white hover:border-stone-200"}`}
                    >
                       <CreditCard className={`w-5 h-5 mb-8 ${payment === "card" ? "text-orange-500" : "text-stone-300"}`} />
                       <p className="text-[0.55rem] font-black uppercase tracking-widest opacity-60">Credit / Debit Card</p>
                       <p className="text-[0.7rem] font-black mt-1 uppercase tracking-widest">VISA •••• 4242</p>
                       {payment === "card" && <div className="absolute top-5 right-5 h-1.5 w-1.5 rounded-full bg-orange-500" />}
                    </button>

                    <button
                      onClick={() => setPayment("cash")}
                      className={`p-6 rounded-[24px] border text-left transition-all relative ${payment === "cash" ? "border-stone-950 bg-stone-950 text-white shadow-xl" : "border-stone-100 bg-white hover:border-stone-200"}`}
                    >
                       <Banknote className={`w-5 h-5 mb-8 ${payment === "cash" ? "text-orange-500" : "text-stone-300"}`} />
                       <p className="text-[0.55rem] font-black uppercase tracking-widest opacity-60">Cash Payment</p>
                       <p className="text-[0.7rem] font-black mt-1 uppercase tracking-widest">Pay on Arrival</p>
                       {payment === "cash" && <div className="absolute top-5 right-5 h-1.5 w-1.5 rounded-full bg-orange-500" />}
                    </button>

                    <button
                      onClick={() => setPayment("wallet")}
                      className={`p-6 rounded-[24px] border text-left transition-all relative ${payment === "wallet" ? "border-stone-950 bg-stone-950 text-white shadow-xl" : "border-stone-100 bg-white hover:border-stone-200"}`}
                    >
                       <Smartphone className={`w-5 h-5 mb-8 ${payment === "wallet" ? "text-orange-500" : "text-stone-300"}`} />
                       <p className="text-[0.55rem] font-black uppercase tracking-widest opacity-60">Digital Wallet</p>
                       <p className="text-[0.7rem] font-black mt-1 uppercase tracking-widest">Momo / ZaloPay</p>
                       {payment === "wallet" && <div className="absolute top-5 right-5 h-1.5 w-1.5 rounded-full bg-orange-500" />}
                    </button>

                    <button className="p-6 rounded-[24px] border border-stone-100 bg-stone-50/50 flex flex-col items-center justify-center gap-3 group hover:bg-stone-100 transition-all border-dashed">
                       <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <Plus className="w-3.5 h-3.5 text-stone-400" />
                       </div>
                       <p className="text-[0.5rem] font-black text-stone-400 uppercase tracking-widest">New Method</p>
                    </button>
                 </div>
              </section>
           </div>

           {/* RIGHT CONTENT: Summary Sidebar - 80% Scale */}
           <div className="lg:col-span-5 relative">
              <div className="bg-[#fcfcff] p-8 md:p-10 rounded-[42px] border border-stone-100 shadow-[0_24px_48px_rgba(0,0,0,0.02)] sticky top-32 overflow-hidden">
                 <div className="absolute top-[-5%] right-[-5%] p-6 rotate-12 opacity-[0.03] pointer-events-none">
                    <Lock className="w-24 h-24" />
                 </div>

                 <div className="relative z-10">
                    <h2 className="text-[0.65rem] font-black text-stone-950 uppercase tracking-[0.4em] mb-10 text-center md:text-left">Order Confirmation</h2>

                    <div className="space-y-6 mb-10 relative z-10">
                       <div className="flex justify-between items-center group">
                          <span className="text-[0.55rem] font-black text-stone-500 uppercase tracking-[0.2em]">Bag Subtotal</span>
                          <span className="text-[0.8rem] font-black text-stone-950">{subtotal.toLocaleString()}đ</span>
                       </div>
                       {method === "delivery" && (
                         <div className="flex justify-between items-center group">
                           <span className="text-[0.55rem] font-black text-stone-500 uppercase tracking-[0.2em]">Delivery Fee</span>
                           <span className="text-[0.55rem] font-black text-green-600 uppercase tracking-widest px-2 py-0.5 bg-green-50 rounded-md">Free</span>
                         </div>
                       )}
                       {discountAmount > 0 && (
                         <div className="flex justify-between items-center group">
                           <span className="text-[0.55rem] font-black text-orange-600 uppercase tracking-[0.2em]">Promotion Discount</span>
                           <span className="text-[0.8rem] font-black text-orange-600">-{discountAmount.toLocaleString()}đ</span>
                         </div>
                       )}
                       <div className="flex justify-between items-center border-b border-stone-100 pb-6">
                          <span className="text-[0.55rem] font-black text-stone-500 uppercase tracking-[0.2em]">Service Fee</span>
                          <span className="text-[0.7rem] font-black text-stone-400 uppercase tracking-widest">Incl. Tax</span>
                       </div>

                       <div className="flex justify-between items-end pt-4">
                          <div>
                             <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-[0.3em] mb-1 whitespace-nowrap">Grand Total</p>
                             <p className="text-3xl font-black text-stone-950 tracking-tighter">{total.toLocaleString()}đ</p>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-stone-50 flex items-center justify-center">
                             <CheckCircle2 className="w-5 h-5 text-stone-200" />
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={handlePlaceOrder}
                      className="w-full h-16 bg-orange-600 text-white rounded-[22px] font-black uppercase tracking-[0.3em] text-[0.7rem] flex items-center justify-center gap-3 hover:bg-orange-500 transition-all shadow-xl shadow-orange-100 active:scale-95 group relative z-10"
                    >
                       Securely Place Order
                       <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <div className="mt-8 flex flex-col items-center gap-4 text-stone-400 relative z-10">
                       <div className="flex items-center gap-2.5 bg-stone-900/5 px-4 py-2 rounded-full border border-stone-100">
                          <Clock className="w-3 h-3 text-orange-600" />
                          <span className="text-[0.5rem] font-black uppercase tracking-[0.2em] text-stone-600">
                            {method === "delivery" ? "Arrival in 35-45m" : "Ready in 20-30m"}
                          </span>
                       </div>
                       <p className="text-[0.45rem] font-black uppercase tracking-[0.5em] text-stone-300">Protected by 256-bit SSL</p>
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

export default Checkout;
