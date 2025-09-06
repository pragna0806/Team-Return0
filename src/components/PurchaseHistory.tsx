import React from 'react';
import { ArrowLeft, Package, Calendar, CheckCircle } from 'lucide-react';
import { Product, Purchase } from '../types';
import { storageService } from '../utils/storage';

interface PurchaseHistoryProps {
  userId: string;
  products: Product[];
  onBack: () => void;
}

export const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ userId, products, onBack }) => {
  const purchases = storageService.getPurchases(userId);
  const purchaseHistory = purchases.map(purchase => ({
    ...purchase,
    product: products.find(p => p.id === purchase.productId)
  })).filter(item => item.product);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (purchases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Purchase History</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No purchases yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your purchase history here!</p>
            <button
              onClick={onBack}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Purchase History</h1>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {purchases.length} {purchases.length === 1 ? 'purchase' : 'purchases'}
          </span>
        </div>

        <div className="space-y-4">
          {purchaseHistory.map(({ product, ...purchase }) => (
            <div key={purchase.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-6">
                <img
                  src={product!.image}
                  alt={product!.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{product!.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product!.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        ₹{purchase.price.toLocaleString('en-IN')}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(purchase.status)}`}>
                        {purchase.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(purchase.purchaseDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package size={16} />
                        Order #{purchase.id}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={16} />
                      Purchase Complete
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};