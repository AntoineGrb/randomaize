/**
 * The function gets the data for a Spotify playlist (infos and tracks). For tracks, it fetches all the tracks in the playlist (max 100 per request).
 * @param playlistId The ID of the playlist
 * @returns The playlist infos and tracks or an error message
 */

"use server";

import { CustomPlaylistDataResponse } from "@/lib/types/custom";
import { SpotifyPlaylistResponse, SpotifyTrack } from "@/lib/types/spotify";
import { cookies } from "next/headers";

export const getPlaylistData = async (
  playlistId: string,
  nbTracksMax: number
): Promise<{
  data?: CustomPlaylistDataResponse;
  error?: string;
}> => {
  try {
    //Verify input
    if (!playlistId) {
      throw new Error("No playlist ID provided");
    }

    //Get access token
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token");
    if (!accessToken) {
      throw new Error("Pas de token d'accès found");
    }

    //Get playlist infos
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch playlist items");
    }

    const data: SpotifyPlaylistResponse = await response.json();

    const infos = {
      id: data.id,
      name: data.name,
      image: data.images.length > 0 ? data.images[0].url : null,
      ownerName: data.owner.display_name,
      nbTracks: data.tracks.total,
    };

    //Get playlist tracks (max 100 per request, max 500 tracks)
    const fetchAllTracks = async (): Promise<SpotifyTrack[]> => {
      let tracks: SpotifyTrack[] = [];
      let nextUrl:
        | string
        | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

      while (nextUrl && tracks.length < nbTracksMax) {
        const response = await fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch playlist items");
        }

        const pageData: SpotifyPlaylistResponse["tracks"] =
          await response.json();

        const newTracks = pageData.items.map(({ track }) => ({
          id: track.id,
          name: track.name,
          uri: track.uri,
          duration_ms: track.duration_ms,
          artists: track.artists.map((artist) => ({
            id: artist.id,
            name: artist.name,
          })),
        }));

        tracks = [...tracks, ...newTracks];

        if (tracks.length > nbTracksMax) {
          tracks = tracks.slice(0, nbTracksMax);
        }

        nextUrl = pageData.next;
      }
      return tracks;
    };

    const tracks = await fetchAllTracks();

    return { data: { infos, tracks } };
  } catch (error) {
    console.error(error);
    return {
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
};
