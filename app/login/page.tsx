"use client";

import Footer from "@/components/Footer";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "/api/auth/login"; // Redirect to the login API
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center">
      <main>
        <p className="text-center pb-4">
          Laisse l'IA réinventer la lecture aléatoire de tes playlists Spotify
          en fonction de ton humeur.
        </p>
        <button
          onClick={handleLogin}
          className=" w-48 py-3 mb-8 rounded-3xl bg-green-700 hover:bg-green-800 text-white"
        >
          Connexion à Spotify
        </button>
      </main>
      <Footer />
    </div>
  );
}
