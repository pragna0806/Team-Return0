import { User } from '../types';

const CURRENT_USER_KEY = 'ecofinds_current_user';
const USERS_KEY = 'ecofinds_users';

export const authService = {
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  register(email: string, password: string, username: string, fullName: string): User | null {
    const users = this.getAllUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      username,
      fullName,
      joinedDate: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    this.setCurrentUser(newUser);
    
    return newUser;
  },

  login(email: string, password: string): User | null {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }

    this.setCurrentUser(user);
    return user;
  },

  updateUser(updatedUser: User): void {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      this.setCurrentUser(updatedUser);
    }
  },

  getAllUsers(): User[] {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  }
};