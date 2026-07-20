import React from 'react';
import WishlistProductCard from './WishlistProductCard';

const WishlistGrid = ({ items, token, onRemove, onUndo }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map(item => (
        <WishlistProductCard
          key={item._id}
          item={item}
          token={token}
          onRemove={onRemove}
          onUndo={onUndo}
        />
      ))}
    </div>
  );
};

export default WishlistGrid;
