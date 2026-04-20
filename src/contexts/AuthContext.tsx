import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "@/utils/types";
import { getCurrentUser, signIn as svcSignIn, signOut as svcSignOut, signUp as svcSignUp } from "@/services/api";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (input: { fullName: string; email: string; password: string; businessName: string; country: string }) => Promise<User>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await svcSignIn(email, password);
    setUser(u);
    return u;
  }, []);

  const signUp = useCallback(async (input: Parameters<typeof svcSignUp>[0]) => {
    const u = await svcSignUp(input);
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(async () => {
    await svcSignOut();
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
