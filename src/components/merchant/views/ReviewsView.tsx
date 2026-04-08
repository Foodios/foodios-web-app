import { Star, MessageSquare, ThumbsUp, Search, Loader2, User } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { reviewService } from "../../../services/reviewService";

function ReviewsView() {
  const { merchant } = useOutletContext<{ merchant: any }>();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("PUBLISHED");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    averageRating: 0,
    totalCount: 0,
    positiveRate: "0%",
    needsAttention: 0,
    responseRate: "0%"
  });

  const fetchReviews = useCallback(async () => {
    const merchantId = merchant?.id || merchant?.merchantId;
    if (!merchantId) return;

    setIsLoading(true);
    try {
      const result = await reviewService.getReviews({
        merchantId,
        status,
        pageSize: 50
      });
      
      let reviewList = [];
      if (result.data && Array.isArray(result.data.reviews)) {
        reviewList = result.data.reviews;
      } else if (Array.isArray(result.data)) {
        reviewList = result.data;
      } else if (Array.isArray(result)) {
        reviewList = result;
      }
      
      setReviews(reviewList);
      
      // Basic stats calculation if not provided by API
      if (reviewList.length > 0) {
        const avg = reviewList.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviewList.length;
        const total = result.data?.totalElements || reviewList.length;
        const positive = (reviewList.filter((r: any) => r.rating >= 4).length / reviewList.length * 100).toFixed(0);
        
        setStats({
          averageRating: Number(avg.toFixed(1)),
          totalCount: total,
          positiveRate: `${positive}%`,
          needsAttention: reviewList.filter((r: any) => r.rating <= 2).length,
          responseRate: "95%" // Mocked for now
        });
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [merchant, status]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredReviews = Array.isArray(reviews) ? reviews.filter(r => 
    (r.comment || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.userName || r.userFullName || "").toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-950 tracking-tight uppercase">Customer Reviews</h1>
          <p className="text-sm font-medium text-stone-500 mt-1">See what your customers are saying about your food and service.</p>
        </div>
        
        <div className="flex items-center gap-6 bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
           <div className="text-center">
              <span className="block text-3xl font-black text-stone-950">{stats.averageRating || "0.0"}</span>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                 {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(stats.averageRating) ? 'fill-orange-400 text-orange-400' : 'text-stone-200 fill-stone-200'}`} />
                 ))}
              </div>
           </div>
           <div className="h-10 w-px bg-stone-100" />
           <div className="text-left">
              <span className="block text-sm font-black text-stone-950">{stats.totalCount.toLocaleString()} Reviews</span>
              <span className="block text-[0.7rem] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Global Rating</span>
           </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Positive Feedbacks", value: stats.positiveRate, color: "text-green-600", bg: "bg-green-50" },
           { label: "Needs Attention", value: stats.needsAttention.toString(), color: "text-orange-600", bg: "bg-orange-50" },
           { label: "Response Rate", value: stats.responseRate, color: "text-blue-600", bg: "bg-blue-50" },
         ].map((stat, i) => (
           <div key={i} className={`p-6 rounded-[32px] border border-stone-100 bg-white shadow-sm flex flex-col gap-1`}>
              <span className="text-[0.7rem] font-black uppercase tracking-widest text-stone-400">{stat.label}</span>
              <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
           </div>
         ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 max-w-md items-center gap-3 bg-white px-5 rounded-[22px] border border-stone-100 h-14 shadow-sm group">
           <Search className="w-5 h-5 text-stone-300 group-focus-within:text-stone-950 transition-colors" />
           <input 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-transparent border-none outline-none text-sm font-bold placeholder:text-stone-300 text-stone-950" 
             placeholder="Search in reviews..." 
           />
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center p-1 bg-white border border-stone-100 rounded-2xl shadow-sm">
              {["PUBLISHED", "PENDING", "HIDDEN"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-6 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-widest transition-all ${
                    status === s ? "bg-stone-950 text-white shadow-lg" : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {s}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white border border-stone-100 rounded-[40px] border-dashed">
             <Loader2 className="w-10 h-10 text-stone-100 animate-spin mb-4" />
             <p className="text-[0.65rem] font-black text-stone-300 uppercase tracking-widest leading-relaxed italic">Synchronizing feedback...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white border border-stone-100 rounded-[40px] border-dashed">
             <MessageSquare className="w-10 h-10 text-stone-100 mb-4" />
             <p className="text-stone-400 font-bold italic">No reviews found for this criteria.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-[40px] border border-stone-100 p-8 shadow-sm hover:shadow-md transition-shadow group">
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-stone-100 flex items-center justify-center overflow-hidden shadow-sm border border-stone-200/50">
                        {review.userAvatar ? (
                          <img src={review.userAvatar} alt="user" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-stone-300" />
                        )}
                     </div>
                     <div>
                        <h3 className="font-black text-stone-950 uppercase tracking-tight">{review.userFullName || review.userName || "Anonymous"}</h3>
                        <p className="text-[0.65rem] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                           {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                        </p>
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-orange-400 text-orange-400' : 'text-stone-100 fill-stone-100'}`} />
                        ))}
                     </div>
                     <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-stone-300">Verified Diner</span>
                  </div>
               </div>

               <div className="mb-8">
                  <p className="text-stone-700 leading-relaxed font-medium italic text-lg">"{review.comment || "No comment provided."}"</p>
               </div>

               <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                  <div className="flex items-center gap-6">
                     <button className="flex items-center gap-2.5 text-stone-400 hover:text-stone-950 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-[0.65rem] font-black uppercase tracking-widest">Helpful</span>
                     </button>
                     <button className="flex items-center gap-2.5 text-stone-400 hover:text-orange-600 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-[0.65rem] font-black uppercase tracking-widest">Reply</span>
                     </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-[0.65rem] font-black text-stone-300 hover:text-red-500 uppercase tracking-widest transition-colors">Report concern</button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewsView;
