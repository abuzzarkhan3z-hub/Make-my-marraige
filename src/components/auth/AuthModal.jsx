import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { X, Sparkles, Mail, Lock, User, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalView,
    setAuthModalView,
    signIn,
    signUp,
    resetPassword,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSwitchView = (view) => {
    setErrorMessage('');
    setSuccessMessage('');
    setAuthModalView(view);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (authModalView === 'login') {
        await signIn({ email, password });
        closeAuthModal();
        resetForm();
      } else if (authModalView === 'signup') {
        if (!email || !password || !fullName) {
          throw new Error('Please fill in your name, email, and password.');
        }
        await signUp({ email, password, fullName, phone });
        setSuccessMessage('Account created! Please check your email inbox if confirmation is required, or sign in.');
        setTimeout(() => {
          closeAuthModal();
          resetForm();
        }, 1500);
      } else if (authModalView === 'forgot_password') {
        if (!email) throw new Error('Please provide your email address.');
        await resetPassword(email);
        setSuccessMessage('Password reset instructions sent to your email.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-modal border border-stone-100 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-sage-800 to-sage-700 px-6 py-6 text-white text-center relative">
          <button
            onClick={closeAuthModal}
            className="absolute right-4 top-4 text-white/70 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-2.5 backdrop-blur-xs">
            <Sparkles className="w-5 h-5 text-gold-300" />
          </div>
          <h2 className="font-serif text-xl font-bold text-ivory-50">
            {authModalView === 'login' && 'Sign in to Make My Marriage'}
            {authModalView === 'signup' && 'Create your Wedding Account'}
            {authModalView === 'forgot_password' && 'Reset Password'}
          </h2>
          <p className="text-xs text-sage-200 mt-1">
            {authModalView === 'login' && 'Access and coordinate your wedding planning workspace.'}
            {authModalView === 'signup' && 'Start organizing your celebrations with your family.'}
            {authModalView === 'forgot_password' && 'Enter your registered email to receive a reset link.'}
          </p>
        </div>

        {/* View Switcher Tabs (Login / Signup) */}
        {authModalView !== 'forgot_password' && (
          <div className="flex border-b border-stone-100 bg-stone-50/60 p-1">
            <button
              type="button"
              onClick={() => handleSwitchView('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authModalView === 'login'
                  ? 'bg-white text-sage-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchView('signup')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authModalView === 'signup'
                  ? 'bg-white text-sage-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {authModalView === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:border-sage-600 focus:ring-1 focus:ring-sage-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:border-sage-600 focus:ring-1 focus:ring-sage-600 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:border-sage-600 focus:ring-1 focus:ring-sage-600 transition-colors"
              />
            </div>
          </div>

          {authModalView !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-stone-700">
                  Password *
                </label>
                {authModalView === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchView('forgot_password')}
                    className="text-[11px] text-sage-700 hover:text-sage-900 font-medium underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:border-sage-600 focus:ring-1 focus:ring-sage-600 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center py-2.5 text-sm"
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : authModalView === 'login'
                ? 'Sign In'
                : authModalView === 'signup'
                ? 'Create Account'
                : 'Send Reset Link'}
            </Button>
          </div>

          {authModalView === 'forgot_password' && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => handleSwitchView('login')}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium"
              >
                &larr; Back to Sign In
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
