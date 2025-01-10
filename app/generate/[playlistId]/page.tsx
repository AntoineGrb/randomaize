// page.tsx
import { getArtistGenres } from "@/server-actions/spotify/getArtistsGenres";
import { getPlaylistItems } from "@/server-actions/spotify/getPlaylistItems";
import { CustomTrack } from "@/types/custom";
import { use } from "react";
import GenerateClient from "./GenerateClient";

// Fonction pour initialiser les données (côté serveur)
async function initializePlaylistData(playlistId: string) {
  try {
    const playlistItems = (await getPlaylistItems(playlistId)).data || [];
    const artistsIds = playlistItems.map((item) => item.artists[0].id);
    const artistsGenres = (await getArtistGenres(artistsIds)).data || [];

    const customTracks: CustomTrack[] = playlistItems.map((track) => {
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

    return {
      playlistItems,
      customTracks,
    };
  } catch (error) {
    console.error(error);
    return { playlistItems: [], customTracks: [] };
  }
}

// Composant serveur
export default function GeneratePage({
  params,
}: {
  params: { playlistId: string };
}) {
  const playlistId = use(Promise.resolve(params.playlistId));
  const { playlistItems, customTracks } = use(
    initializePlaylistData(playlistId)
  );

  if (playlistItems.length === 0 || customTracks.length === 0) {
    return (
      <p style={{ color: "red" }}>
        Failed to load playlist data. Please try again.
      </p>
    );
  }

  return (
    <GenerateClient
      initialPlaylistItems={playlistItems}
      initialCustomTracks={customTracks}
    />
  );
}
