"use client";

import { LogOut } from "lucide-react";

export default function Header() {
  const handleLogout = () => {
    window.location.href = "/api/auth/logout"; // Appelle la route logout
  };

  return (
    <header className="flex justify-between items-center h-16 border-b-2 border-white p-2 bg-spotify-black text-spotify-white">
      <div className="flex gap-2 items-center">
        <img src="/assets/logo-robot.png" alt="logo" className="w-[48px]" />
        <p className="text-2xl font-bold">Randomaize</p>
      </div>
      <div className="flex gap-2 items-center">
        <p>User</p>
        <LogOut onClick={handleLogout} className=" cursor-pointer" />
      </div>
    </header>
  );
}
