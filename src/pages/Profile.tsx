import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { generateApiMetadata } from "../utils/apiMetadata";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import OrdersHistory from "../components/profile/OrdersHistory";
import { 
  User, Camera, Crown, MapPin, ArrowRight, Clock, Heart, Settings, 
  Share2, HelpCircle, ChevronRight, Zap, Loader2, Star
} from "lucide-react";
import { userService } from "../services/userService";

const Profile: React.FC = () => {
  const { user, updateUserAvatar } = useAuth();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [activeView, setActiveView] = useState("profile");
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<any[]>([]);
  const [isLoadingFavs, setIsLoadingFavs] = useState(false);

  // Sync activeView with hash or state if needed
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get("view");
    if (view) {
      setActiveView(view);
    }
  }, [location]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      setIsLoadingFavs(true);
      try {
        const result = await userService.getSavedRestaurants();
        const data = result.data || {};
        const items = Array.isArray(data) ? data : (data.items || []);
        setFavoriteRestaurants(items);
      } catch (err) {
        console.error("Fetch favorites error:", err);
      } finally {
        setIsLoadingFavs(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-stone-500 font-medium text-base font-sans uppercase tracking-widest">Please log in to view your profile.</p>
      </div>
    );
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

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

  return (
    <div className="min-h-screen bg-[#fafafb] overflow-x-hidden font-sans">
      <Header isHeroActive={false} onMenuClick={() => setIsSideNavOpen(true)} />
      <SideNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />
      
      {/* Profile Header - 80% Aggressive Shrink */}
      <div className="relative h-[250px] w-full bg-stone-950 overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent z-10" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <div className="max-w-5xl mx-auto h-full px-6 relative z-20 flex flex-col justify-end pb-8 scale-[0.9] origin-bottom">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-white">
               <div className="relative group">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-[24px] bg-white p-1 shadow-2xl overflow-hidden transform transition-all duration-500 relative">
                    {isUploading && (
                      <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-[20px]">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover rounded-[20px]" />
                    ) : (
                      <div className="w-full h-full bg-stone-100 flex items-center justify-center rounded-[20px]">
                        <User className="w-10 h-10 text-stone-300" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleCameraClick}
                    disabled={isUploading}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center shadow-xl hover:scale-110 transition-transform disabled:opacity-50 z-30"
                  >
                     <Camera className="w-4 h-4" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
               </div>
               
               <div className="text-center md:text-left pb-1">
                  <div className="flex items-center justify-center md:justify-start gap-2.5 mb-0.5">
                     <h1 className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight uppercase">{user.fullName || user.name}</h1>
                     <span className="px-2.5 py-0.5 bg-orange-500 text-white text-[0.55rem] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {membership?.badge || 'Bronze'}
                     </span>
                  </div>
                  <p className="text-stone-400 text-[0.7rem] font-bold uppercase tracking-widest">@{user.username || 'user'} • Member since {membership ? new Date(membership.joinedAt).getFullYear() : '2026'}</p>
               </div>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 overflow-visible relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
           
           <div className="lg:col-span-4 space-y-5">
              
              {/* Membership Card - Smaller */}
              <div className="bg-stone-950 rounded-[28px] p-6 text-white shadow-xl relative overflow-hidden border border-white/5 font-sans">
                 <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                       <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                          <Crown className="w-6 h-6 text-orange-500" />
                       </div>
                       <div className="text-right">
                          <p className="text-[0.5rem] font-black text-stone-500 uppercase tracking-widest mb-0.5">Tier Level</p>
                          <p className="text-sm font-black text-orange-500 leading-none">{membership?.badge?.toUpperCase() || 'BRONZE'}</p>
                       </div>
                    </div>

                    <div className="space-y-3 mb-6">
                       <div className="flex justify-between items-end">
                          <p className="text-stone-500 font-bold text-[0.55rem] uppercase tracking-widest">Progress</p>
                          <p className="text-lg font-black tracking-tighter">{(membership?.currentAvailablePoints || 0).toLocaleString()} <span className="text-stone-600 font-bold text-[0.6rem] uppercase">Pts</span></p>
                       </div>
                       <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-orange-600" 
                             style={{ width: `${Math.min(((membership?.currentAvailablePoints || 0) / (membership?.pointToNextTier || 1000)) * 100, 100)}%` }}
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                       <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                          <p className="text-[0.55rem] font-black text-stone-500 uppercase tracking-widest mb-1">Perk</p>
                          <p className="font-black text-base">x{membership?.pointMultiplier || '1.0'}</p>
                       </div>
                       <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
                          <p className="text-[0.55rem] font-black text-stone-500 uppercase tracking-widest mb-1">Savings</p>
                          <p className="font-black text-base">{membership?.discountPercent || '0'}%</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Navigation Options - Sunk in */}
              <div className="bg-white rounded-[28px] p-2 border border-stone-100 shadow-md">
                 {[
                    { id: 'profile', name: 'My Profile', icon: User },
                    { id: 'orders', name: 'Order History', icon: Clock, count: 'New' },
                    { id: 'favorites', name: 'Saved Places', icon: Heart },
                    { id: 'address', name: 'Saved Addresses', icon: MapPin },
                    { id: 'settings', name: 'Account Settings', icon: Settings },
                    { id: 'help', name: 'Help Center', icon: HelpCircle },
                 ].map((item) => (
                    <button 
                      key={item.id} 
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${activeView === item.id ? 'bg-stone-950 text-white' : 'hover:bg-stone-50'}`}
                    >
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeView === item.id ? 'bg-white/10' : 'bg-stone-50 group-hover:bg-white'}`}>
                             <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-orange-500' : 'text-stone-700 group-hover:text-orange-600'}`} />
                          </div>
                          <span className={`font-bold text-[0.8rem] uppercase tracking-wide ${activeView === item.id ? 'text-white' : 'text-stone-950'}`}>{item.name}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          {item.count && (
                             <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[0.45rem] font-black rounded-md animate-pulse">{item.count}</span>
                          )}
                          <ChevronRight className={`w-3.5 h-3.5 transition-colors ${activeView === item.id ? 'text-white/20' : 'text-stone-300 group-hover:text-stone-950'}`} />
                       </div>
                    </button>
                 ))}
              </div>
           </div>

           <div className="lg:col-span-8">
              {activeView === 'profile' && (
                 <div className="space-y-6">
                    {/* Details Card */}
                    <div className="bg-white rounded-[32px] p-7 border border-stone-100 shadow-lg font-sans">
                       <div className="flex items-center justify-between mb-6">
                          <h3 className="text-sm font-black text-stone-950 uppercase tracking-[0.2em]">Profile Details</h3>
                          <button className="h-8 px-3.5 bg-stone-50 text-stone-950 text-[0.65rem] font-black rounded-lg border border-stone-100 uppercase tracking-widest flex items-center gap-2">
                             <Share2 className="w-3.5 h-3.5" /> Share
                          </button>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div className="space-y-1">
                             <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest">Full Name</p>
                             <p className="text-[0.85rem] font-bold text-stone-950">{user.fullName || user.name}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest">Email Address</p>
                             <p className="text-[0.85rem] font-bold text-stone-950 truncate">{user.email}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest">Phone Number</p>
                             <p className="text-[0.85rem] font-bold text-stone-950">{user.phone || '0707 071 120'}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest">Location</p>
                             <p className="text-[0.85rem] font-bold text-stone-950">Ho Chi Minh City, VN</p>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="bg-white rounded-[28px] p-6 border border-stone-100 shadow-md">
                          <div className="flex items-center justify-between mb-5">
                             <h4 className="text-[0.8rem] font-black uppercase tracking-widest text-stone-950">Saved Places</h4>
                             <button className="text-orange-600 font-black text-[0.55rem] uppercase tracking-widest">All</button>
                          </div>
                          <div className="space-y-3.5">
                             {isLoadingFavs ? (
                                <div className="py-4 flex flex-col items-center justify-center gap-2">
                                   <Loader2 className="w-5 h-5 text-stone-200 animate-spin" />
                                   <p className="text-[0.55rem] font-bold text-stone-300 uppercase tracking-widest">Loading...</p>
                                </div>
                             ) : favoriteRestaurants.length > 0 ? (
                                favoriteRestaurants.slice(0, 3).map((res) => (
                                   <Link to={`/restaurant/${res.merchantSlug}`} key={res.merchantId || res.id} className="flex items-center gap-3 group cursor-pointer">
                                      <img 
                                        src={res.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100"} 
                                        alt="" 
                                        className="w-11 h-11 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" 
                                      />
                                      <div className="flex-1">
                                         <p className="font-black text-stone-950 text-[0.8rem] line-clamp-1 group-hover:text-orange-600 transition-colors uppercase italic">{res.merchantName}</p>
                                         <p className="text-[0.6rem] text-stone-400 font-bold uppercase tracking-wide">
                                            {res.cuisineCategory || "Cuisine"} • {res.overallReview?.averageRating || "4.5"}★
                                         </p>
                                      </div>
                                      <ArrowRight className="w-3 h-3 text-stone-200 group-hover:text-orange-600" />
                                   </Link>
                                ))
                             ) : (
                                <div className="py-6 text-center">
                                   <p className="text-[0.65rem] font-bold text-stone-300 italic">No saved places yet.</p>
                                </div>
                             )}
                          </div>
                       </div>

                       <div className="bg-white rounded-[28px] p-7 text-white shadow-xl relative overflow-hidden group border border-white/5 bg-stone-950">
                          <div className="relative z-10 flex flex-col justify-between h-full">
                             <div>
                                <h3 className="text-xl font-black mb-1 uppercase tracking-tight italic">Invite friends.</h3>
                                <p className="text-stone-400 font-bold text-[0.6rem] uppercase tracking-[0.2em]">Earn 500 bonus pts.</p>
                             </div>
                             <button className="mt-6 h-10 px-6 bg-orange-600 text-white font-black text-[0.6rem] rounded-xl uppercase tracking-widest hover:bg-white hover:text-stone-950 transition-all shadow-xl">
                                Get Link
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {activeView === 'orders' && <OrdersHistory />}

              {activeView === 'favorites' && (
                <div className="space-y-6">
                   <div className="bg-white rounded-[32px] p-7 border border-stone-100 shadow-lg font-sans">
                      <div className="flex items-center justify-between mb-8">
                         <div>
                            <h3 className="text-sm font-black text-stone-950 uppercase tracking-[0.2em]">Saved Places</h3>
                            <p className="text-[0.6rem] font-bold text-stone-400 mt-1 uppercase tracking-widest">{favoriteRestaurants.length} Restaurants Saved</p>
                         </div>
                         <div className="flex gap-2">
                             <div className="h-2 w-8 rounded-full bg-orange-500" />
                             <div className="h-2 w-2 rounded-full bg-stone-100" />
                         </div>
                      </div>

                      {favoriteRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {favoriteRestaurants.map((res) => (
                              <Link 
                                to={`/restaurant/${res.merchantSlug}`} 
                                key={res.merchantId || res.id}
                                className="group flex items-center gap-4 p-4 rounded-2xl bg-stone-50/50 hover:bg-white border border-transparent hover:border-stone-100 hover:shadow-xl transition-all duration-500"
                              >
                                 <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-sm shrink-0 border-2 border-white">
                                    <img 
                                      src={res.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200"} 
                                      alt="" 
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h4 className="text-stone-950 font-black text-[0.9rem] uppercase italic tracking-tight group-hover:text-orange-600 transition-colors truncate">{res.merchantName}</h4>
                                    <p className="text-[0.65rem] font-bold text-stone-400 uppercase tracking-widest mt-0.5">{res.cuisineCategory || "Premium Cuisine"}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                       <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                                       <span className="text-[0.65rem] font-black text-stone-900">{res.overallReview?.averageRating || "4.5"}</span>
                                       <span className="mx-1.5 text-stone-300">•</span>
                                       <span className="text-[0.6rem] font-bold text-stone-400 uppercase tracking-widest">Saved</span>
                                    </div>
                                 </div>
                              </Link>
                           ))}
                        </div>
                      ) : (
                        <div className="py-20 text-center">
                           <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Heart className="w-8 h-8 text-stone-200" />
                           </div>
                           <h4 className="text-stone-950 font-black uppercase text-sm italic">Nothing saved yet.</h4>
                           <p className="text-stone-400 font-bold text-[0.65rem] uppercase tracking-widest mt-2 px-10">Start exploring restaurants and save your favorites here.</p>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {['wallet', 'address', 'settings', 'help'].includes(activeView) && (
                <div className="bg-white rounded-[32px] p-20 text-center border border-dashed border-stone-200 h-full flex flex-col items-center justify-center">
                   <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap className="w-8 h-8 text-stone-200" />
                   </div>
                   <p className="text-[0.6rem] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">{activeView} is coming soon</p>
                   <p className="text-[0.7rem] font-bold text-stone-300 italic">We are working on this feature.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
