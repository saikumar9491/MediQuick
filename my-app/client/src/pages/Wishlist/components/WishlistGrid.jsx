import React from 'react';
import ProductCard from '../../../components/ProductCard/ProductCard';

const WishlistGrid = ({ items, token, onRemove, onUndo }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
      {items.map(item => (
        <ProductCard
          key={item._id}
          {...item}
          onRemove={onRemove}
          onUndo={onUndo}
        />
      ))}
    </div>
  );
};

export default WishlistGrid;
