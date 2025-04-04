/**
 * Get genres for a list of artists.
 * The Spotify API allows to get genres for up to 50 artists at once. The function divides the list of artists into chunks of 50 and calls the API for each chunk.
 * @param artistIds The list of artist IDs
 * @returns The genres for each artist or an error message
 */

"use server";

import { SpotifyArtistGenre, SpotifyArtistsResponse } from "@/types/spotify";
import { cookies } from "next/headers";

export const getArtistGenres = async (
  artistIds: string[]
): Promise<{ data?: SpotifyArtistGenre[]; error?: string }> => {
  const nbArtists = artistIds.length;
  try {
    // Verify input
    if (nbArtists === 0) {
      throw new Error("No artist IDs provided.");
    }

    // Get access token
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token");
    if (!accessToken) {
      throw new Error("Pas de token d'accès.");
    }

    //Divide artistIds into chunks of 50
    const chunkSize = 50;
    const chunks = [];
    for (let i = 0; i < nbArtists; i += chunkSize) {
      chunks.push(artistIds.slice(i, i + chunkSize));
    }

    const artistsGenres: SpotifyArtistGenre[] = [];

    // Call Spotify API to get genres for each chunk
    for (const chunk of chunks) {
      const response = await fetch(
        `https://api.spotify.com/v1/artists?ids=${chunk.join(",")}`,
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

      //Transform data
      const chunkGenres = data.artists.map((artist) => ({
        artistId: artist.id,
        genres: artist.genres || [],
      }));

      artistsGenres.push(...chunkGenres);
    }

    return { data: artistsGenres };
  } catch (error) {
    console.error("Error in getArtistsGenres:", error);
    return {
      error:
        error instanceof Error ? error.message : "Erreur inconnue occurred.",
    };
  }
};
