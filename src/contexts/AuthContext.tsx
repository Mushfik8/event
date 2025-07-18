import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  website?: string;
  verified?: boolean;
  role?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('eventy_user') || sessionStorage.getItem('eventy_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('eventy_user');
        sessionStorage.removeItem('eventy_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user to storage whenever user changes
  useEffect(() => {
    if (user) {
      const userData = JSON.stringify(user);
      localStorage.setItem('eventy_user', userData);
      sessionStorage.setItem('eventy_user', userData);
    } else {
      localStorage.removeItem('eventy_user');
      sessionStorage.removeItem('eventy_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo user credentials
      if (email === 'user@example.com' && password === 'password123') {
        const demoUser: User = {
          id: 'user-1',
          name: 'John Doe',
          email: 'user@example.com',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Event enthusiast and community organizer',
          verified: true,
          role: 'user',
          createdAt: '2024-01-15T10:00:00Z'
        };
        setUser(demoUser);
        return;
      }

      // For any other credentials, create a demo user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        bio: 'New to Eventy!',
        verified: false,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        bio: 'New to Eventy!',
        verified: false,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventy_user');
    sessionStorage.removeItem('eventy_user');
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    // Check if Google Client ID is configured
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.warn('Google Client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file');
      throw new Error('Google login is not configured. Please contact the administrator.');
    }

    setIsLoading(true);
    try {
      // Initialize Google Sign-In
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: any) => {
            // Handle the response
            const demoUser: User = {
              id: `google-${Date.now()}`,
              name: 'Google User',
              email: 'google@example.com',
              avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
              bio: 'Signed in with Google',
              location: '',
              interests: []
            };
            setUser(demoUser);
          }
        });
        
        window.google.accounts.id.prompt();
      } else {
        throw new Error('Google Sign-In SDK not loaded');
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async (): Promise<void> => {
    // Check if Facebook App ID is configured
    const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
    if (!facebookAppId) {
      console.warn('Facebook App ID not configured. Please add VITE_FACEBOOK_APP_ID to your .env file');
      throw new Error('Facebook login is not configured. Please contact the administrator.');
    }

    setIsLoading(true);
    try {
      // For demo purposes, create a demo Facebook user
      const demoUser: User = {
        id: `facebook-${Date.now()}`,
        name: 'Facebook User',
        email: 'facebook@example.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Signed in with Facebook',
        verified: true,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      setUser(demoUser);
    } catch (error) {
      console.error('Facebook login error:', error);
      throw new Error('Facebook login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithApple = async (): Promise<void> => {
    setLoading(true);
    try {
      // For demo purposes, create a demo Apple user
      const demoUser: User = {
        id: `apple-${Date.now()}`,
        name: 'Apple User',
        email: 'apple@example.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'Signed in with Apple',
        verified: true,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      setUser(demoUser);
    } catch (error) {
      console.error('Apple login error:', error);
      throw new Error('Apple login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};