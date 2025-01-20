/**
 * This function adds the tracks to the queue and plays them.
 * @param uris The URIs of the tracks to add
 * @returns A success message or an error message
 */

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
      throw new Error("Pas de token d'accès.");
    }

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
        throw new Error(`Réponse invalide de la part de l'API Spotify.`);
      }
    } catch (error: any) {
      console.error(`Error adding tracks:`, error);
      throw new Error(`Erreur en ajoutant les morceaux : ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error(
      "Erreur pour ajouter les morceaux à la file d'attente:",
      error
    );
    return {
      error: error instanceof Error ? error.message : "Erreur inconnue.",
    };
  }
};
