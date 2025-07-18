import React, { useState, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Settings, Calendar, MessageSquare, Heart, Users, Edit3, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className={`text-center p-8 rounded-lg ${
          theme === 'dark' ? 'bg-slate-800 text-slate-100' : 'bg-white text-gray-900'
        }`}>
          <User className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold mb-2">Please Log In</h2>
          <p className={theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}>
            You need to be logged in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (editedUser) {
      updateProfile(editedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const stats = [
    { label: 'Events Created', value: '12', icon: Calendar },
    { label: 'Messages Sent', value: '48', icon: MessageSquare },
    { label: 'Events Liked', value: '23', icon: Heart },
    { label: 'Following', value: '156', icon: Users },
  ];

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className={`rounded-lg shadow-lg p-8 mb-8 ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-10">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editedUser?.name || ''}
                    onChange={(e) => setEditedUser(prev => prev ? {...prev, name: e.target.value} : null)}
                    className={`text-3xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none ${
                      theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
                    }`}
                  />
                  <input
                    type="email"
                    value={editedUser?.email || ''}
                    onChange={(e) => setEditedUser(prev => prev ? {...prev, email: e.target.value} : null)}
                    className={`text-lg bg-transparent border-b border-gray-300 focus:outline-none ${
                      theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                    }`}
                  />
                  <div className="flex gap-2 justify-center md:justify-start">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        theme === 'dark' 
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <h1 className={`text-3xl font-bold ${
                      theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
                    }`}>
                      {user.name}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' 
                          ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' 
                          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className={`text-lg mb-4 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'dark' 
                        ? 'bg-blue-900 text-blue-200' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'dark' 
                        ? 'bg-green-900 text-green-200' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      Verified
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg text-center transition-transform hover:scale-105 ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-white'
              }`}
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <div className={`text-2xl font-bold mb-1 ${
                theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
              }`}>
                {stat.value}
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Account Settings */}
        <div className={`rounded-lg shadow-lg p-8 ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <Settings className={`w-6 h-6 ${
              theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
            }`} />
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-slate-100' : 'text-gray-900'
            }`}>
              Account Settings
            </h2>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              theme === 'dark' 
                ? 'border-slate-700 bg-slate-700/50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-slate-200' : 'text-gray-800'
              }`}>
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
                    Member since:
                  </span>
                  <span className={`ml-2 ${
                    theme === 'dark' ? 'text-slate-200' : 'text-gray-800'
                  }`}>
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
                    Last active:
                  </span>
                  <span className={`ml-2 ${
                    theme === 'dark' ? 'text-slate-200' : 'text-gray-800'
                  }`}>
                    Today
                  </span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${
              theme === 'dark' 
                ? 'border-slate-700 bg-slate-700/50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-slate-200' : 'text-gray-800'
              }`}>
                Privacy & Security
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>
                    Profile visibility
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    theme === 'dark' 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    Public
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}>
                    Email notifications
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    theme === 'dark' 
                      ? 'bg-blue-900 text-blue-200' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    Enabled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}