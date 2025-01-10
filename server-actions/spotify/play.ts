"use server";

import { cookies } from "next/headers";

export const playOnActiveDevice = async (): Promise<void> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  // Envoyer une commande de lecture au device actif
  const playResponse = await fetch(
    "https://api.spotify.com/v1/me/player/play",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!playResponse.ok) {
    const playError = await playResponse.text();
    console.error("Failed to play on active device:", playError);
    throw new Error(`Failed to play on active device: ${playError}`);
  }
};
