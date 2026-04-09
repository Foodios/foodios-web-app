import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { generateApiMetadata } from "../utils/apiMetadata";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import OrdersHistory from "../components/profile/OrdersHistory";
import {
  User, Camera, Crown, MapPin, ArrowRight, Clock, Heart, Settings,
  Share2, HelpCircle, ChevronRight, Zap, Loader2, Star,
  Wallet, Plus, ArrowUpRight, History, ShoppingBag
} from "lucide-react";
import { userService } from "../services/userService";
import RestaurantCard from "../components/profile/RestaurantCard";

const Profile: React.FC = () => {
  const { user, updateUserAvatar } = useAuth();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [activeView, setActiveView] = useState("profile");
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<any[]>([]);
  const [isLoadingFavs, setIsLoadingFavs] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);

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

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user || activeView !== 'wallet') return;
      setIsLoadingWallet(true);
      try {
        const [balanceRes, txRes] = await Promise.all([
          userService.getWalletBalance(),
          userService.getWalletTransactions()
        ]);
        setWalletBalance(balanceRes.data?.balance || 0);
        setWalletTransactions(txRes.data?.items || txRes.data || []);
      } catch (err) {
        console.error("Fetch wallet error:", err);
      } finally {
        setIsLoadingWallet(false);
      }
    };

    fetchWallet();
  }, [user, activeView]);

  const handleTopUp = async (amount: number) => {
    if (!window.confirm(`Confirm top-up ${amount.toLocaleString()} VND to your wallet?`)) return;

    setIsLoadingWallet(true);
    try {
      await userService.topUpWallet(amount);
      const result = await userService.getWalletBalance();
      setWalletBalance(result.data?.balance || 0);
      alert("Top-up successful!");
    } catch (err) {
      console.error("Top-up error:", err);
      alert("Failed to process top-up.");
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const handleToggleFavorite = async (merchantId: string) => {
    try {
      await userService.toggleFavorite(merchantId);
      // Update local state
      setFavoriteRestaurants(prev => prev.filter(res => (res.merchantId || res.id) !== merchantId));
    } catch (err) {
      console.error("Toggle favorite error:", err);
    }
  };

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

      {/* Profile Header */}
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

      <div className="max-w-6xl mx-auto px-6 py-10 overflow-visible relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

           <div className="lg:col-span-3 space-y-5">

              {/* Membership Card */}
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

              {/* Navigation Options */}
              <div className="bg-white rounded-[28px] p-2 border border-stone-100 shadow-md">
                 {[
                    { id: 'profile', name: 'My Profile', icon: User },
                    { id: 'wallet', name: 'Wallet & Pay', icon: Wallet, count: 'Hot' },
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

           <div className="lg:col-span-9">
              {activeView === 'profile' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {[
                          { label: 'Credits', value: walletBalance !== null ? `${(walletBalance/1000).toFixed(0)}K` : '---', icon: Wallet, color: 'text-orange-600 bg-orange-50' },
                          { label: 'Orders', value: '12', icon: ShoppingBag, color: 'text-stone-950 bg-stone-50' },
                          { label: 'Points', value: (membership?.currentAvailablePoints || 0).toLocaleString(), icon: Crown, color: 'text-orange-500 bg-orange-50' },
                          { label: 'Saved', value: favoriteRestaurants.length, icon: Heart, color: 'text-red-600 bg-red-50' },
                       ].map((stat, i) => (
                          <div key={i} className="bg-white rounded-[24px] p-4 border border-stone-100 shadow-sm flex items-center gap-3 group hover:shadow-md transition-all cursor-default">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                             </div>
                             <div className="min-w-0">
                                <p className="text-[0.5rem] font-black text-stone-400 uppercase tracking-widest truncate">{stat.label}</p>
                                <p className="text-sm font-black text-stone-950 truncate">{stat.value}</p>
                             </div>
                          </div>
                       ))}
                    </div>

                    <div className="flex flex-col gap-6">
                       {/* Profile Details */}
                       <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-lg font-sans relative overflow-hidden">
                          <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] pointer-events-none">
                             <User className="w-40 h-40" />
                          </div>

                          <div className="relative z-10">
                             <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                   <div className="w-1.5 h-6 bg-orange-600 rounded-full" />
                                   <h3 className="text-sm font-black text-stone-950 uppercase tracking-[0.2em]">Identity</h3>
                                </div>
                                <button className="h-9 px-4 bg-stone-50 text-stone-950 text-[0.65rem] font-black rounded-xl border border-stone-100 uppercase tracking-widest flex items-center gap-2 hover:bg-stone-950 hover:text-white transition-all">
                                   Edit Details
                                </button>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-1.5">
                                   <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest">Legal Name</p>
                                   <p className="text-[0.95rem] font-bold text-stone-950">{user.fullName || user.name}</p>
                                </div>
                                <div className="space-y-1.5">
                                   <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest">Contact Email</p>
                                   <p className="text-[0.95rem] font-bold text-stone-950 truncate">{user.email}</p>
                                </div>
                                <div className="space-y-1.5">
                                   <p className="text-[0.55rem] font-black text-stone-400 uppercase tracking-widest">Mobile Number</p>
                                   <p className="text-[0.95rem] font-bold text-stone-950">{user.phone || '0707 071 120'}</p>
                                </div>
                             </div>

                             <div className="mt-8 pt-8 border-t border-stone-50 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                   <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-green-500" />
                                      <span className="text-[0.6rem] font-bold text-stone-400 uppercase tracking-widest">Verified Account</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                      <span className="text-[0.6rem] font-bold text-stone-950 uppercase tracking-widest">Ho Chi Minh City, VN</span>
                                   </div>
                                </div>
                                <button className="text-stone-300 hover:text-orange-600 transition-colors">
                                   <Share2 className="w-4 h-4" />
                                </button>
                             </div>
                          </div>
                       </div>

                       {/* Saved Places Card */}
                       <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-lg font-sans">
                          <div className="flex items-center justify-between mb-8">
                             <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-orange-600 rounded-full" />
                                <h4 className="text-sm font-black text-stone-950 uppercase tracking-[0.2em]">Favorites</h4>
                             </div>
                             <button onClick={() => setActiveView('favorites')} className="text-orange-600 font-black text-[0.55rem] uppercase tracking-widest hover:underline">Manage All ({favoriteRestaurants.length})</button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                             {isLoadingFavs ? (
                                <div className="col-span-full py-10 flex flex-col items-center justify-center gap-2">
                                   <Loader2 className="w-5 h-5 text-stone-200 animate-spin" />
                                   <p className="text-[0.55rem] font-bold text-stone-300 uppercase tracking-widest">Syncing...</p>
                                </div>
                             ) : favoriteRestaurants.length > 0 ? (
                                favoriteRestaurants.slice(0, 3).map((res) => (
                                   <RestaurantCard
                                      key={res.merchantId || res.id}
                                      restaurant={res}
                                      onToggleFavorite={handleToggleFavorite}
                                      isFavorite={true}
                                   />
                                ))
                             ) : (
                                <div className="col-span-full flex flex-col items-center justify-center border-2 border-dashed border-stone-50 rounded-[24px] p-10">
                                   <Heart className="w-8 h-8 text-stone-100 mb-3" />
                                   <p className="text-[0.65rem] font-bold text-stone-300 italic uppercase">Your favorites list is empty</p>
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {activeView === 'orders' && <OrdersHistory />}

              {activeView === 'favorites' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="bg-white rounded-[40px] p-8 md:p-10 border border-stone-100 shadow-xl font-sans min-h-[600px]">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                         <div>
                            <div className="flex items-center gap-3 mb-2">
                               <div className="w-2 h-8 bg-orange-600 rounded-full" />
                               <h3 className="text-xl md:text-2xl font-black text-stone-950 uppercase tracking-tight italic">Saved Places</h3>
                            </div>
                            <p className="text-[0.7rem] font-bold text-stone-400 uppercase tracking-[0.2em]">{favoriteRestaurants.length} Restaurants safely stored in your vault</p>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="px-4 py-2 bg-stone-50 rounded-xl text-[0.65rem] font-black text-stone-500 uppercase tracking-widest border border-stone-100">
                               Sort: Recent
                            </span>
                         </div>
                      </div>

                      {favoriteRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           {favoriteRestaurants.map((res) => (
                              <RestaurantCard
                                 key={res.merchantId || res.id}
                                 restaurant={res}
                                 onToggleFavorite={handleToggleFavorite}
                                 isFavorite={true}
                              />
                           ))}
                        </div>
                      ) : (
                        <div className="py-32 text-center animate-pulse">
                           <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-dashed border-stone-200">
                              <Heart className="w-10 h-10 text-stone-200" />
                           </div>
                           <h4 className="text-stone-950 font-black uppercase text-lg italic tracking-tight">Vault is empty</h4>
                           <p className="text-stone-400 font-bold text-[0.7rem] uppercase tracking-[0.2em] mt-3 max-w-xs mx-auto">Start exploring the finest cuisines and save them to your custom list.</p>
                           <Link to="/pick-it-up" className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-orange-600 text-white rounded-2xl text-[0.7rem] font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg active:scale-95">
                              Discover Restaurants <ArrowRight className="w-4 h-4" />
                           </Link>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {activeView === 'wallet' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Balance Card */}
                        <div className="bg-stone-950 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/5 min-h-[220px]">
                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-orange-600/10 rounded-full blur-[80px]" />
                            <div className="relative z-10 flex flex-col h-full">
                                {isLoadingWallet && (
                                   <div className="absolute inset-0 z-20 bg-stone-950/40 backdrop-blur-[2px] flex items-center justify-center -m-8 rounded-[40px]">
                                      <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                                   </div>
                                )}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                                        <Wallet className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-400">Main Balance</span>
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-4xl font-black tracking-tight mb-2">
                                       {walletBalance !== null ? walletBalance.toLocaleString() : "---"}
                                       <span className="text-lg text-stone-600 ml-2 font-black uppercase">VND</span>
                                    </h1>
                                    <p className="text-[0.65rem] font-bold text-stone-500 uppercase tracking-widest">Active foodio credits</p>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                      onClick={() => handleTopUp(500000)}
                                      disabled={isLoadingWallet}
                                      className="flex-1 h-12 bg-orange-600 text-white rounded-2xl text-[0.7rem] font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Plus className="w-4 h-4" /> Top up
                                    </button>
                                    <button className="h-12 w-12 bg-white/5 text-white rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Top up & Cards */}
                        <div className="bg-white rounded-[40px] p-8 border border-stone-100 shadow-lg flex flex-col justify-between">
                            <div>
                                <h3 className="text-[0.7rem] font-black text-stone-950 uppercase tracking-[0.2em] mb-6">Quick Top up</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {[100000, 200000, 500000].map(amount => (
                                        <button
                                          key={amount}
                                          disabled={isLoadingWallet}
                                          onClick={() => handleTopUp(amount)}
                                          className="h-12 rounded-2xl border border-stone-100 bg-stone-50 text-[0.7rem] font-black text-stone-950 hover:bg-stone-950 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                        >
                                            {amount / 1000}K
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded-[40px] p-8 border border-stone-100 shadow-lg min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-sm font-black text-stone-950 uppercase tracking-[0.2em]">Transaction History</h3>
                                <p className="text-[0.6rem] font-bold text-stone-400 mt-1 uppercase tracking-widest">Your recent wallet activity</p>
                            </div>
                            <button className="h-10 w-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-950 transition-colors">
                                <History className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {walletTransactions.length > 0 ? (
                                walletTransactions.map((tx, index) => {
                                    // Map backend transaction types to UI
                                    const isPositive = tx.amount > 0 || tx.type === 'TOP_UP' || tx.type === 'REFUND' || tx.type === 'CASHBACK';
                                    const amountStr = tx.amount.toLocaleString();

                                    let Icon = ShoppingBag;
                                    let color = "text-stone-950 bg-stone-50";

                                    if (tx.type === 'TOP_UP') {
                                        Icon = Plus;
                                        color = "text-green-600 bg-green-50";
                                    } else if (tx.type === 'CASHBACK' || tx.type === 'REFUND') {
                                        Icon = Star;
                                        color = "text-orange-600 bg-orange-50";
                                    }

                                    return (
                                        <div key={tx.id || index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50/50 transition-all border border-transparent hover:border-stone-100 group">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-inner ${color}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-stone-950 uppercase italic tracking-tight">{tx.description || tx.name || 'Transaction'}</h4>
                                                    <p className="text-[0.6rem] font-bold text-stone-400 uppercase tracking-widest">
                                                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-GB') : 'Recently'} • {tx.type}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`text-sm font-black ${isPositive ? 'text-green-600' : 'text-stone-950'}`}>
                                                {isPositive ? '+' : '-'}{amountStr}đ
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-20 text-center">
                                    <p className="text-[0.65rem] font-black text-stone-300 uppercase italic">No transactions found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
              )}

              {['address', 'settings', 'help'].includes(activeView) && (
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
