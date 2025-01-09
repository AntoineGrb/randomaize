export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: { total: number };
}

export interface SpotifyPlaylistsResponse {
  items: SpotifyPlaylist[];
  total: number;
}
