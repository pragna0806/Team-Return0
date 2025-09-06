import React from 'react';
import { ShoppingCart, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { Product, CartItem } from '../types';
import { storageService } from '../utils/storage';

interface CartProps {
  userId: string;
  products: Product[];
  onBack: () => void;
  onPurchase: (items: { product: Product; quantity: number }[]) => void;
}

export const Cart: React.FC<CartProps> = ({ userId, products, onBack, onPurchase }) => {
  const cartItems = storageService.getCartItems(userId);
  const cartProducts = cartItems.map(item => ({
    product: products.find(p => p.id === item.productId)!,
    quantity: item.quantity
  })).filter(item => item.product);

  const total = cartProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleRemoveFromCart = (productId: string) => {
    storageService.removeFromCart(userId, productId);
    window.location.reload();
  };

  const handlePurchase = () => {
    if (cartProducts.length > 0) {
      onPurchase(cartProducts);
      storageService.clearCart(userId);
      window.location.reload();
    }
  };

  if (cartItems.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Browse our marketplace to find amazing second-hand items!</p>
            <button
              onClick={onBack}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Continue Shopping
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
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map(({ product, quantity }) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-green-600">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartProducts.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{product.title}</span>
                    <span className="font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};