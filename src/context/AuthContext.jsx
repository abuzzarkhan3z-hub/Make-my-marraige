import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState('login'); // 'login' | 'signup' | 'forgot_password'

  // Fetch or refresh user profile from public.profiles
  const fetchProfile = async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.warn('Could not fetch user profile:', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
      }
      setSession(initialSession);
      setUser(initialSession?.user || null);
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id);
      }
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);

        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up
  const signUp = async ({ email, password, fullName, phone }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet. Please check your .env.local file.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
          name: fullName || '',
          phone: phone || '',
        },
      },
    });

    if (error) throw error;
    return data;
  };

  // Sign in
  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet. Please check your .env.local file.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  // Sign out
  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      setProfile(null);
      setSession(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  // Password reset email
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured yet.');
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}`,
    });

    if (error) throw error;
    return data;
  };

  // Update profile
  const updateProfile = async ({ fullName, phone, avatarUrl }) => {
    if (!isSupabaseConfigured || !supabase || !user) {
      throw new Error('User not authenticated.');
    }

    const updates = {
      updated_at: new Date().toISOString(),
    };
    if (fullName !== undefined) updates.full_name = fullName;
    if (phone !== undefined) updates.phone = phone;
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  const openAuthModal = (view = 'login') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        isAuthModalOpen,
        authModalView,
        setAuthModalView,
        openAuthModal,
        closeAuthModal,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
