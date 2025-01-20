"use server";

import { CustomTrack } from "@/lib/types/custom";
import { OpenAIResponse } from "@/lib/types/openai";
import { validateAiResponse } from "@/lib/utils/validateAiResponse";
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
      throw new Error("Pas de token d'accès.");
    }

    // Get the OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Pas de clé OpenAI trouvée.");
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

    const headPrompt = `Tu es un assistant musical qui analyse des playlists et sélectionne des morceaux selon des critères spécifiques. Ton objectif est de proposer une liste de morceaux répondant au mieux au contexte, en utilisant les données fournies sur chaque morceau. Tu va recevoir 3 inputs ci-dessous : le contexte, la playlist et le nombre de morceaux souhaités. A partir de ces inpunts, tu devras :
  1. Identifier les morceaux correspondant aux critères définis dans la demande.
  2. Trier aléatoirement les morceaux correspondants. 
  3. Si le nombre de morceaux correspondants est inférieur au nombre de morceaux souhaités, compléter la liste par d'autres morceaux choisis aléatoirement dans la playlist transmise. Les morceaux pertinents sont retournés en premier dans la liste, et les morceaux complémentaires sont ajoutés à la fin.
  4. Retourner la liste des morceaux. Ta réponse doit contenir uniquement un tableau d'uris. Tout texte supplémentaire est interdit. La longueur du tableau doit être égale au nombre de morceaux souhaités. 
  Exemple de réponse : ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"].`;

    const contextPrompt = `Contexte: ${userPrompt}. Nombre de morceaux souhaités: ${limit}. Playlist: ${formattedPlaylist}.`;

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
      throw new Error("Erreur pour récupérer les données de l'API OpenAI");
    }

    const openAIResponse: OpenAIResponse = await response.json();

    const content = openAIResponse.choices[0]?.message.content;
    if (!content) {
      throw new Error("Pas de réponse fournie par OpenAI");
    }

    // Validate the JSON output
    if (!validateAiResponse(content)) {
      throw new Error("Réponse invalide de l'API OpenAI");
    }

    return { data: JSON.parse(content) };
  } catch (error) {
    console.error("Error in generateTracklist:", error);
    return {
      error: error instanceof Error ? error.message : "Erreur inconnue.",
    };
  }
};
