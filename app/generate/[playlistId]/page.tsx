// page.tsx
import GenerateClient from "./GenerateClient";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

// Server component to generate client side component
export default async function GeneratePage({ params }: PageProps) {
  const { playlistId } = await params;
  return <GenerateClient playlistId={playlistId} />;
}
