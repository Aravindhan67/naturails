import React from 'react';
import { Star } from 'lucide-react';

export const Rating = ({ value = 5, numReviews, size = 'sm' }) => {
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.round(value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-stone-200 text-stone-300'
            }`}
          />
        ))}
      </div>
      {numReviews !== undefined && (
        <span className="text-xs font-medium text-stone-500">
          ({numReviews})
        </span>
      )}
    </div>
  );
};
