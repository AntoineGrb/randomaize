"use client";

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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function GenerateClient({ playlistId }: { playlistId: string }) {
  const [playlistData, setPlaylistData] = useState<PlaylistCache | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Vérification et mise à jour du cache
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate prompt
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive", // Utilise une variante pour les erreurs
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Check if a device is active
      const deviceCheck = await checkDevice();
      if (deviceCheck.error) {
        toast({
          title: "Error",
          description: deviceCheck.error,
          variant: "destructive",
        });
        setIsGenerating(false);
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
        toast({
          title: "Error",
          description: generatedTracks.error,
          variant: "destructive",
        });
        return;
      }

      console.log("Client side - Generated tracks:", generatedTracks);
      const uris = generatedTracks.data;

      if (!uris || uris.length === 0) {
        toast({
          title: "Error",
          description: "No tracks generated",
          variant: "destructive",
        });
        return;
      }

      const play = await addTracksAndPlay(uris);
      if (play.error) {
        toast({
          title: "Error",
          description: play.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Tracks added and played on your Spotify device!",
          duration: 2000,
          variant: "default", // Variante par défaut pour les succès
        });
        setPrompt("");
      }
    } catch (error: any) {
      console.error("Error generating tracklist:", error);
      toast({
        title: "Error",
        description: "Error generating tracklist: no active device found",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 py-24">
      <div className="flex gap-2 justify-start items-center mb-24">
        {playlistData?.infos?.image && (
          <img
            src={playlistData?.infos.image}
            alt={playlistData?.infos.name}
            className="w-10 h-10 rounded"
          />
        )}
        <p>{playlistData?.infos?.name} </p>
      </div>
      <h1 className="mb-4 text-center">Que veux-tu écouter ? </h1>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Je veux des sons calmes, de la techno minimale..."
          className="mb-6"
        />
        <div className="flex gap-2 justify-start items-center mb-4">
          <p> Morceaux souhaités : </p>
          <ToggleGroup
            type="single"
            variant="outline"
            size="lg"
            value={limit.toString()}
            defaultValue="10"
            onValueChange={(value) => setLimit(parseInt(value))}
          >
            <ToggleGroupItem value="2">2</ToggleGroupItem>
            <ToggleGroupItem value="10">10</ToggleGroupItem>
            <ToggleGroupItem value="20">20</ToggleGroupItem>
            <ToggleGroupItem value="50">50</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex justify-center">
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate"}
            {isGenerating && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
