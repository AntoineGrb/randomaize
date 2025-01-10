"use client";

import Loader from "@/components/Loader";
import Toggle from "@/components/Toggle";
import { generateTracklist } from "@/server-actions/openai/generateTracklist";
import { addTracksToPlaybackQueue } from "@/server-actions/spotify/addTracksToPlaybackQueue";
import { playOnActiveDevice } from "@/server-actions/spotify/play";
import { CustomTrack } from "@/types/custom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function GenerateClient({
  initialPlaylistItems,
  initialCustomTracks,
}: {
  initialPlaylistItems: any[];
  initialCustomTracks: CustomTrack[];
}) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [limit, setLimit] = useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate prompt
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);

    try {
      const generatedTracks = await generateTracklist(
        prompt,
        initialCustomTracks,
        limit
      );
      if (generatedTracks.error) {
        toast.error(generatedTracks.error);
        setPrompt("");
        return;
      }

      console.log("OpenAI Response - Generated tracks:", generatedTracks);

      const uris = generatedTracks.data?.map((track) => track.uri);

      if (!uris || uris.length === 0) {
        toast.error("No tracks generated");
        setPrompt("");
        return;
      }

      await addTracksToPlaybackQueue(uris);
      await playOnActiveDevice();
      toast.success("Playback queue successfully updated !");
      setPrompt("");
    } catch (error: any) {
      console.error("Error generating tracklist:", error);
      toast.error("Error generating tracklist: no active device found");

      setPrompt("");
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
      <div>
        <p> Selectionne le nombre de morceaux souhaités: </p>
        <Toggle value={limit} onChange={setLimit} options={[5, 10, 20, 50]} />
      </div>

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
        {isGenerating && <Loader />}
      </form>
    </div>
  );
}
