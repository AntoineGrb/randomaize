"use server";

import { cookies } from "next/headers";
import { SpotifyArtistGenre, SpotifyArtistsResponse } from "@/types/spotify";

export const getArtistGenres = async (
  artistIds: string[]
): Promise<SpotifyArtistGenre[]> => {
  if (artistIds.length === 0) {
    throw new Error("No artist IDs provided");
  }

  if (artistIds.length > 50) {
    throw new Error(
      "Too many artist IDs: Spotify API supports up to 50 IDs at once."
    );
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");
  if (!accessToken) {
    throw new Error("No access token found");
  }

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
    console.error("Error Response Body:", errorText);
    throw new Error("Failed to fetch genres for artists");
  }

  const data: SpotifyArtistsResponse = await response.json();

  return data.artists.map((artist) => ({
    artistId: artist.id,
    genres: artist.genres || [],
  }));
};
