"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="absolute w-full flex justify-between items-center max-w-[500px] mx-auto h-16 border-b-2 border-white p-2 bg-spotify-black text-spotify-white ">
      <div className="flex gap-2 items-center">
        <img
          src="/assets/logo-randomaize.png"
          alt="logo"
          className="w-[180px]"
        />
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
