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
  const [generatedTracks, setGeneratedTracks] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    console.log("Starting generation with prompt:", prompt);

    try {
      const limit = 10;
      const generated = await generateTracklist(
        prompt,
        initialCustomTracks,
        limit
      );
      console.log("OpenAI Response - Generated tracks:", generated);

      const uris = generated.map((track) => track.uri);
      console.log("Uris to add:", uris);
      await addTracksToPlaybackQueue(uris);
      await playOnActiveDevice();
    } catch (error) {
      console.error("Error generating tracklist:", error);
      setError("An error occurred while generating the tracklist");
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
