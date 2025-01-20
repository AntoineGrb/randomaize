"use client";

import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import { generateTracklist } from "@/server-actions/openai/generateTracklist";
import { addTracksAndPlay } from "@/server-actions/spotify/addTracksAndPlay";
import { checkDevice } from "@/server-actions/spotify/checkDevice";
import { initializePlaylistData } from "@/server-actions/spotify/initializePlaylistData";
import { PlaylistCache } from "@/types/custom";
import { checkCacheAndUpdate } from "@/utils/checkCacheAndUpdate";
import { getRandomSample } from "@/utils/getRandomSample";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function GenerateClient({ playlistId }: { playlistId: string }) {
  const [playlistData, setPlaylistData] = useState<PlaylistCache | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Verify cache and update if necessary on first render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkCacheAndUpdate(
          playlistId,
          initializePlaylistData
        );
        setPlaylistData(data);
      } catch (err: any) {
        console.error("Error fetching playlist data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playlistId]);

  // Handle form submission when asking AI to generate a tracklist
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate prompt
    if (!prompt.trim()) {
      setError("Il faut écrire un prompt !");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      // Check if a device is active before requests
      //! Lien à tester : https://open.spotify.com/track/2bmgv7q8RgC0NgF9SlGlpe
      const deviceCheck = await checkDevice();
      if (deviceCheck.error) {
        setError(deviceCheck.error);
        return;
      }

      const sampledTracks = getRandomSample(playlistData!.tracks, 50); // Sample 50 random tracks
      console.log("Client side - Sampled tracks:", sampledTracks);

      // Generate tracks
      const generatedTracks = await generateTracklist(
        prompt,
        sampledTracks,
        limit
      );
      if (generatedTracks.error) {
        setError(generatedTracks.error);
        return;
      }

      console.log("Client side - Generated tracks:", generatedTracks);
      const uris = generatedTracks.data;

      if (!uris || uris.length === 0) {
        setError("Pas de morceaux générés.");
        return;
      }

      const play = await addTracksAndPlay(uris);
      if (play.error) {
        setError(play.error);
      } else {
        toast({
          title: "Success",
          description: "Liste de lecture ajoutée et lancée sur Spotify!",
          duration: 1500,
          variant: "default",
        });
        setPrompt("");
      }
    } catch (error: any) {
      console.error("Error generating tracklist:", error);
      setError("Erreur pendant la génération de la liste de lecture.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviousPage = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <Loader></Loader>
      </div>
    );
  }

  return (
    <div className="px-4 py-24">
      <div className="flex gap-2 justify-start items-center mb-24">
        <ChevronLeft onClick={handlePreviousPage} className="cursor-pointer" />
        {playlistData?.infos?.image && (
          <img
            src={playlistData?.infos.image}
            alt={playlistData?.infos.name}
            className="w-10 h-10 rounded"
          />
        )}
        <p>{playlistData?.infos?.name} </p>
      </div>
      <div className="flex gap-1 justify-center items-center mb-4">
        <img
          src="/assets/icon-robot.png"
          alt="icon"
          className="w-[40px] top-[-3px] relative"
        />
        <h1 className="text-center">Que veux-tu écouter ? </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Des sons calmes, de la techno minimale..."
          className="mb-6 border border-spotify-gray-light bg-spotify-black text-spotify-white placeholder:text-spotify-gray-light"
        />
        <div className="flex gap-2 justify-start items-center mb-6">
          <p> Nombre de morceaux : </p>
          <ToggleGroup
            type="single"
            variant="outline"
            size="lg"
            value={limit.toString()}
            defaultValue="10"
            onValueChange={(value) => setLimit(parseInt(value))}
          >
            <ToggleGroupItem value="5">5</ToggleGroupItem>
            <ToggleGroupItem value="10">10</ToggleGroupItem>
            <ToggleGroupItem value="20">20</ToggleGroupItem>
            <ToggleGroupItem value="30">30</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 bg-spotify-green text-white disabled:bg-spotify-gray-dark disabled:text-white hover:bg-green-600"
          >
            {isGenerating ? "En cours..." : "Génerer"}
            {isGenerating && <Loader2 className="animate-spin" />}
          </Button>
          <p className="text-red-500 text-xs text-center">{error}</p>
        </div>
      </form>
    </div>
  );
}
