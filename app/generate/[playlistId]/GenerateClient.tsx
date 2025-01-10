"use client";

import { generateTracklist } from "@/server-actions/openai/generateTracklist";
import { addTracksToPlaybackQueue } from "@/server-actions/spotify/addTracksToPlaybackQueue";
import { playOnActiveDevice } from "@/server-actions/spotify/play";
import { CustomTrack } from "@/types/custom";
import { useState } from "react";

export default function GenerateClient({
  initialPlaylistItems,
  initialCustomTracks,
}: {
  initialPlaylistItems: any[];
  initialCustomTracks: CustomTrack[];
}) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);

    // Validate prompt
    if (!prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }

    try {
      const limit = 10;
      const generatedTracks = await generateTracklist(
        prompt,
        initialCustomTracks,
        limit
      );
      if (generatedTracks.error) {
        setError(generatedTracks.error);
        setSuccessMessage(null);
        return;
      }

      console.log("OpenAI Response - Generated tracks:", generatedTracks);

      const uris = generatedTracks.data?.map((track) => track.uri);
      console.log("Uris to add:", uris);
      if (!uris || uris.length === 0) {
        setError("No tracks were generated");
        setSuccessMessage(null);
        return;
      }

      await addTracksToPlaybackQueue(uris);
      setSuccessMessage("Adding tracks to the playback queue...");
      await playOnActiveDevice();
      setSuccessMessage("Tracks added to queue and playback started !");
    } catch (error: any) {
      console.error("Error generating tracklist:", error);
      setError(`An error occurred while generating the tracklist on device`);
      setSuccessMessage(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1>Generate</h1>
      <p>Playlist contains {initialPlaylistItems.length} tracks</p>
      <p>
        {" "}
        Les sons seront ajoutés à la suite de la file d'attente actuelle. Penser
        à la vider le cas échéant.{" "}
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          name="prompt"
          placeholder="Enter your prompt here"
          rows={5}
          cols={50}
        />
        <button type="submit" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </form>
    </div>
  );
}
