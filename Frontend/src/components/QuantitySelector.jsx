import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

const QuantitySelector = ({ quantity, onIncrease, onDecrease, onRemove, min = 1, max = 99 }) => {
  const handleDecrease = () => {
    if (quantity <= min) {
      onRemove && onRemove();
    } else {
      onDecrease && onDecrease();
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onIncrease && onIncrease();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDecrease}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:bg-primary-50 transition-colors"
        disabled={quantity <= min}
      >
        {quantity <= min ? (
          <Trash2 size={14} className="text-red-500" />
        ) : (
          <Minus size={14} className="text-gray-600" />
        )}
      </button>
      
      <span className="min-w-[2rem] text-center font-medium text-lg">
        {quantity}
      </span>
      
      <button
        onClick={handleIncrease}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:border-primary hover:bg-primary-50 transition-colors"
        disabled={quantity >= max}
      >
        <Plus size={14} className="text-gray-600" />
      </button>
    </div>
  );
};

export default QuantitySelector; 