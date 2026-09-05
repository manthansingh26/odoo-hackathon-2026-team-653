import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

export const FavoriteButton = ({
  isFavorite = false,
  onToggle,
  className,
  title = "Toggle favorite"
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "p-1.5 rounded-md transition-all duration-200 cursor-pointer flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-pink-300",
        isFavorite
          ? "bg-[#fce4ec] text-[#e91e63] border border-[#f8bbd0] shadow-xs"
          : "bg-white text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 border border-neutral-200",
        className
      )}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-transform duration-200 group-hover:scale-110",
          isFavorite ? "fill-[#e91e63] text-[#e91e63]" : "text-neutral-400 group-hover:text-neutral-600"
        )}
      />
    </button>
  );
};
