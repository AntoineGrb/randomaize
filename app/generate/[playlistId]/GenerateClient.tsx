"use client";

import { useState } from "react";
import { generateTracklist } from "@/server-actions/openai/generateTracklist";
import { CustomTrack } from "@/types/custom";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    console.log("Starting generation with prompt:", prompt);

    try {
      const limit = 15;
      const generated = await generateTracklist(
        prompt,
        initialCustomTracks,
        limit
      );
      console.log("OpenAI Response - Generated tracks:", generated);
      setGeneratedTracks(generated);
    } catch (error) {
      console.error("Error generating tracklist:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1>Generate</h1>
      <p>Playlist contains {initialPlaylistItems.length} tracks</p>

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
