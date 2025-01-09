"use server";

import { cookies } from "next/headers";
import { SpotifyTrack, SpotifyPlaylistItemsResponse } from "@/types/spotify";

export const getPlaylistItems = async (
  playlistId: string
): Promise<SpotifyTrack[]> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");
  if (!accessToken) {
    throw new Error("No access token found");
  }

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

  return data.items.map(({ track }) => ({
    id: track.id,
    name: track.name,
    uri: track.uri,
    duration_ms: track.duration_ms,
    artists: track.artists.map((artist) => ({ name: artist.name })),
  }));
};
