"use server";

import { CustomPlaylistDataResponse } from "@/types/custom";
import { SpotifyPlaylistResponse } from "@/types/spotify";
import { cookies } from "next/headers";

export const getPlaylistData = async (
  playlistId: string
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
      throw new Error("No access token found");
    }

    //Call Spotify API
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
      nbTracks: data.tracks.total,
    };

    //Transform data
    const tracks = data.tracks.items.map(({ track }) => ({
      id: track.id,
      name: track.name,
      uri: track.uri,
      duration_ms: track.duration_ms,
      artists: track.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
      })),
    }));

    return { data: { infos, tracks } };
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};
