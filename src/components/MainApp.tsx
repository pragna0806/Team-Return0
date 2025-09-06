import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, User, List, History, LogOut, Plus, Leaf } from 'lucide-react';
import { Product, User as UserType } from '../types';
import { ProductCard } from './ProductCard';
import { ProductForm } from './ProductForm';
import { ProductDetail } from './ProductDetail';
import { Cart } from './Cart';
import { PurchaseHistory } from './PurchaseHistory';
import { UserDashboard } from './UserDashboard';
import { MyListings } from './MyListings';
import { storageService } from '../utils/storage';
import { authService } from '../utils/auth';
import { categories } from '../data/products';

interface MainAppProps {
  user: UserType;
  onLogout: () => void;
}

type View = 'home' | 'cart' | 'history' | 'dashboard' | 'listings';

export const MainApp: React.FC<MainAppProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showProductForm, setShowProductForm] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | undefined>();
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = () => {
    const allProducts = storageService.getProducts();
    setProducts(allProducts);
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (productId: string) => {
    storageService.addToCart(currentUser.id, productId);
    alert('Product added to cart!');
  };

  const handlePurchase = (items: { product: Product; quantity: number }[]) => {
    items.forEach(({ product }) => {
      storageService.addPurchase({
        productId: product.id,
        buyerId: currentUser.id,
        sellerId: product.sellerId,
        price: product.price,
        purchaseDate: new Date().toISOString(),
        status: 'completed'
      });
    });
    alert('Purchase completed successfully!');
    setCurrentView('history');
  };

  const cartItemCount = storageService.getCartItems(currentUser.id).length;

  const renderHeader = () => (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EcoFinds</h1>
                <p className="text-xs text-gray-600">Sustainable Marketplace</p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'home' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('listings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'listings' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List size={18} />
              My Listings
            </button>
            <button
              onClick={() => setCurrentView('cart')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative ${
                currentView === 'cart' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingCart size={18} />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'history' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <History size={18} />
              History
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'dashboard' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User size={18} />
              Profile
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <span>Welcome, {currentUser.username}!</span>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const renderHomeView = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Discover Amazing Second-Hand Items in India
            </h2>
            <p className="text-gray-600">
              Find unique products at affordable prices while supporting sustainable consumption
            </p>
          </div>
          <button
            onClick={() => setShowProductForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Sell Something
          </button>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none bg-white min-w-48"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', ...categories.slice(0, 6)].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={setViewingProduct}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">कोई उत्पाद नहीं मिला / No products found</h3>
          <p className="text-gray-600">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'cart':
        return (
          <Cart
            userId={currentUser.id}
            products={products}
            onBack={() => setCurrentView('home')}
            onPurchase={handlePurchase}
          />
        );
      case 'history':
        return (
          <PurchaseHistory
            userId={currentUser.id}
            products={products}
            onBack={() => setCurrentView('home')}
          />
        );
      case 'dashboard':
        return (
          <UserDashboard
            user={currentUser}
            onBack={() => setCurrentView('home')}
            onUserUpdate={setCurrentUser}
          />
        );
      case 'listings':
        return (
          <MyListings
            userId={currentUser.id}
            userName={currentUser.username}
            products={products}
            onBack={() => setCurrentView('home')}
            onProductsUpdate={loadProducts}
          />
        );
      default:
        return (
          <>
            {renderHeader()}
            <main className="min-h-screen bg-gray-50">
              {renderHomeView()}
            </main>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'home' ? null : renderHeader()}
      {renderCurrentView()}

      {/* Mobile Navigation */}
      {currentView === 'home' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => setCurrentView('listings')}
              className="flex flex-col items-center py-2 px-4 text-gray-600"
            >
              <List size={20} />
              <span className="text-xs mt-1">Listings</span>
            </button>
            <button
              onClick={() => setCurrentView('cart')}
              className="flex flex-col items-center py-2 px-4 text-gray-600 relative"
            >
              <ShoppingCart size={20} />
              <span className="text-xs mt-1">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className="flex flex-col items-center py-2 px-4 text-gray-600"
            >
              <History size={20} />
              <span className="text-xs mt-1">History</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex flex-col items-center py-2 px-4 text-gray-600"
            >
              <User size={20} />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
      )}

      {showProductForm && (
        <ProductForm
          sellerId={currentUser.id}
          sellerName={currentUser.username}
          onSave={() => {
            loadProducts();
            setShowProductForm(false);
          }}
          onClose={() => setShowProductForm(false)}
        />
      )}

      {viewingProduct && (
        <ProductDetail
          product={viewingProduct}
          currentUserId={currentUser.id}
          onClose={() => setViewingProduct(undefined)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};