"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useState, ReactNode } from "react";
import { SignInModal } from "./SignInModal";

interface AuthContextType {
  openSignInModal: () => void;
  closeSignInModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const openSignInModal = () => setIsSignInOpen(true);
  const closeSignInModal = () => setIsSignInOpen(false);

  return (
    <AuthContext.Provider value={{ openSignInModal, closeSignInModal }}>
      <SessionProvider>
        {children}
        <SignInModal isOpen={isSignInOpen} onClose={closeSignInModal} />
      </SessionProvider>
    </AuthContext.Provider>
  );
}
