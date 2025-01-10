"use server";

import { cookies } from "next/headers";

export const addTracksToPlaybackQueue = async (
  uris: string[]
): Promise<{ success?: boolean; error?: string }> => {
  try {
    // Verify input
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token");
    if (!accessToken) {
      throw new Error("No access token found.");
    }

    // Call Spotify API for each track
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
          const errorText = await response.text();
          throw new Error(
            `Failed to add item ${uri} to playback queue. Status: ${response.status}. Response: ${errorText}`
          );
        }

        // Delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: any) {
        console.error(`Error adding track ${uri} to queue:`, error);
        throw new Error(`Error adding track ${uri} to queue: ${error.message}`);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error in addTracksToPlaybackQueue:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
};
