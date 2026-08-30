"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { AuthState, KinetixUser, getToken, setToken, clearToken } from "./session";
import { getCurrentUser, sendOtp, verifyOtp, resendOtp } from "./api-client";

interface AuthContextType extends AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOtp: typeof sendOtp;
  verifyOtp: (email: string, otp: string) => Promise<{ isNewUser: boolean }>;
  resendOtp: typeof resendOtp;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
  });

  const checkSession = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setState({ status: "unauthenticated", user: null });
      return;
    }

    try {
      const response = await getCurrentUser();
      setState({ status: "authenticated", user: response.data });
    } catch (error) {
      clearToken();
      setState({ status: "unauthenticated", user: null });
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const logout = useCallback(() => {
    clearToken();
    setState({ status: "unauthenticated", user: null });
  }, []);

  const handleVerifyOtp = useCallback(async (email: string, otp: string) => {
    const response = await verifyOtp(email, otp);
    const { token, user, isNewUser } = response.data;
    setToken(token);
    setState({ status: "authenticated", user });
    return { isNewUser };
  }, []);

  const value: AuthContextType = {
    ...state,
    isAuthenticated: state.status === "authenticated",
    isLoading: state.status === "loading",
    sendOtp,
    verifyOtp: handleVerifyOtp,
    resendOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
