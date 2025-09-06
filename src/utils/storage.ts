import { Product, CartItem, Purchase } from '../types';
import { initialProducts } from '../data/products';

const PRODUCTS_KEY = 'ecofinds_products';
const CART_KEY = 'ecofinds_cart';
const PURCHASES_KEY = 'ecofinds_purchases';

export const storageService = {
  getProducts(): Product[] {
    const productsStr = localStorage.getItem(PRODUCTS_KEY);
    if (!productsStr) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(productsStr);
  },

  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
  },

  updateProduct(updatedProduct: Product): void {
    const products = this.getProducts();
    const productIndex = products.findIndex(p => p.id === updatedProduct.id);
    
    if (productIndex !== -1) {
      products[productIndex] = {
        ...updatedProduct,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  },

  deleteProduct(productId: string): void {
    const products = this.getProducts();
    const filteredProducts = products.filter(p => p.id !== productId);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filteredProducts));
  },

  getCartItems(userId: string): CartItem[] {
    const cartStr = localStorage.getItem(`${CART_KEY}_${userId}`);
    return cartStr ? JSON.parse(cartStr) : [];
  },

  addToCart(userId: string, productId: string): void {
    const cartItems = this.getCartItems(userId);
    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ productId, quantity: 1 });
    }
    
    localStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(cartItems));
  },

  removeFromCart(userId: string, productId: string): void {
    const cartItems = this.getCartItems(userId);
    const filteredItems = cartItems.filter(item => item.productId !== productId);
    localStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(filteredItems));
  },

  clearCart(userId: string): void {
    localStorage.removeItem(`${CART_KEY}_${userId}`);
  },

  getPurchases(userId: string): Purchase[] {
    const purchasesStr = localStorage.getItem(`${PURCHASES_KEY}_${userId}`);
    return purchasesStr ? JSON.parse(purchasesStr) : [];
  },

  addPurchase(purchase: Omit<Purchase, 'id'>): Purchase {
    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now().toString()
    };
    
    const purchases = this.getPurchases(purchase.buyerId);
    purchases.push(newPurchase);
    localStorage.setItem(`${PURCHASES_KEY}_${purchase.buyerId}`, JSON.stringify(purchases));
    
    return newPurchase;
  }
};