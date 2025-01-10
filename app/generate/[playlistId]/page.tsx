// page.tsx
import { getArtistGenres } from "@/server-actions/spotify/getArtistsGenres";
import { getPlaylistItems } from "@/server-actions/spotify/getPlaylistItems";
import GenerateClient from "./GenerateClient";

// Fonction pour initialiser les données (côté serveur)
async function initializePlaylistData(playlistId: string) {
  try {
    const playlistItemsResponse = await getPlaylistItems(playlistId);
    if (playlistItemsResponse.error) {
      throw new Error(playlistItemsResponse.error);
    }

    const playlistItems = playlistItemsResponse.data || [];
    const artistsIds = playlistItems.map((item) => item.artists[0].id);

    const artistsGenresResponse = await getArtistGenres(artistsIds);
    if (artistsGenresResponse.error) {
      throw new Error(artistsGenresResponse.error);
    }

    const artistsGenres = artistsGenresResponse.data || [];
    const customTracks = playlistItems.map((track) => {
      const artistId = track.artists[0].id;
      const artistGenres = artistsGenres.find(
        (artist) => artist.artistId === artistId
      );
      return {
        id: track.id,
        name: track.name,
        artists: track.artists,
        genres: artistGenres?.genres || [],
        uri: track.uri,
        duration_ms: track.duration_ms,
      };
    });

    return { playlistItems, customTracks };
  } catch (error) {
    console.error("Error initializing playlist data:", error);
    return {
      playlistItems: [],
      customTracks: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Server component to generate client side component
export default async function GeneratePage({
  params,
}: {
  params: Record<string, string>;
}) {
  const { playlistId } = params;
  const { playlistItems, customTracks, error } = await initializePlaylistData(
    playlistId
  );

  return (
    <GenerateClient
      initialPlaylistItems={playlistItems}
      initialCustomTracks={customTracks}
    />
  );
}
