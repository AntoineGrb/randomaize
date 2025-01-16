/**
 * The function gets the snapshot ID of a playlist. It allows to know if the playlist has been modified since the last time it was fetched.
 * @param playlistId The ID of the playlist
 * @returns The snapshot ID of the playlist
 */

"use server";

import { cookies } from "next/headers";

export const getPlaylistSnapshotId = async (
  playlistId: string
): Promise<string> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");
  if (!accessToken) {
    throw new Error("Pas de token d'accès found");
  }

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlist snapshot");
  }

  const data = await response.json();
  return data.snapshot_id; // Return the snapshot ID
};
