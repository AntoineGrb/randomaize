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
      throw new Error("No access token found.");
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
      throw new Error("Failed to fetch devices.");
    }

    const data = await response.json();
    const devices = data.devices;
    console.log("Devices:", devices);

    // Vérifie si un device actif est disponible
    const activeDevice = devices.find((device: any) => device.is_active);
    if (activeDevice) {
      return { success: true }; // Device actif trouvé
    }

    // Si aucun device actif, mais un device disponible
    const availableDevice = devices.find((device: any) => device.is_available);
    if (availableDevice) {
      // Tente de transférer la lecture sur ce device
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
        return { success: true }; // Device activé avec succès
      } else {
        throw new Error("Failed to activate the selected device.");
      }
    }

    throw new Error(
      "No active devices found. Please open Spotify on a device and try again."
    );
  } catch (error) {
    console.error("Error in checkDevice:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};
