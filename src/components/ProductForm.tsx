import React, { useState, useEffect } from 'react';
import { X, Upload, Save } from 'lucide-react';
import { Product } from '../types';
import { categories } from '../data/products';
import { storageService } from '../utils/storage';

interface ProductFormProps {
  product?: Product;
  sellerId: string;
  sellerName: string;
  onSave: (product: Product) => void;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  sellerId,
  sellerName,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: categories[0],
    condition: 'good' as const,
    image: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        condition: product.condition,
        image: product.image
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (product) {
      const updatedProduct: Product = {
        ...product,
        ...formData,
        price: parseFloat(formData.price),
        updatedAt: new Date().toISOString()
      };
      storageService.updateProduct(updatedProduct);
      onSave(updatedProduct);
    } else {
      const newProduct = storageService.addProduct({
        ...formData,
        price: parseFloat(formData.price),
        sellerId,
        sellerName
      });
      onSave(newProduct);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Sample images for different categories
  const sampleImages: { [key: string]: string[] } = {
    'Electronics': [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
      'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg',
      'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg'
    ],
    'Furniture': [
      'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
      'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg',
      'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    ],
    'Clothing': [
      'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg',
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
      'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg'
    ],
    'Books': [
      'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
      'https://images.pexels.com/photos/1927348/pexels-photo-1927348.jpeg',
      'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'
    ],
    'Sports & Outdoors': [
      'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg',
      'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg'
    ],
    'Musical Instruments': [
      'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg',
      'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg'
    ],
    'Kitchen & Appliances': [
      'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg',
      'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg'
    ],
    'Jewelry': [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
      'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg'
    ],
    'Vehicles': [
      'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg',
      'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'
    ],
    'Home & Garden': [
      'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
      'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg'
    ],
    'Toys & Games': [
      'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
      'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg'
    ],
    'Art & Collectibles': [
      'https://images.pexels.com/photos/1927348/pexels-photo-1927348.jpeg',
      'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg'
    ]
  };

  const getCategoryImages = () => {
    return sampleImages[formData.category] || sampleImages['Electronics'];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter product title"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                name="condition"
                required
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter price in rupees"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
              placeholder="Describe your product in detail"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="space-y-4">
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Enter image URL or select from samples below"
              />
              
              <div className="text-sm text-gray-600 mb-2">Or choose from sample images:</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {getCategoryImages().map((imageUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: imageUrl }))}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                      formData.image === imageUrl
                        ? 'border-green-500 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>

              {formData.image && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Preview:</div>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};