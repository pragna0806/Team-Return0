import React from 'react';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart?: (productId: string) => void;
  showActions?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onViewDetails, 
  onAddToCart,
  showActions = true 
}) => {
  const conditionColors = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-yellow-100 text-yellow-800',
    fair: 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${conditionColors[product.condition]}`}>
            {product.condition}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-green-600">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          <div className="text-sm text-gray-500">
            by {product.sellerName}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(product)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              View
            </button>
            {onAddToCart && (
              <button
                onClick={() => onAddToCart(product.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};