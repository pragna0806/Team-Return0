export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone?: string;
  address?: string;
  joinedDate: string;
  avatar?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sellerId: string;
  sellerName: string;
  condition: 'excellent' | 'good' | 'fair';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Purchase {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  purchaseDate: string;
  status: 'completed' | 'pending' | 'cancelled';
}