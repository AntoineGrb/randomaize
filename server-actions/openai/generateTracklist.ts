"use server";

import { CustomTrack } from "@/types/custom";
import { OpenAIResponse } from "@/types/openai";
import { validateAiResponse } from "@/utils/validateAiResponse";
import { cookies } from "next/headers";

export const generateTracklist = async (
  userPrompt: string,
  playlist: CustomTrack[],
  limit: number
): Promise<{ data?: string[]; error?: string }> => {
  try {
    // Get the access token
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("spotify_access_token");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    // Get the OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key is missing.");
    }

    // Prepare prompt
    const formattedPlaylist = playlist
      .map(
        (track) =>
          `Nom: ${track.name}; Artists: ${track.artists.join(
            ","
          )}; Genres: ${track.genres.join(",")}; Uri: ${track.uri}`
      )
      .join("\n");

    const headPrompt = `Tu es un assistant musical qui analyse des playlists et sélectionne des morceaux selon des critères spécifiques. Ton objectif est de proposer une liste de morceaux répondant au mieux au contexte, en utilisant les données fournies sur chaque morceau. À partir du contexte, de la playlist et du nombre de morceaux transmis ci-dessous, tu devras:
  1. Identifier les morceaux correspondant aux critères définis dans la demande.
  2. Trier aléatoirement les morceaux pertinents. 
  3. Si le nombre de morceaux pertinents est inférieur au nombre de morceaux souhaités, complètes la liste par des morceaux complémentaires choisis aléatoirement dans la playlist transmise.
  4. Retourne les morceaux pertinents en premier, et à la suite les éventuels morceaux complémentaires.
  Ta réponse doit contenir uniquement un tableau d'uris. Tout texte supplémentaire est interdit. Exemple : ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"].`;

    const contextPrompt = `Contexte: ${userPrompt}. Nombre de morceaux souhaités: ${limit}. Playlist: ${formattedPlaylist}.`;

    console.log("Context Prompt:", contextPrompt);

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: headPrompt },
          { role: "user", content: contextPrompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch playlist items");
    }

    const openAIResponse: OpenAIResponse = await response.json();
    console.log(
      "!!!! OpenAiReponse:",
      openAIResponse.choices[0]?.message.content
    );

    const content = openAIResponse.choices[0]?.message.content;
    if (!content) {
      throw new Error("No content found in OpenAI response");
    }

    // Validate the JSON output
    if (!validateAiResponse(content)) {
      throw new Error("Invalid JSON output from OpenAI");
    }

    return { data: JSON.parse(content) };
  } catch (error) {
    console.error("Error in generateTracklist:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred.",
    };
  }
};
