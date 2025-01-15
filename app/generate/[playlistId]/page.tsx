// page.tsx
import { getArtistGenres } from "@/server-actions/spotify/getArtistsGenres";
import { getPlaylistData } from "@/server-actions/spotify/getPlaylistData";
import GenerateClient from "./GenerateClient";
import { CustomPlaylistDataResponse, CustomTrack } from "@/types/custom";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

// Fonction pour initialiser les données (côté serveur)
async function initializePlaylistData(playlistId: string): Promise<{
  playlistInfos: CustomPlaylistDataResponse["infos"];
  customTracks: CustomTrack[];
}> {
  try {
    const playlistResponse = await getPlaylistData(playlistId);
    if (playlistResponse.error) {
      throw new Error(playlistResponse.error);
    }

    const playlistInfos = playlistResponse.data?.infos;
    const playlistTracks = playlistResponse.data?.tracks || [];
    const artistsIds = playlistTracks.map((item) => item.artists[0].id);

    const artistsGenresResponse = await getArtistGenres(artistsIds);
    if (artistsGenresResponse.error) {
      throw new Error(artistsGenresResponse.error);
    }

    const artistsGenres = artistsGenresResponse.data || [];

    // Transform data to custom track format
    const customTracks = playlistTracks.map((track) => {
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

    return { playlistInfos: playlistInfos!, customTracks };
  } catch (error) {
    console.error("Error initializing playlist data:", error);
    throw error;
  }
}

// Server component to generate client side component
export default async function GeneratePage({ params }: PageProps) {
  const { playlistId } = await params;
  const { playlistInfos, customTracks } = await initializePlaylistData(
    playlistId
  );

  return (
    <GenerateClient
      initialPlaylistInfos={playlistInfos}
      initialCustomTracks={customTracks}
    />
  );
}
