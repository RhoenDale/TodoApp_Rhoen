import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { APP_VERSION } from '@/constants/AppInfo';
import {
  fetchProfileRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  updateProfileRequest,
  type AuthResponse,
  type ProfileResponse,
  type User,
} from '@/lib/api';

type AuthContextValue = {
  token: string | null;
  user: User | null;
  apiVersion: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<ProfileResponse | null>;
  updateProfile: (updates: { name?: string; darkMode?: boolean }) => Promise<ProfileResponse>;
};

const AUTH_STORAGE_KEY = 'authSession';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [apiVersion, setApiVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveSession = async (session: AuthResponse) => {
    setToken(session.token);
    setUser(session.user);
    setApiVersion(session.apiVersion);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  };

  const clearSession = async () => {
    setToken(null);
    setUser(null);
    setApiVersion(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

        if (!storedSession) {
          return;
        }

        const parsedSession = JSON.parse(storedSession) as AuthResponse;
        setToken(parsedSession.token);
        setUser(parsedSession.user);
        setApiVersion(parsedSession.apiVersion);

        const profile = await fetchProfileRequest(parsedSession.token);
        setUser(profile.user);
        setApiVersion(profile.apiVersion);
        await AsyncStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ ...parsedSession, user: profile.user, apiVersion: profile.apiVersion })
        );
      } catch {
        await clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      apiVersion,
      isLoading,
      login: async (email: string, password: string) => {
        const session = await loginRequest(email, password, APP_VERSION);
        await saveSession(session);
        return session;
      },
      register: async (name: string, email: string, password: string) => {
        const session = await registerRequest(name, email, password, APP_VERSION);
        await saveSession(session);
        return session;
      },
      logout: async () => {
        if (token) {
          try {
            await logoutRequest(token);
          } catch {
            // The local session still needs to be cleared if the network fails.
          }
        }

        await clearSession();
      },
      refreshProfile: async () => {
        if (!token) {
          return null;
        }

        const profile = await fetchProfileRequest(token);
        setUser(profile.user);
        setApiVersion(profile.apiVersion);
        await AsyncStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ token, user: profile.user, apiVersion: profile.apiVersion })
        );
        return profile;
      },
      updateProfile: async (updates: { name?: string; darkMode?: boolean }) => {
        if (!token) {
          throw new Error('You must be logged in to update your profile.');
        }

        const profile = await updateProfileRequest(token, { ...updates, appVersion: APP_VERSION });
        setUser(profile.user);
        setApiVersion(profile.apiVersion);
        await AsyncStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ token, user: profile.user, apiVersion: profile.apiVersion })
        );
        return profile;
      },
    }),
    [apiVersion, isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
