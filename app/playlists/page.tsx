import { getUserPlaylists } from "@/server-actions/spotify/getUserPlaylists";
import { CustomPlaylist } from "@/types/custom";
import Link from "next/link";

export default async function PlaylistsPage() {
  const playlists = await getUserPlaylists();

  return (
    <div>
      <h1>Playlists</h1>
      <ul>
        {playlists.map((playlist: CustomPlaylist) => (
          <li key={playlist.id}>
            <h2>{playlist.name}</h2>
            <Link href={`/generate/${playlist.id}`}>
              <p> Sélectionner</p>
            </Link>
            <p>{playlist.description}</p>
            {playlist.image && (
              <img src={playlist.image} alt={playlist.name} width="100" />
            )}
            <p>Tracks: {playlist.trackCount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
