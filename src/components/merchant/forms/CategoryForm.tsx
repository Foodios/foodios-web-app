import { X, Save, Loader2, AlertCircle, Type, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { categoryService } from "../../../services/categoryService";

type CategoryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  storeId: string;
  onSuccess: () => void;
};

function CategoryForm({ isOpen, onClose, initialData, storeId, onSuccess }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status || "ACTIVE");
    } else {
      setName("");
      setDescription("");
      setStatus("ACTIVE");
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (initialData) {
        await categoryService.updateCategory(initialData.id, {
          storeId,
          parentId: initialData.parentId || null,
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          description,
          imageUrl: null,
          status,
          active: true
        });
      } else {
        await categoryService.createCategory({
          storeId,
          parentId: null,
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          description,
          imageUrl: null,
          status,
          active: true
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <header className="px-10 py-8 border-b border-stone-100 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-black text-stone-950 tracking-tight">{initialData ? 'Edit Category' : 'Add New Category'}</h2>
                <p className="text-sm text-stone-400 font-medium font-outfit">Organize your menu into groups.</p>
            </div>
            <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-stone-50 transition-colors">
                <X className="w-5 h-5 text-stone-300" />
            </button>
        </header>

        <form onSubmit={handleSubmit} className="px-10 py-8">
            <div className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {/* Name */}
                <div>
                    <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">
                        <Type className="w-3.5 h-3.5" /> Category Name
                    </label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Signature Dishes"
                        className="w-full h-14 px-5 rounded-2xl bg-stone-50/50 border border-stone-100 focus:border-stone-300 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all shadow-inner"
                        required
                        autoFocus
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">
                        <FileText className="w-3.5 h-3.5" /> Description (Optional)
                    </label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A brief description of this section..."
                        rows={3}
                        className="w-full p-5 rounded-2xl bg-stone-50/50 border border-stone-100 focus:border-stone-300 focus:bg-white outline-none text-sm font-bold text-stone-950 transition-all shadow-inner resize-none"
                    />
                </div>

                {/* Status Toggle */}
                <div>
                    <label className="block text-[0.7rem] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">Visibility Status</label>
                    <div className="flex bg-stone-100/50 p-1.5 rounded-2xl h-14 border border-stone-100">
                        <button 
                            type="button" 
                            onClick={() => setStatus("ACTIVE")}
                            className={`flex-1 rounded-xl text-[0.7rem] font-black uppercase tracking-widest transition-all ${status === 'ACTIVE' ? 'bg-white text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            Active
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setStatus("DRAFT")}
                            className={`flex-1 rounded-xl text-[0.7rem] font-black uppercase tracking-widest transition-all ${status === 'DRAFT' ? 'bg-white text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            Draft
                        </button>
                    </div>
                </div>
            </div>
        </form>

        <footer className="px-10 py-8 bg-stone-50/50 border-t border-stone-100 flex items-center justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-6 h-12 rounded-xl text-[0.7rem] font-black uppercase tracking-widest text-stone-500 hover:bg-stone-100 transition-all"
            >
                Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isLoading || !name.trim()}
              className="px-8 h-12 rounded-xl bg-stone-950 text-white text-[0.7rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-stone-200 active:scale-95 transition-all disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> : <Save className="w-4 h-4 text-orange-500" />}
                Confirm & Create
            </button>
        </footer>
      </div>
    </div>
  );
}

export default CategoryForm;
