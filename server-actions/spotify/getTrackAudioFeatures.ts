"use server";

import { cookies } from "next/headers";
import { AudioFeatures, SpotifyAudioFeaturesResponse } from "@/types/spotify";

export const getTrackAudioFeatures = async (
  trackIds: string[]
): Promise<AudioFeatures[]> => {
  if (trackIds.length === 0) {
    throw new Error("No track IDs provided");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const ids = trackIds.join(",");
  const response = await fetch(
    `https://api.spotify.com/v1/audio-features?ids=${ids}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch audio features");
  }

  const data: SpotifyAudioFeaturesResponse = await response.json();

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
