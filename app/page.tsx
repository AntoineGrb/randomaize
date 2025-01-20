import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");

  if (accessToken) {
    redirect("/playlists");
  } else {
    redirect("/login");
  }
}
