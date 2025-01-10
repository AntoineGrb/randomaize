"use server";

import { SpotifyArtistGenre, SpotifyArtistsResponse } from "@/types/spotify";
import { cookies } from "next/headers";

export const getArtistGenres = async (
  artistIds: string[]
): Promise<{ data?: SpotifyArtistGenre[]; error?: string }> => {
  try {
    // Verify input
    if (artistIds.length === 0) {
      throw new Error("No artist IDs provided.");
    }

    if (artistIds.length > 50) {
      throw new Error(
        "Too many artist IDs: Spotify API supports up to 50 IDs at once."
      );
    }

    // Get access token
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token");
    if (!accessToken) {
      throw new Error("No access token found.");
    }

    // Call Spotify API
    const response = await fetch(
      `https://api.spotify.com/v1/artists?ids=${artistIds.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch genres for artists. Status: ${response.status}. Body: ${errorText}`
      );
    }

    const data: SpotifyArtistsResponse = await response.json();

    // Transform data
    const artistGenres = data.artists.map((artist) => ({
      artistId: artist.id,
      genres: artist.genres || [],
    }));

    return { data: artistGenres };
  } catch (error) {
    console.error("Error in getArtistGenres:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
};
