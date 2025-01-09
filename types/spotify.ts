//Playlists
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

//Tracks
export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  artists: { name: string }[];
}

export interface SpotifyPlaylistItemsResponse {
  items: { track: SpotifyTrack }[];
  total: number;
}

//Audio Features
export interface AudioFeatures {
  id: string;
  energy: number;
  danceability: number;
  instrumentalness: number;
  tempo: number;
  valence: number;
  speechiness: number;
}

export interface SpotifyAudioFeaturesResponse {
  audio_features: AudioFeatures[];
}
