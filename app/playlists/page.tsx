import { CustomPlaylist } from "@/lib/types/custom";
import { getUserPlaylists } from "@/lib/actions/spotify/getUserPlaylists";
import Link from "next/link";

export default async function PlaylistsPage() {
  const playlists = await getUserPlaylists();

  return (
    <div className="px-4 py-24">
      <h1 className="font-semibold"> Sélectionne une playlist </h1>

      <h2 className="mb-4 mt-6"> Tes playlists </h2>
      <ul className="w-full flex flex-col gap-2">
        {playlists
          .filter(
            (playlist: CustomPlaylist) => playlist.ownerName === "Antoine Grb"
          )
          .map((playlist: CustomPlaylist) => (
            <Link href={`/generate/${playlist.id}`} key={playlist.id}>
              <li className="flex gap-2 items-center border-b-2 border-gray-700 pb-2 cursor-pointer min-h-[90px]">
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

      <h2 className="mb-4 mt-6"> Playlists suivies </h2>
      {playlists
        .filter(
          (playlist: CustomPlaylist) => playlist.ownerName !== "Antoine Grb"
        )
        .map((playlist: CustomPlaylist) => (
          <Link href={`/generate/${playlist.id}`} key={playlist.id}>
            <li className="flex gap-2 items-center border-b-2 border-gray-700 pb-2 cursor-pointer min-h-[90px]">
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
    </div>
  );
}
