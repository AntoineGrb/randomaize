"use server";

import { cookies } from "next/headers";

export const skipToNext = async (): Promise<{
  success?: boolean;
  error?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token");
    if (!accessToken) {
      throw new Error("No access token found.");
    }

    // Appelle le endpoint pour passer au morceau suivant
    const response = await fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to skip to the next track. Status: ${response.status}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error in skipToNext:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};
