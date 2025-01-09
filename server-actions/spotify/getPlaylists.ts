"use server";

import { CustomPlaylist } from "@/types/custom";
import { SpotifyPlaylist } from "@/types/spotify";
import { cookies } from "next/headers";

export const getUserPlaylists = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }

  const data = await response.json();
  return data.items.map((playlist: SpotifyPlaylist) => ({
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    image:
      playlist.images && playlist.images.length > 0
        ? playlist.images[0].url
        : null,
    trackCount: playlist.tracks.total,
  }));
};
