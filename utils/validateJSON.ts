//! Depracated : THe response format is not JSON anymore but array of uriss
import { CustomTrackReturnedByAI } from "@/types/custom";

export const validateJSONOutput = (
  content: string
): CustomTrackReturnedByAI[] => {
  try {
    const parsed = JSON.parse(content);

    // Vérifie si c'est un tableau d'objets
    if (!Array.isArray(parsed)) {
      throw new Error("Output is not a JSON array.");
    }

    // Vérifie si chaque objet contient les champs requis
    parsed.forEach((item) => {
      if (
        typeof item.name !== "string" ||
        typeof item.uri !== "string" ||
        (item.artist && typeof item.artist !== "string") // Artist peut être optionnel selon ton type
      ) {
        throw new Error("Invalid object structure in JSON array.");
      }
    });

    return parsed;
  } catch (error: any) {
    throw new Error(`Invalid JSON output: ${error.message}`);
  }
};
