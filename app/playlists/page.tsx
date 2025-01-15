import { getUserPlaylists } from "@/server-actions/spotify/getUserPlaylists";
import { CustomPlaylist } from "@/types/custom";
import Link from "next/link";

export default async function PlaylistsPage() {
  const playlists = await getUserPlaylists();

  return (
    <div className="px-4 py-24">
      <h1 className="mb-6 font-semibold"> Sélectionne une playlist </h1>

      <ul className="w-full flex flex-col gap-2">
        {playlists.map((playlist: CustomPlaylist) => (
          <Link href={`/generate/${playlist.id}`} key={playlist.id}>
            <li className="flex gap-2 items-center border-b-2 border-gray-700 pb-2 cursor-pointer">
              {playlist.image && (
                <img src={playlist.image} alt={playlist.name} width="80" />
              )}
              <div>
                <h2 className="text-lg">{playlist.name}</h2>
                <p className="text-spotify-gray-light text-sm">
                  {playlist.trackCount} morceaux{" "}
                </p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
