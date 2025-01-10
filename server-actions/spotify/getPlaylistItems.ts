"use server";

import { SpotifyPlaylistItemsResponse, SpotifyTrack } from "@/types/spotify";
import { cookies } from "next/headers";

export const getPlaylistItems = async (
  playlistId: string
): Promise<{ data?: SpotifyTrack[]; error?: string }> => {
  try {
    //Verify input
    if (!playlistId) {
      throw new Error("No playlist ID provided");
    }

    //Get access token
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    //Call Spotify API
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch playlist items");
    }

    const data: SpotifyPlaylistItemsResponse = await response.json();

    //Transform data
    const tracks = data.items.map(({ track }) => ({
      id: track.id,
      name: track.name,
      uri: track.uri,
      duration_ms: track.duration_ms,
      artists: track.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
      })),
    }));

    return { data: tracks };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};
