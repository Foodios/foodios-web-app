import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Heart, Clock } from "lucide-react";

interface RestaurantCardProps {
  restaurant: any;
  onToggleFavorite?: (merchantId: string) => void;
  isFavorite?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  onToggleFavorite,
  isFavorite = true 
}) => {
  return (
    <Link 
      to={`/restaurant/${restaurant.merchantSlug}`}
      className="group flex flex-col bg-white rounded-[32px] border border-stone-100 overflow-hidden hover:shadow-2xl hover:shadow-stone-200/40 transition-all duration-500"
    >
      <div className="h-48 w-full relative overflow-hidden">
        <img 
          src={restaurant.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"} 
          alt={restaurant.merchantName} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(restaurant.merchantId || restaurant.id);
          }}
          className={`absolute top-4 left-4 h-9 w-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 z-10 shadow-sm border ${
            isFavorite 
            ? "bg-orange-500 text-white border-orange-400" 
            : "bg-white/90 text-stone-400 border-white hover:text-orange-500"
          }`}
        >
          <Heart className={`w-4.5 h-4.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-sm">
          <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
          <span className="text-xs font-black text-stone-900">{restaurant.overallReview?.averageRating || "4.5"}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-[0.95rem] font-black text-stone-950 tracking-tight group-hover:text-orange-600 transition-colors uppercase italic mb-1 truncate">
          {restaurant.merchantName}
        </h3>
        <p className="text-[0.65rem] font-bold text-stone-400 uppercase tracking-widest mb-4 truncate">
          {restaurant.cuisineCategory || "Premium Cuisines"}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-stone-50">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[0.65rem] font-black text-stone-600 uppercase tracking-widest">
              {restaurant.distance || "1.2 km"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-400 group-hover:text-stone-950 transition-colors">
            <span className="text-[0.55rem] font-black uppercase tracking-widest">Menu</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
