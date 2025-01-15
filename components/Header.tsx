"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center h-16 border-b-2 border-white p-2 bg-spotify-black text-spotify-white">
      <div className="flex gap-2 items-center">
        <img src="/assets/logo-robot.png" alt="logo" className="w-[48px]" />
        <p className="text-2xl font-bold">
          Random<span className="text-spotify-green">ai</span>ze
        </p>
      </div>
      <div className="flex gap-2 items-center">
        {user && (
          <>
            <img
              src={user.images?.[0]?.url}
              alt="profile"
              className="w-9 h-9 rounded-full"
            />
            <LogOut onClick={logout} className=" cursor-pointer" />
          </>
        )}
      </div>
    </header>
  );
}
