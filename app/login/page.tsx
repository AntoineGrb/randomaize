"use client";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "/api/auth/login"; // Redirect to the login API
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Connectez-vous à Spotify</h1>
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
}
