import { getUserPlaylists } from "@/server-actions/spotify/getPlaylists";
import { CustomPlaylist } from "@/types/custom";

export default async function PlaylistsPage() {
  const playlists = await getUserPlaylists();

  return (
    <div>
      <h1>Playlists</h1>
      <ul>
        {playlists.map((playlist: CustomPlaylist) => (
          <li key={playlist.id}>
            <h2>{playlist.name}</h2>
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
