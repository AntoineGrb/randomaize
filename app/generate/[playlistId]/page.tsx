// page.tsx
import { getArtistGenres } from "@/server-actions/spotify/getArtistsGenres";
import { getPlaylistData } from "@/server-actions/spotify/getPlaylistData";
import { CustomPlaylistDataResponse, CustomTrack } from "@/types/custom";
import { getRandomSample } from "@/utils/getRandomSample";
import GenerateClient from "./GenerateClient";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

// Server component to generate client side component
export default async function GeneratePage({ params }: PageProps) {
  const { playlistId } = await params;
  return <GenerateClient playlistId={playlistId} />;
}
