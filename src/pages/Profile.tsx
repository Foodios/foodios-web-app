import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { generateApiMetadata } from "../utils/apiMetadata";
import { 
  User, Camera, Crown, Star, MapPin, ArrowRight, Clock, Heart, Settings, 
  CreditCard, Share2, HelpCircle, ChevronRight, Zap, Loader2
} from "lucide-react";

const Profile: React.FC = () => {
  const { user, updateUserAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-stone-500 font-medium text-lg">Please log in to view your profile.</p>
      </div>
    );
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Optional: Validation
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file.");
      return;
    }

    setIsUploading(true);
    const metadata = generateApiMetadata("ONL");
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      alert("Session expired. Please log in again.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('data.file', file);
    formData.append('data.folder', `foodios/avatars/${user.id}`);
    formData.append('data.publicId', `avatar-${Date.now()}`);
    formData.append('requestId', metadata.requestId);
    formData.append('requestDateTime', metadata.requestDateTime);
    formData.append('channel', metadata.channel);

    try {
      const response = await fetch("http://localhost:8080/api/v1/media/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const imageUrl = result.data.secureUrl || result.data.url;
        
        // STEP 2: Update Profile in Database
        const updateMetadata = generateApiMetadata("ONL");
        const updateResponse = await fetch("http://localhost:8080/api/v1/users/profile/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            ...updateMetadata,
            data: {
              userId: user.id,
              fullName: user.fullName || user.name,
              phone: user.phone || "",
              email: user.email,
              avatarUrl: imageUrl
            }
          })
        });

        if (updateResponse.ok) {
          updateUserAvatar(imageUrl);
        } else {
          const updateResult = await updateResponse.json();
          alert(`Failed to save to database: ${updateResult.result?.description || 'Error'}`);
        }
      } else {
        const result = await response.json();
        alert(`Upload failed: ${result.result?.description || response.statusText}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const membership = user.membership;

  const recentOrders = [
    { id: "ORD-9921", restaurant: "The Gourmet Kitchen", date: "Oct 12, 2023", total: "$42.50", status: "Delivered" },
    { id: "ORD-9875", restaurant: "Sushi Master", date: "Oct 08, 2023", total: "$28.00", status: "Delivered" },
  ];

  const favoriteRestaurants = [
    { name: "Pasta Palace", rating: 4.8, category: "Italian", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=150&q=80" },
    { name: "Burger Haven", rating: 4.5, category: "American", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=150&q=80" },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Immersive Profile Header - More Compact */}
      <div className="relative h-[220px] w-full bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/40 to-transparent z-10" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <div className="max-w-6xl mx-auto h-full px-6 relative z-20 flex flex-col justify-end pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
               <div className="relative group">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-[32px] bg-white p-1 shadow-2xl overflow-hidden transform transition-all duration-500 relative">
                    {isUploading && (
                      <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-[28px]">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover rounded-[28px]" />
                    ) : (
                      <div className="w-full h-full bg-stone-100 flex items-center justify-center rounded-[28px]">
                        <User className="w-12 h-12 text-stone-300" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleCameraClick}
                    disabled={isUploading}
                    className="absolute -bottom-1 -right-1 w-9 h-9 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed z-30"
                  >
                     <Camera className="w-5 h-5" />
                  </button>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
               </div>
               
               <div className="text-center md:text-left pb-1">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                     <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">{user.fullName || user.name}</h1>
                     <span className="px-3 py-1 bg-orange-500 text-white text-[0.6rem] font-black uppercase tracking-widest rounded-full shadow-lg shadow-orange-500/20">
                        {membership?.badge || 'Bronze Member'}
                     </span>
                  </div>
                  <p className="text-stone-400 text-base font-medium">@{user.username || 'user'} • Member since {membership ? new Date(membership.joinedAt).getFullYear() : '2026'}</p>
               </div>
            </div>
        </div>
        
        {/* Subtle background glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 overflow-visible relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           {/* SIDEBAR COLUMNS - 4/12 width */}
           <div className="lg:col-span-4 space-y-6">
              
              {/* Premium Membership Card - Metal Style - More Balanced Height */}
              <div className="bg-stone-950 rounded-[32px] p-7 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                 <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                          <Crown className="w-7 h-7 text-orange-500" />
                       </div>
                       <div className="text-right">
                          <p className="text-[0.6rem] font-black text-stone-500 uppercase tracking-widest mb-0.5">Tier Level</p>
                          <p className="text-base font-black text-orange-500 leading-none">{membership?.badge?.toUpperCase() || 'BRONZE'}</p>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       <div className="flex justify-between items-end">
                          <p className="text-stone-500 font-bold text-[0.65rem] uppercase tracking-widest">Progress</p>
                          <p className="text-xl font-black tracking-tighter">{(membership?.currentAvailablePoints || 0).toLocaleString()} <span className="text-stone-600 font-bold text-xs uppercase">Pts</span></p>
                       </div>
                       <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" 
                             style={{ width: `${((membership?.currentAvailablePoints || 0) / 1000) * 100}%` }}
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[0.6rem] font-black text-stone-500 uppercase tracking-widest mb-1">Perk</p>
                          <div className="flex items-center gap-1.5">
                             <Zap className="w-3.5 h-3.5 text-orange-400" />
                             <p className="font-black text-base">x{membership?.pointMultiplier || '1.0'}</p>
                          </div>
                       </div>
                       <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10">
                          <p className="text-[0.6rem] font-black text-stone-500 uppercase tracking-widest mb-1">Savings</p>
                          <div className="flex items-center gap-1.5">
                             <Star className="w-3.5 h-3.5 text-orange-400" />
                             <p className="font-black text-base">{membership?.discountPercent || '0'}%</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 {/* Card Texture */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              </div>

              {/* Quick Options List - Balanced Padding */}
              <div className="bg-white rounded-[32px] p-3 border border-stone-100 shadow-xl overflow-hidden">
                 {[
                    { id: 'orders', name: 'My Orders', icon: Clock, count: '12' },
                    { id: 'wallet', name: 'Wallet & Payments', icon: CreditCard },
                    { id: 'favorites', name: 'Favorite Places', icon: Heart, count: '5' },
                    { id: 'address', name: 'Delivery Addresses', icon: MapPin },
                    { id: 'settings', name: 'Security & Options', icon: Settings },
                    { id: 'help', name: 'Support', icon: HelpCircle },
                 ].map((item) => (
                    <button 
                       key={item.id}
                       className="w-full flex items-center justify-between p-3.5 rounded-2xl transition-all hover:bg-stone-50 group mb-0.5 last:mb-0"
                    >
                       <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-xl bg-stone-50 flex items-center justify-center group-hover:bg-white transition-colors border border-stone-50">
                             <item.icon className="w-4.5 h-4.5 text-stone-700 group-hover:text-orange-600" />
                          </div>
                          <span className="font-bold text-stone-900 text-[0.95rem]">{item.name}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          {item.count && (
                             <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[0.6rem] font-black rounded-md">{item.count}</span>
                          )}
                          <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-950 transition-all" />
                       </div>
                    </button>
                 ))}
              </div>
           </div>

           {/* MAIN CONTENT AREA - 8/12 width */}
           <div className="lg:col-span-8 space-y-6">
              
              {/* Profile Details Card - More Compact */}
              <div className="bg-white rounded-[40px] p-8 md:p-10 border border-stone-100 shadow-xl relative overflow-hidden">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-stone-950 uppercase tracking-tight">Profile Details</h3>
                    <button className="h-9 px-4 bg-stone-50 text-stone-950 text-sm font-bold rounded-xl border border-stone-100 hover:bg-white hover:shadow-md transition-all flex items-center gap-2">
                       <Share2 className="w-4 h-4" /> Share
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-1">
                       <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-[0.2em]">Full Name</p>
                       <p className="text-base font-bold text-stone-950">{user.fullName || user.name}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-[0.2em]">Email Address</p>
                       <p className="text-base font-bold text-stone-950">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-[0.2em]">Mobile Connected</p>
                       <p className="text-base font-bold text-stone-950">{user.phone || '0707 071 120'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-[0.2em]">Primary Region</p>
                       <p className="text-base font-bold text-stone-950">Ho Chi Minh City, VN</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Favorite Restaurants - Adjusted Row Spacing */}
                 <div className="bg-white rounded-[32px] p-7 border border-stone-100 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                       <h4 className="text-lg font-black text-stone-950">Favorite Places</h4>
                       <button className="text-orange-600 font-bold text-xs uppercase tracking-widest">View All</button>
                    </div>
                    <div className="space-y-4">
                       {favoriteRestaurants.map((res) => (
                          <div key={res.name} className="flex items-center gap-3.5 group cursor-pointer">
                             <img src={res.img} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                             <div className="flex-1">
                                <p className="font-bold text-stone-950 text-[0.95rem] line-clamp-1">{res.name}</p>
                                <p className="text-[0.7rem] text-stone-400 font-medium">{res.category} • {res.rating} ★</p>
                             </div>
                             <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                                <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-white" />
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Activity Highlights - Tighter Timeline */}
                 <div className="bg-white rounded-[32px] p-7 border border-stone-100 shadow-lg">
                    <h4 className="text-lg font-black text-stone-950 mb-6">Recent Activity</h4>
                    <div className="space-y-5 relative">
                       {recentOrders.map((order, idx) => (
                          <div key={order.id} className="relative z-10 flex gap-3.5">
                             <div className="flex flex-col items-center">
                                <div className="w-3 h-3 mt-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                                {idx !== recentOrders.length - 1 && <div className="w-px h-full bg-stone-100 my-1.5" />}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-stone-950 leading-tight">Order from {order.restaurant}</p>
                                <p className="text-[0.65rem] text-stone-400 font-medium mt-0.5">{order.date} • {order.total}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Bottom Promo - More Refined Height */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-[32px] p-8 md:p-10 text-white shadow-xl shadow-orange-100/50 relative overflow-hidden group">
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div>
                       <h3 className="text-2xl md:text-3xl font-black mb-1">Invite your friends.</h3>
                       <p className="text-white/80 font-medium text-base">Earn 500 points for every referral.</p>
                    </div>
                    <button className="h-14 px-8 bg-white text-orange-600 font-black rounded-2xl hover:bg-stone-950 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                       Get Invite Link
                    </button>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
