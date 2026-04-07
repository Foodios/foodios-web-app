import { X, Upload, Save, ChevronDown } from "lucide-react";

type ProductFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
};

function ProductForm({ isOpen, onClose, initialData }: ProductFormProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <header className="px-10 py-8 border-b border-stone-100 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-black text-stone-950 tracking-tight">{initialData ? 'Edit Menu Item' : 'Add New Product'}</h2>
                <p className="text-sm text-stone-400 font-medium">Configure your product details and pricing.</p>
            </div>
            <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-stone-50 transition-colors">
                <X className="w-5 h-5 text-stone-300" />
            </button>
        </header>

        <form className="px-10 py-8 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-8">
                {/* Image Upload Area */}
                <div className="col-span-2">
                    <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Product Image</label>
                    <div className="h-48 w-full border-2 border-dashed border-stone-100 rounded-[32px] flex flex-col items-center justify-center gap-3 bg-stone-50/50 hover:bg-stone-50 transition-colors group cursor-pointer relative overflow-hidden">
                        <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5 text-stone-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-stone-600">Click or drag to upload</p>
                            <p className="text-[0.7rem] text-stone-400 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                </div>

                {/* Name */}
                <div className="col-span-2">
                    <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Product Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Signature Truffle Pizza"
                        className="w-full h-14 px-5 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all"
                        defaultValue={initialData?.name}
                    />
                </div>

                {/* Category & Price */}
                <div>
                    <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Category</label>
                    <div className="relative">
                        <select className="w-full h-14 px-5 pr-12 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 appearance-none transition-all">
                            <option>Main Course</option>
                            <option>Appetizers</option>
                            <option>Drinks</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Pricing (VND)</label>
                    <input 
                        type="number" 
                        placeholder="0"
                        className="w-full h-14 px-5 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all"
                        defaultValue={initialData?.price}
                    />
                </div>

                {/* Description */}
                <div className="col-span-2">
                    <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Description</label>
                    <textarea 
                        rows={3}
                        placeholder="What makes this dish special?"
                        className="w-full p-5 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all resize-none"
                    />
                </div>

                {/* Stock & Status */}
                <div>
                    <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Initial Stock</label>
                    <input 
                        type="number" 
                        className="w-full h-14 px-5 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3">Status</label>
                    <div className="flex bg-stone-100 p-1.5 rounded-2xl h-14">
                        <button type="button" className="flex-1 bg-white rounded-xl text-[0.7rem] font-black uppercase tracking-widest text-stone-900 shadow-sm transition-all">Available</button>
                        <button type="button" className="flex-1 rounded-xl text-[0.7rem] font-black uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-all">Disabled</button>
                    </div>
                </div>
            </div>
        </form>

        <footer className="px-10 py-8 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 h-12 rounded-xl text-sm font-bold text-stone-500 hover:bg-stone-100 transition-all"
            >
                Cancel
            </button>
            <button className="px-8 h-12 rounded-xl bg-stone-950 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-stone-200 active:scale-95 transition-all">
                <Save className="w-4 h-4" />
                Save Product
            </button>
        </footer>
      </div>
    </div>
  );
}

export default ProductForm;
