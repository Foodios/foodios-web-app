import { X, Save, ChevronDown, Loader2, Package, Tag, Info, Clock, Star, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { productService } from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import ImageUpload from "./ImageUpload";

type ProductFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSuccess: () => void;
  storeId: string;
};

function ProductForm({ isOpen, onClose, initialData, onSuccess, storeId }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    name: "",
    categoryId: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    currency: "VND",
    sku: "",
    imageUrl: "",
    internalStock: 0,
    sortOrder: 0,
    featured: false,
    available: true,
    preparationTimeMinutes: 15,
    status: "DRAFT"
  });

  // Currency Formatter
  const formatCurrency = (value: number | string) => {
    if (!value) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseCurrency = (value: string) => {
    return Number(value.replace(/\./g, ""));
  };

  // Fetch categories when storeId or modal opens
  useEffect(() => {
    const fetchCats = async () => {
      if (!storeId || !isOpen) return;
      setIsLoadingCats(true);
      try {
        const result = await categoryService.getCategories(storeId);
        
        let catList = [];
        if (Array.isArray(result.data)) {
          catList = result.data;
        } else if (result.data && Array.isArray(result.data.categories)) {
          catList = result.data.categories;
        } else if (Array.isArray(result)) {
          catList = result;
        }

        setCategories(catList);
        
        if (!initialData && catList.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: catList[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch categories for form:", err);
      } finally {
        setIsLoadingCats(false);
      }
    };
    fetchCats();
  }, [storeId, isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        price: Number(initialData.price) || 0,
        compareAtPrice: Number(initialData.compareAtPrice) || 0,
        internalStock: Number(initialData.internalStock) || 0,
        preparationTimeMinutes: Number(initialData.preparationTimeMinutes) || 15,
        featured: !!initialData.featured,
        available: !!initialData.available,
      });
    } else {
      setFormData({
        name: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        description: "",
        price: 0,
        compareAtPrice: 0,
        currency: "VND",
        sku: "",
        imageUrl: "",
        internalStock: 99,
        sortOrder: 0,
        featured: false,
        available: true,
        preparationTimeMinutes: 15,
        status: "DRAFT"
      });
    }
  }, [initialData, isOpen, categories.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'price' || name === 'compareAtPrice') {
      const rawValue = parseCurrency(value);
      if (isNaN(rawValue)) return;
      setFormData((prev: any) => ({ ...prev, [name]: rawValue }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleToggle = (name: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        storeId,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
      };

      if (initialData?.id) {
        await productService.updateProduct(initialData.id, payload);
      } else {
        await productService.createProduct(payload);
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Product save error:", error);
      alert(error.message || "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <header className="px-12 py-10 border-b border-stone-100 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-black text-stone-950 tracking-tight">{initialData ? 'Edit Product' : 'Create New Product'}</h2>
                <p className="text-sm font-medium text-stone-400 font-outfit mt-1">Fill in the details to list your item in the catalog.</p>
            </div>
            <button onClick={onClose} className="h-12 w-12 flex items-center justify-center rounded-full hover:bg-stone-50 transition-colors">
                <X className="w-6 h-6 text-stone-300" />
            </button>
        </header>

        <form onSubmit={handleSubmit} className="px-12 py-10 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-12 gap-10">
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-400 ml-1">
                        Product Photo
                    </label>
                    <ImageUpload 
                        value={formData.imageUrl}
                        onChange={(val) => setFormData({...formData, imageUrl: val})}
                        folder="products"
                        label="Upload Image"
                    />
                    <div className="p-6 bg-stone-50 rounded-[32px] border border-stone-100 italic text-[0.7rem] text-stone-400 font-bold leading-relaxed">
                        High quality food photos can increase sales by up to 30%. Use natural lighting if possible.
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">
                                    <Tag className="w-3.5 h-3.5" /> Product Name
                                </label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Wagyu Beef Burger"
                                    className="w-full h-14 px-5 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all shadow-inner"
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">
                                    <Layers className="w-3.5 h-3.5" /> Category
                                </label>
                                <div className="relative">
                                    <select 
                                        name="categoryId"
                                        required
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        disabled={isLoadingCats}
                                        className="w-full h-14 px-5 pr-12 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 appearance-none transition-all shadow-inner disabled:opacity-50"
                                    >
                                        <option value="" disabled>Select category</option>
                                        {categories.map(cat => (
                                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">
                                    <Package className="w-3.5 h-3.5" /> SKU (Optional)
                                </label>
                                <input 
                                    type="text" 
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="e.g. FD-PZ-01"
                                    className="w-full h-14 px-5 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">
                                <Info className="w-3.5 h-3.5" /> Description
                            </label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe the ingredients, taste, or portion size..."
                                className="w-full p-5 rounded-2xl bg-stone-50 border border-transparent focus:border-stone-200 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all resize-none shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 p-8 bg-stone-50 rounded-[40px] border border-stone-100">
                        <div>
                            <label className="block text-[0.65rem] font-black uppercase tracking-widest text-stone-400 mb-3">Regular Price (đ)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="price"
                                    required
                                    value={formatCurrency(formData.price)}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 rounded-xl bg-white border border-stone-200 outline-none text-sm font-black text-stone-950 text-right pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.65rem] font-black text-stone-400">đ</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[0.65rem] font-black uppercase tracking-widest text-stone-400 mb-3 text-orange-600">Sale Price (Optional)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="compareAtPrice"
                                    value={formatCurrency(formData.compareAtPrice)}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 rounded-xl bg-white border border-stone-200 outline-none text-sm font-black text-stone-950 text-right pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.65rem] font-black text-stone-400">đ</span>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-stone-400 mb-3">
                                <Clock className="w-3.5 h-3.5" /> Prep Time (Mins)
                            </label>
                            <input 
                                type="number" 
                                name="preparationTimeMinutes"
                                value={formData.preparationTimeMinutes}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-xl bg-white border border-stone-200 outline-none text-sm font-black text-stone-950"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-stone-400 mb-3">
                                <Package className="w-3.5 h-3.5" /> Stock level
                            </label>
                            <input 
                                type="number" 
                                name="internalStock"
                                value={formData.internalStock}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-xl bg-white border border-stone-200 outline-none text-sm font-black text-stone-950"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <button 
                            type="button" 
                            onClick={() => handleToggle('featured')}
                            className="flex items-center gap-3 group"
                        >
                            <div className={`h-6 w-11 rounded-full relative transition-all duration-300 ${formData.featured ? 'bg-orange-500' : 'bg-stone-200'}`}>
                                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${formData.featured ? 'left-6' : 'left-1'}`} />
                            </div>
                            <span className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-950">
                                <Star className={`w-3.5 h-3.5 ${formData.featured ? 'text-orange-500 fill-orange-500' : 'text-stone-300'}`} /> Featured
                            </span>
                        </button>

                        <button 
                            type="button" 
                            onClick={() => handleToggle('available')}
                            className="flex items-center gap-3 group"
                        >
                            <div className={`h-6 w-11 rounded-full relative transition-all duration-300 ${formData.available ? 'bg-green-500' : 'bg-stone-200'}`}>
                                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${formData.available ? 'left-6' : 'left-1'}`} />
                            </div>
                            <span className="text-[0.7rem] font-black uppercase tracking-widest text-stone-950">In Stock</span>
                        </button>
                    </div>

                    <div className="pt-4">
                        <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-4 ml-1">Final Status</label>
                        <div className="flex bg-stone-100/50 p-2 rounded-[28px] h-16 border border-stone-100 max-w-[320px]">
                            <button 
                                type="button" 
                                onClick={() => setFormData({...formData, status: "ACTIVE"})}
                                className={`flex-1 rounded-[22px] text-[0.7rem] font-black uppercase tracking-widest transition-all ${formData.status === "ACTIVE" ? "bg-white text-stone-950 shadow-md" : "text-stone-400 hover:text-stone-500"}`}
                            >
                                Active
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setFormData({...formData, status: "DRAFT"})}
                                className={`flex-1 rounded-[22px] text-[0.7rem] font-black uppercase tracking-widest transition-all ${formData.status === "DRAFT" ? "bg-white text-stone-950 shadow-md" : "text-stone-400 hover:text-stone-500"}`}
                            >
                                Draft
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        <footer className="px-12 py-10 bg-stone-50/50 border-t border-stone-100 flex items-center justify-end gap-3">
            <button 
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-8 h-14 rounded-2xl text-[0.7rem] font-black uppercase tracking-widest text-stone-500 hover:bg-stone-100 transition-all"
            >
                Discard
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name || !formData.categoryId}
              className="px-10 h-14 rounded-2xl bg-stone-950 text-white text-[0.7rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-stone-200 active:scale-95 transition-all disabled:opacity-50"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> : <Save className="w-4 h-4 text-orange-500" />}
                {initialData ? 'Update Product' : 'Confirm & Save'}
            </button>
        </footer>
      </div>
    </div>
  );
}

export default ProductForm;
