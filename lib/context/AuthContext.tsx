"use client";

import { AuthContextProps, UserProps } from "@/lib/types/context";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextProps>({
  user: null,
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch("/api/auth/status");
        if (!response.ok) throw new Error("Failed to verify user");

        const data = await response.json();
        if (data.isLoggedIn) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        router.push("/login");
      }
    };
    verifyUser();
  }, [router]);

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Failed to logout");

      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
