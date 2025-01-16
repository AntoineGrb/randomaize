/**
 * This function initializes the playlist data for the user.
 * It uses several server actions to get the playlist data, the artists genres and transform the tracks to a custom format.
 * @param playlistId The playlist ID
 * @returns The playlist infos and custom tracks
 */

"use server";

import { getArtistGenres } from "@/server-actions/spotify/getArtistsGenres";
import { getPlaylistData } from "@/server-actions/spotify/getPlaylistData";
import { CustomPlaylistDataResponse, CustomTrack } from "@/types/custom";

export async function initializePlaylistData(playlistId: string): Promise<{
  playlistInfos: CustomPlaylistDataResponse["infos"];
  customTracks: CustomTrack[];
}> {
  try {
    // Récupérer les données de la playlist
    const playlistResponse = await getPlaylistData(playlistId, 300);
    if (playlistResponse.error) {
      throw new Error(playlistResponse.error);
    }

    const playlistInfos = playlistResponse.data?.infos;
    const playlistTracks = (playlistResponse.data?.tracks || []).filter(
      (track) => track.id !== null && track.id !== undefined
    );

    // Get artists genres
    const artistsIds = Array.from(
      new Set(playlistTracks.map((item) => item.artists[0]?.id))
    );
    const artistsGenresResponse = await getArtistGenres(artistsIds);
    if (artistsGenresResponse.error) {
      throw new Error(artistsGenresResponse.error);
    }

    const artistsGenres = artistsGenresResponse.data || [];

    // Transform tracks to custom format
    const customTracks: CustomTrack[] = playlistTracks.map((track) => {
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
    console.error("Error in initializePlaylistData:", error);
    throw error;
  }
}
