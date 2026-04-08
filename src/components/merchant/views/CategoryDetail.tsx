import { 
  Edit, 
  Trash2, 
  UtensilsCrossed, 
  Calendar, 
  Layout, 
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { categoryService } from "../../../services/categoryService";

function CategoryDetail() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");
  const navigate = useNavigate();
  
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!categoryId || !storeId) {
        setError("Missing category or store ID");
        setIsLoading(false);
        return;
      }

      try {
        const result = await categoryService.getCategoryDetail(categoryId, storeId);
        setCategory(result.data);
      } catch (err: any) {
        console.error("Fetch category detail error:", err);
        setError(err.message || "Failed to load category details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [categoryId, storeId]);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-stone-100 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  if (error || !category) return (
    <div className="p-20 text-center">
       <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
       </div>
       <h2 className="text-2xl font-black text-stone-950 mb-2">Oops! Something went wrong</h2>
       <p className="text-stone-500 font-medium mb-8 max-w-md mx-auto">{error || "Could not find the requested category."}</p>
       <button onClick={() => navigate(-1)} className="h-12 px-8 bg-stone-950 text-white rounded-xl text-sm font-bold shadow-xl hover:bg-stone-800 transition-all">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20">
       {/* Breadcrumbs */}
       <nav className="flex items-center gap-2 mb-8 text-[0.65rem] font-black uppercase tracking-[0.2em] text-stone-400">
          <button onClick={() => navigate('/merchant/categories')} className="hover:text-stone-950 transition-colors">Categories</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-950">{category.name}</span>
       </nav>

       {/* Header Card */}
       <div className="bg-white rounded-[48px] border border-stone-100 p-10 mb-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <UtensilsCrossed className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div className="flex items-center gap-8">
                <div className="h-24 w-24 bg-stone-950 rounded-[32px] flex items-center justify-center shadow-2xl shadow-stone-200">
                   <UtensilsCrossed className="w-10 h-10 text-white" />
                </div>
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[0.6rem] font-black uppercase tracking-widest rounded-full border border-orange-100">
                         {category.slug || "Category"}
                      </span>
                      {category.status === 'ACTIVE' ? (
                        <span className="flex items-center gap-1.5 text-green-600 text-[0.6rem] font-black uppercase tracking-widest">
                           <CheckCircle2 className="w-3.5 h-3.5" /> Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-stone-400 text-[0.6rem] font-black uppercase tracking-widest">
                           <Clock className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                   </div>
                   <h1 className="text-4xl font-black text-stone-950 tracking-tight leading-none">{category.name}</h1>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate(`/merchant/categories?edit=${category.id}`)}
                  className="h-14 px-8 bg-stone-950 text-white rounded-2xl text-[0.7rem] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
                >
                   <Edit className="w-4 h-4 text-orange-500" /> Edit Detail
                </button>
                <button className="h-14 w-14 bg-red-50 text-red-100 hover:text-red-500 rounded-2xl flex items-center justify-center transition-all border border-red-50/50">
                   <Trash2 className="w-5 h-5" />
                </button>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-12 gap-8">
          {/* Left: Content */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
             <section className="bg-white rounded-[40px] border border-stone-100 p-10 shadow-sm">
                <h3 className="text-[0.7rem] font-black text-stone-950 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                   <Info className="w-4 h-4 text-orange-600" />
                   About this Category
                </h3>
                <p className="text-lg font-bold text-stone-600 leading-relaxed mb-8">
                   {category.description || "No description provided for this category. Add a description to help customers understand what's in this section of your menu."}
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-stone-50 p-6 rounded-[32px] border border-stone-100/50">
                      <span className="block text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1 text-center">Menu Items</span>
                      <span className="block text-2xl font-black text-stone-950 text-center tracking-tight">0 Items</span>
                   </div>
                   <div className="bg-stone-50 p-6 rounded-[32px] border border-stone-100/50">
                      <span className="block text-[0.6rem] font-black text-stone-400 uppercase tracking-widest mb-1 text-center">Sort Order</span>
                      <span className="block text-2xl font-black text-stone-950 text-center tracking-tight">#{category.sortOrder || 0}</span>
                   </div>
                </div>
             </section>

             {/* Items Placeholder */}
             <section className="bg-stone-50/50 rounded-[40px] border border-dashed border-stone-200 p-12 text-center">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <Layout className="w-8 h-8 text-stone-200" />
                </div>
                <h4 className="text-xl font-black text-stone-950 mb-2">Products in Category</h4>
                <p className="text-sm font-medium text-stone-400 mb-8">Items listed here will appear under this category on your store's public page.</p>
                <button className="h-12 px-8 border border-stone-200 bg-white rounded-xl text-[0.7rem] font-black uppercase tracking-widest hover:bg-stone-950 hover:text-white transition-all">Manage Products</button>
             </section>
          </div>

          {/* Right: Metadata */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
             <div className="bg-white rounded-[40px] border border-stone-100 p-8 shadow-sm">
                <h3 className="text-[0.7rem] font-black text-stone-950 uppercase tracking-[0.2em] mb-6 flex items-center gap-3 underline decoration-orange-500 decoration-2 underline-offset-8">
                   Metadata
                </h3>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Calendar className="w-4 h-4 text-stone-300" />
                         <span className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">Created</span>
                      </div>
                      <span className="text-[0.7rem] font-black text-stone-950">April 08, 2026</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <ExternalLink className="w-4 h-4 text-stone-300" />
                         <span className="text-[0.6rem] font-black text-stone-400 uppercase tracking-widest">Visibility</span>
                      </div>
                      <span className={`text-[0.65rem] font-black uppercase tracking-widest ${category.active ? 'text-green-600' : 'text-red-500'}`}>
                         {category.active ? 'Enabled' : 'Disabled'}
                      </span>
                   </div>
                </div>
             </div>

             <div className="bg-orange-50 rounded-[40px] p-8 border border-orange-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                   <Info className="w-12 h-12" />
                </div>
                <h4 className="text-[0.7rem] font-black text-orange-600 uppercase tracking-[0.2em] mb-2">Pro Tip</h4>
                <p className="text-[0.75rem] font-bold text-orange-950/70 leading-relaxed">
                   Use descriptive names like "Handcrafted Pizzas" instead of just "Pizzas" to grab customer attention and improve search results.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}

export default CategoryDetail;
