import React, { useState } from 'react';
import { Calendar, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, loginWithGoogle, loginWithFacebook, loginWithApple } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    setError('');

    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else if (provider === 'facebook') {
        await loginWithFacebook();
      } else {
        await loginWithApple();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center px-4 py-12 transition-colors duration-200">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">Eventy</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            {isLogin ? 'Welcome back! Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-light-bg dark:bg-dark-bg-secondary rounded-2xl p-8 shadow-lg border border-light-border dark:border-dark-border">
          {error && (
            <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg text-error-600 dark:text-error-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted hover:text-light-text-secondary dark:hover:text-dark-text-secondary transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* OAuth Buttons */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-light-border dark:border-dark-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-light-bg dark:bg-dark-bg-secondary text-light-text-muted dark:text-dark-text-muted">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
                className="w-full inline-flex justify-center py-3 px-4 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text hover:bg-light-bg-tertiary dark:hover:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                onClick={() => handleOAuthLogin('facebook')}
                disabled={loading}
                className="w-full inline-flex justify-center py-3 px-4 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text hover:bg-light-bg-tertiary dark:hover:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2">Facebook</span>
              </button>

              <button
                onClick={() => handleOAuthLogin('apple')}
                disabled={loading}
                className="w-full inline-flex justify-center py-3 px-4 border border-light-border dark:border-dark-border rounded-lg bg-light-bg dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text hover:bg-light-bg-tertiary dark:hover:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                <span className="ml-2">Apple</span>
              </button>
            </div>
          </div>

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors duration-200"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold">
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;