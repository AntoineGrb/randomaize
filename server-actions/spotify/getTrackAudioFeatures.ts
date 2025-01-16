/! Deprecated sur l'API Spotify, il faut trouver une autre solution externe pour récupérer les features des tracks /;

("use server");

import { AudioFeatures, SpotifyAudioFeaturesResponse } from "@/types/spotify";
import { cookies } from "next/headers";

export const getTrackAudioFeatures = async (
  trackIds: string
): Promise<AudioFeatures[]> => {
  if (trackIds === "") {
    throw new Error("No track IDs provided");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");
  if (!accessToken) {
    throw new Error("Pas de token d'accès found");
  }

  console.log("Access Token:", accessToken.value);
  console.log("Track IDs:", trackIds);

  const response = await fetch(
    `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    }
  );

  console.log("Response Status:", response.status);

  if (!response.ok) {
    throw new Error("Failed to fetch audio features");
  }

  const data: SpotifyAudioFeaturesResponse = await response.json();
  console.log("Response Data:", data);

  return data.audio_features.map((feature) => ({
    id: feature.id,
    energy: feature.energy,
    danceability: feature.danceability,
    instrumentalness: feature.instrumentalness,
    tempo: feature.tempo,
    valence: feature.valence,
    speechiness: feature.speechiness,
  }));
};
