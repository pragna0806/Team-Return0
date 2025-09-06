import React from 'react';
import { X, ShoppingCart, User, Calendar, Tag } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart?: (productId: string) => void;
  currentUserId?: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onClose,
  onAddToCart,
  currentUserId
}) => {
  const conditionColors = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-yellow-100 text-yellow-800',
    fair: 'bg-orange-100 text-orange-800'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOwnProduct = currentUserId === product.sellerId;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${conditionColors[product.condition]}`}>
                  {product.condition}
                </span>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Tag size={14} />
                  {product.category}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="text-4xl font-bold text-green-600 mb-4">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <User size={18} />
                Seller Information
              </h3>
              <p className="text-gray-700">{product.sellerName}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                Listed on {formatDate(product.createdAt)}
              </div>
              {product.updatedAt !== product.createdAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  Updated on {formatDate(product.updatedAt)}
                </div>
              )}
            </div>

            {!isOwnProduct && onAddToCart && (
              <button
                onClick={() => onAddToCart(product.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            )}

            {isOwnProduct && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  This is your product listing. You can edit or delete it from the "My Listings" section.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};