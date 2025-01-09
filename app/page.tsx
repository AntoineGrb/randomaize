import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");

  if (accessToken) {
    // Si l'utilisateur est authentifié, redirige vers /playlists
    redirect("/playlists");
  } else {
    // Sinon, redirige vers /login
    redirect("/login");
  }
}
