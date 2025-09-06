import React, { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { MainApp } from './components/MainApp';
import { authService } from './utils/auth';
import { User } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const handleAuth = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EcoFinds...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return <MainApp user={currentUser} onLogout={handleLogout} />;
}

export default App;