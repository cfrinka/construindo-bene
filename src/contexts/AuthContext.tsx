"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthState, signInEmailPassword, createUserEmailPassword, signOutFirebase, getUserData } from "@/lib/firebase";

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  name?: string; // Name from Firestore users collection
  role?: string; // User role from Firestore (default: "user")
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      unsubscribe = await onAuthState(async (firebaseUser) => {
        if (firebaseUser) {
          // Fetch user data from Firestore
          const userData = await getUserData(firebaseUser.uid);
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            name: (userData as any).ok ? (userData as any).data.name : firebaseUser.displayName,
            role: (userData as any).ok ? (userData as any).data.role : "user",
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInEmailPassword(email, password);
    if (!result.ok) throw new Error("Falha ao fazer login");
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const result = await createUserEmailPassword(email, password, displayName);
    if (!result.ok) throw new Error("Falha ao criar conta");
  };

  const signOut = async () => {
    const result = await signOutFirebase();
    if (!result.ok) throw new Error("Falha ao sair");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
