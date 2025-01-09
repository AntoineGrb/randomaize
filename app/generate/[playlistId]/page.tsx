import { getArtistGenres } from "@/server-actions/spotify/getArtistsGenres";
import { getPlaylistItems } from "@/server-actions/spotify/getPlaylistItems";
import { CustomTrack } from "@/types/custom";

export default async function GeneratePage({
  params,
}: {
  params: { playlistId: string };
}) {
  const playlistId = params.playlistId;

  //Get playlist items
  const playlistItems = await getPlaylistItems(playlistId);
  console.log("tracks", playlistItems);

  //Get genres for each track
  const artistsIds = playlistItems.map((item) => item.artists[0].id);
  const artistsGenres = await getArtistGenres(artistsIds);
  console.log("genres", artistsGenres);

  //Set custom track's object
  const customTracks: CustomTrack[] = playlistItems.map((track) => {
    const artistId = track.artists[0].id;
    const artistGenres = artistsGenres.find(
      (artist) => artist.artistId === artistId
    );
    return {
      id: track.id,
      name: track.name,
      artists: track.artists,
      genres: artistGenres?.genres || [],
      uri: track.uri,
      duration_ms: track.duration_ms,
    };
  });
  console.log("customTracks", customTracks);

  return (
    <div>
      <h1>Generate</h1>
      <p>Playlist contains {playlistItems.length} tracks</p>

      <form>
        <textarea
          name="prompt"
          placeholder="Enter your prompt here"
          rows={5}
          cols={50}
        />
        <button type="submit">Generate</button>
      </form>
    </div>
  );
}
