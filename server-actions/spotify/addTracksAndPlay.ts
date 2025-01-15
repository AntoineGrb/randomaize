"use server";

import { cookies } from "next/headers";

export const addTracksAndPlay = async (
  uris: string[]
): Promise<{ success?: boolean; error?: string }> => {
  try {
    // Verify input
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token");
    if (!accessToken) {
      throw new Error("No access token found.");
    }

    const body = JSON.stringify({
      uris: uris,
    });
    console.log("Request Body:", body);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
          body: JSON.stringify({
            uris: uris,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error Status: ${response.status}`);
        console.error(`Error Body: ${errorText}`);
        throw new Error(
          `Failed to add tracks to playback queue. Status: ${response.status}. Response: ${errorText}`
        );
      }
    } catch (error: any) {
      console.error(`Error adding tracks:`, error);
      throw new Error(`Error adding tracks: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error in addTracksToPlaybackQueue:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
};
