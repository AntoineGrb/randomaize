/**
 * Check if a device is active and available to play music.
 * @returns A success message or an error message
 */

"use server";

import { cookies } from "next/headers";

export const checkDevice = async (): Promise<{
  success?: boolean;
  error?: string;
}> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token");
    if (!accessToken) {
      throw new Error("Pas de token d'accès.");
    }

    // Récupère la liste des devices
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/devices",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des appareils.");
    }

    const data = await response.json();
    const devices = data.devices;

    // Verify if an active device is available
    const activeDevice = devices.find((device: any) => device.is_active);
    if (activeDevice) {
      return { success: true };
    }

    // If no active device is found, check for an available device to activate
    const availableDevice = devices.find((device: any) => device.is_available);
    if (availableDevice) {
      const transferResponse = await fetch(
        "https://api.spotify.com/v1/me/player",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ device_ids: [availableDevice.id] }),
        }
      );

      if (transferResponse.ok) {
        return { success: true };
      } else {
        throw new Error("Erreur pour activer l'appareil disponible.");
      }
    }

    throw new Error(`
      Pas d'appareil actif trouvé.
      Veuillez lancer Spotify sur un appareil pour continuer.
    `);
  } catch (error) {
    console.error("Error in checkDevice:", error);
    return { error: error instanceof Error ? error.message : "Erreur inconue" };
  }
};
