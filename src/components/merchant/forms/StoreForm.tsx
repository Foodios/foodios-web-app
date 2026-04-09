import { X, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { storeService } from "../../../services/storeService";
import ImageUpload from "./ImageUpload";

type StoreFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  merchantId: string;
};

function StoreForm({ isOpen, onClose, onSuccess, merchantId }: StoreFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    status: "ACTIVE",
    timeZone: "Asia/Ho_Chi_Minh",
    heroImageUrl: "",
    logoUrl: "",
    opensAt: "08:00",
    closesAt: "22:00",
    address: {
      contactName: "",
      contactPhone: "",
      line1: "",
      line2: "",
      ward: "",
      district: "",
      city: "Ho Chi Minh City",
      province: "Ho Chi Minh",
      postalCode: "70000",
      country: "VN",
      latitude: 10.762622,
      longitude: 106.660172
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const setHeroImage = (url: string) => {
    setFormData(prev => ({ ...prev, heroImageUrl: url, logoUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!merchantId) {
      console.error("StoreForm error: merchantId is missing from props", { props: { merchantId } });
      alert("System could not verify your merchant identity. Please try refreshing the page or logging in again.");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address.line1) {
      alert("Please fill in all required fields (Name, Phone, Address).");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        merchantId,
        slug: formData.name.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") 
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, ''),
        address: {
          ...formData.address,
          contactName: formData.address.contactName || formData.name,
          contactPhone: formData.address.contactPhone || formData.phone
        }
      };
      
      const result = await storeService.createStore(payload);
      
      if (result.result?.code === '0000' || result.data) {
        onSuccess();
        onClose();
      } else {
        alert(`Error: ${result.result?.description || 'Could not save store'}`);
      }
    } catch (error) {
      console.error("Failed to create store branch:", error);
      alert("Error creating store. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <header className="px-10 py-8 border-b border-stone-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-stone-950 tracking-tight">Add New Branch</h2>
            <p className="text-sm text-stone-400 font-medium">Register a new location for your merchant business.</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-stone-50 transition-colors">
            <X className="w-5 h-5 text-stone-300" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="px-10 py-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-12 gap-x-8 gap-y-6">
            
            {/* Left Column: Image Upload */}
            <div className="col-span-12 lg:col-span-4">
               <ImageUpload 
                 value={formData.heroImageUrl} 
                 onChange={setHeroImage}
                 label="Branch Hero Image"
               />
               <p className="mt-4 text-[0.65rem] text-stone-400 font-medium leading-relaxed italic">
                 This image will be displayed on the public storefront for this branch.
               </p>
            </div>

            {/* Right Column: Form Fields */}
            <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-2">Branch Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full h-12 px-5 rounded-xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all" placeholder="e.g. Foodio Thao Dien" />
              </div>

              <div>
                <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-2">Branch Phone</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full h-12 px-5 rounded-xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all" placeholder="028 3456 ..." />
              </div>

              <div>
                <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full h-12 px-5 rounded-xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all appearance-none cursor-pointer">
                   <option value="ACTIVE">Active</option>
                   <option value="DRAFT">Draft</option>
                   <option value="CLOSED">Permanently Closed</option>
                </select>
              </div>

              {/* Address Details */}
              <div className="col-span-2 mt-4 pt-6 border-t border-stone-100 grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-2">Street Address</label>
                  <input required name="address.line1" value={formData.address.line1} onChange={handleChange} className="w-full h-12 px-5 rounded-xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all" placeholder="Street name and number" />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-2">Ward</label>
                  <input required name="address.ward" value={formData.address.ward} onChange={handleChange} className="w-full h-12 px-5 rounded-xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all" placeholder="Phường ..." />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-2">District</label>
                  <input required name="address.district" value={formData.address.district} onChange={handleChange} className="w-full h-12 px-5 rounded-xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all" placeholder="Quận ..." />
                </div>
              </div>

              {/* Operational Hours */}
              <div className="col-span-2 mt-4 pt-6 border-t border-stone-100 grid grid-cols-2 gap-6">
                 <div>
                   <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-2">Opens At</label>
                   <input type="time" name="opensAt" value={formData.opensAt} onChange={handleChange} className="w-full h-12 px-5 rounded-xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all" />
                 </div>
                 <div>
                   <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-2">Closes At</label>
                   <input type="time" name="closesAt" value={formData.closesAt} onChange={handleChange} className="w-full h-12 px-5 rounded-xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all" />
                 </div>
              </div>
            </div>
          </div>
        </form>

        <footer className="px-10 py-8 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 h-12 rounded-xl text-sm font-bold text-stone-500 hover:bg-stone-100 transition-all">Cancel</button>
          <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="px-8 h-12 rounded-xl bg-stone-950 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-stone-200 active:scale-95 transition-all disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Branch
          </button>
        </footer>
      </div>
    </div>
  );
}

export default StoreForm;
