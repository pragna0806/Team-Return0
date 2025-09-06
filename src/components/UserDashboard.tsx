import React, { useState } from 'react';
import { ArrowLeft, Edit, Save, X, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { User as UserType } from '../types';
import { authService } from '../utils/auth';

interface UserDashboardProps {
  user: UserType;
  onBack: () => void;
  onUserUpdate: (user: UserType) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onBack, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    fullName: user.fullName,
    phone: user.phone || '',
    address: user.address || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserType = {
      ...user,
      ...formData
    };
    authService.updateUser(updatedUser);
    onUserUpdate(updatedUser);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      fullName: user.fullName,
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-12">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2">{user.fullName}</h2>
                <p className="text-green-100 text-lg">@{user.username}</p>
                <div className="flex items-center gap-1 mt-2 text-green-100">
                  <Calendar size={16} />
                  <span>Member since {formatDate(user.joinedDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                    placeholder="Enter your address"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <User size={16} />
                      Username
                    </label>
                    <p className="text-lg text-gray-900">@{user.username}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <User size={16} />
                      Full Name
                    </label>
                    <p className="text-lg text-gray-900">{user.fullName}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <Mail size={16} />
                      Email Address
                    </label>
                    <p className="text-lg text-gray-900">{user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <Phone size={16} />
                      Phone Number
                    </label>
                    <p className="text-lg text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <MapPin size={16} />
                    Address
                  </label>
                  <p className="text-lg text-gray-900">{user.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};