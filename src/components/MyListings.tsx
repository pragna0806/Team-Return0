import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Product } from '../types';
import { ProductForm } from './ProductForm';
import { ProductDetail } from './ProductDetail';
import { storageService } from '../utils/storage';

interface MyListingsProps {
  userId: string;
  userName: string;
  products: Product[];
  onBack: () => void;
  onProductsUpdate: () => void;
}

export const MyListings: React.FC<MyListingsProps> = ({
  userId,
  userName,
  products,
  onBack,
  onProductsUpdate
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [viewingProduct, setViewingProduct] = useState<Product | undefined>();

  const myProducts = products.filter(p => p.sellerId === userId);

  const handleSaveProduct = () => {
    onProductsUpdate();
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      storageService.deleteProduct(productId);
      onProductsUpdate();
    }
  };

  if (myProducts.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No listings yet</h2>
            <p className="text-gray-600 mb-8">Start selling by creating your first product listing!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create First Listing
            </button>
          </div>
        </div>

        {showForm && (
          <ProductForm
            sellerId={userId}
            sellerName={userName}
            onSave={handleSaveProduct}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
              <p className="text-gray-600 mt-1">
                {myProducts.length} {myProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                  {product.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl font-bold text-green-600">
                    ${product.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.condition}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewingProduct(product)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <ProductForm
          sellerId={userId}
          sellerName={userName}
          onSave={handleSaveProduct}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          sellerId={userId}
          sellerName={userName}
          onSave={handleSaveProduct}
          onClose={() => setEditingProduct(undefined)}
        />
      )}

      {viewingProduct && (
        <ProductDetail
          product={viewingProduct}
          currentUserId={userId}
          onClose={() => setViewingProduct(undefined)}
        />
      )}
    </div>
  );
};