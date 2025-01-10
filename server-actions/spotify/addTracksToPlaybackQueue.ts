"use server";

import { cookies } from "next/headers";

export const addTracksToPlaybackQueue = async (
  uris: string[]
): Promise<void> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  for (const uri of uris) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(
          uri
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add item ${uri} to playback queue`);
      }

      // Delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error adding track ${uri} to queue:`, error);
      throw error;
    }
  }
};
