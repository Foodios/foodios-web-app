import { 
  ArrowLeft, 
  Save, 
  MapPin,
  Clock,
  Globe,
  Camera,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { storeService } from "../../../services/storeService";
import ImageUpload from "../forms/ImageUpload";

function StoreEdit() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { merchant } = useOutletContext<{ merchant: any }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    phone: "",
    status: "DRAFT",
    timeZone: "Asia/Ho_Chi_Minh",
    heroImageUrl: "",
    opensAt: "08:00:00",
    closesAt: "22:00:00",
    address: {
      contactName: "",
      contactPhone: "",
      line1: "",
      line2: "",
      ward: "",
      district: "",
      city: "Ho Chi Minh City",
      province: "Ho Chi Minh",
      postalCode: "700000",
      country: "VN",
      latitude: 0,
      longitude: 0
    }
  });

  useEffect(() => {
    const loadStore = async () => {
      const merchantId = merchant?.id || merchant?.merchantId;
      if (!merchantId || !storeId) return;

      try {
        const result = await storeService.getStoreDetail(storeId, merchantId);
        if (result.data) {
          // Flatten address if it's a string from legacy data, but usually it's an object now
          const storeData = result.data;
          setFormData({
            ...storeData,
            address: typeof storeData.address === 'object' ? {
              ...formData.address,
              ...storeData.address
            } : {
              ...formData.address,
              line1: storeData.address
            }
          });
        }
      } catch (err) {
        console.error("Load store error:", err);
        setError("Failed to load store data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStore();
  }, [storeId, merchant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await storeService.updateStore(storeId!, formData);
      navigate(`/merchant/stores/${storeId}`);
    } catch (err: any) {
      setError(err.message || "Failed to update store");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-stone-100 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
       {/* Header */}
       <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-stone-100 hover:bg-stone-50 transition-all">
                <ArrowLeft className="w-4 h-4 text-stone-400" />
             </button>
             <div>
                <h1 className="text-2xl font-black text-stone-950 tracking-tight">Edit Branch</h1>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Configure your outlet details</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="h-12 px-6 rounded-xl border border-stone-100 text-[0.7rem] font-black uppercase tracking-widest hover:bg-stone-50 transition-all">Cancel</button>
             <button 
                onClick={handleSubmit}
                disabled={isSaving}
                className="h-12 px-8 rounded-xl bg-stone-950 text-white text-[0.7rem] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-stone-800 disabled:opacity-50 transition-all shadow-xl shadow-stone-200"
             >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
             </button>
          </div>
       </header>

       {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[0.7rem] font-bold uppercase tracking-wider">
             <AlertCircle className="w-5 h-5" />
             {error}
          </div>
       )}

       <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
          {/* Left Column: Basic Info */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
             <section className="bg-white rounded-[32px] border border-stone-100 p-8 shadow-sm">
                <h2 className="text-[0.7rem] font-black text-stone-950 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                   <Globe className="w-4 h-4 text-orange-600" />
                   Basic Information
                </h2>
                
                <div className="grid grid-cols-2 gap-6">
                   <div className="col-span-2 space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Branch Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold text-sm"
                        required
                      />
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Slug Identifier</label>
                      <input 
                        type="text" 
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold text-sm text-orange-600"
                        placeholder="branch-slug"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold text-sm"
                        required
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Status</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold text-sm appearance-none cursor-pointer"
                      >
                         <option value="ACTIVE">Active (Public)</option>
                         <option value="DRAFT">Draft (Hidden)</option>
                         <option value="INACTIVE">Inactive (Closed)</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Time Zone</label>
                      <input 
                        type="text" 
                        value={formData.timeZone}
                        onChange={(e) => setFormData({...formData, timeZone: e.target.value})}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white transition-all font-bold text-sm"
                      />
                   </div>
                </div>
             </section>

             <section className="bg-white rounded-[32px] border border-stone-100 p-8 shadow-sm">
                <h2 className="text-[0.7rem] font-black text-stone-950 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                   <MapPin className="w-4 h-4 text-orange-600" />
                   Address Details
                </h2>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Contact Name</label>
                      <input 
                        type="text" 
                        name="contactName"
                        value={formData.address.contactName}
                        onChange={handleAddressChange}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white transition-all font-bold text-sm"
                        placeholder="Manager Name"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Contact Phone</label>
                      <input 
                        type="tel" 
                        name="contactPhone"
                        value={formData.address.contactPhone}
                        onChange={handleAddressChange}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white transition-all font-bold text-sm"
                        placeholder="Manager Phone"
                      />
                   </div>
                   <div className="col-span-2 space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Street Address (Line 1)</label>
                      <input 
                        type="text" 
                        name="line1"
                        value={formData.address.line1}
                        onChange={handleAddressChange}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white transition-all font-bold text-sm"
                        required
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Ward</label>
                      <input 
                        type="text" 
                        name="ward"
                        value={formData.address.ward}
                        onChange={handleAddressChange}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white transition-all font-bold text-sm"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">District</label>
                      <input 
                        type="text" 
                        name="district"
                        value={formData.address.district}
                        onChange={handleAddressChange}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white transition-all font-bold text-sm"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">City</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.address.city}
                        onChange={handleAddressChange}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white transition-all font-bold text-sm"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Province</label>
                      <input 
                        type="text" 
                        name="province"
                        value={formData.address.province}
                        onChange={handleAddressChange}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white transition-all font-bold text-sm"
                      />
                   </div>
                </div>
             </section>
          </div>

          {/* Right Column: Visuals & Schedule */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
             <section className="bg-white rounded-[32px] border border-stone-100 p-8 shadow-sm">
                <h2 className="text-[0.7rem] font-black text-stone-950 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                   <Clock className="w-4 h-4 text-orange-600" />
                   Operating Hours
                </h2>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Opening Time</label>
                      <input 
                        type="time" 
                        value={formData.opensAt}
                        onChange={(e) => setFormData({...formData, opensAt: e.target.value})}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white transition-all font-bold text-sm"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest ml-1">Closing Time</label>
                      <input 
                        type="time" 
                        value={formData.closesAt}
                        onChange={(e) => setFormData({...formData, closesAt: e.target.value})}
                        className="w-full h-12 px-5 rounded-xl border border-stone-100 bg-stone-50/50 focus:bg-white transition-all font-bold text-sm"
                      />
                   </div>
                </div>
             </section>

             <section className="bg-white rounded-[32px] border border-stone-100 p-8 shadow-sm">
                <h2 className="text-[0.7rem] font-black text-stone-950 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                   <Camera className="w-4 h-4 text-orange-600" />
                   Hero Image
                </h2>
                <ImageUpload 
                  label="Branch Photo"
                  value={formData.heroImageUrl}
                  onChange={(url) => setFormData({...formData, heroImageUrl: url})}
                />
             </section>

             <div className="bg-orange-50 rounded-[32px] p-6 text-orange-600 border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                   <AlertCircle className="w-4 h-4" />
                   <span className="text-[0.65rem] font-black uppercase tracking-widest">Important</span>
                </div>
                <p className="text-[0.65rem] font-bold leading-relaxed">Ensure the slug identifier remains unique to prevent broken public shop links.</p>
             </div>
          </div>
       </form>
    </div>
  );
}

export default StoreEdit;
