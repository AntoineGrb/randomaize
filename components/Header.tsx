"use client";

export default function Header() {
  return (
    <header className="flex justify-between items-center h-16 border-b-2 border-white p-2 bg-spotify-black text-spotify-white">
      <div className="flex gap-2 items-center">
        <p>Logo</p>
        <p className="text-2xl font-bold">Randomaize</p>
      </div>
      <div className="flex gap-2 items-center">
        <p>User</p>
        <p>Logout</p>
      </div>
    </header>
  );
}
