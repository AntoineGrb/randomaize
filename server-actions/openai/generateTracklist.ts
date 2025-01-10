"use server";

import { CustomTrack, CustomTrackReturnedByAI } from "@/types/custom";
import { OpenAIResponse } from "@/types/openai";
import { validateJSONOutput } from "@/utils/validateJSON";
import { cookies } from "next/headers";

export const generateTracklist = async (
  userPrompt: string,
  playlist: CustomTrack[],
  limit: number
): Promise<CustomTrackReturnedByAI[]> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("spotify_access_token");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const apiKey = process.env.OPENAI_API_KEY;

  const formattedPlaylist = playlist
    .map(
      (track) =>
        `Nom: ${track.name}; Artists: ${track.artists.join(
          ","
        )}; Genres: ${track.genres.join(",")}; Uri: ${track.uri}`
    )
    .join("\n");

  const headPrompt = `Tu es un assistant musical qui analyse des playlists et sélectionne des morceaux selon des critères spécifiques. Ton objectif est de proposer une liste de morceaux répondant au mieux au contexte, en utilisant les données fournies sur chaque morceau. À partir de la playlist transmise ci-dessous, tu devras:
  1. Identifier les morceaux correspondant aux critères définis dans la demande.
  2. Trier aléatoirement les morceaux pertinents.
  3. Retourner les morceaux pertinents. Si le nombre de morceaux pertinents est inférieur à la limite demandée, tu peux compléter la liste par d'autres morceaux de la playlist choisis aléatoirement. Si la playlist ne comporte pas assez de morceaux pour compléter jusqu'à la limite, tu retourneras le maximum de morceaux possibles. L'important est que les morceaux pertinents soient retournés en premier.
  Ta réponse doit contenir uniquement un tableau JSON d'objets avec le nom et l'uri du morceau. Tout texte supplémentaire est interdit.
  Le contexte, la playlist et la limite seront fournis dans chaque requête.`;

  const contextPrompt = `Contexte: ${userPrompt}. Playlist: ${formattedPlaylist}. Limite: ${limit}.`;

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
  console.log("OpenAiReponse:", openAIResponse);

  const content = openAIResponse.choices[0]?.message.content;
  if (!content) {
    throw new Error("No content found in OpenAI response");
  }
  let data: CustomTrackReturnedByAI[];

  try {
    data = validateJSONOutput(content);
  } catch (error: any) {
    console.error("Validation Error:", error.message);
    console.error("Full Response Content for Debugging:", content);
    throw new Error("The response from OpenAI is not valid JSON.");
  }

  return data;
};
