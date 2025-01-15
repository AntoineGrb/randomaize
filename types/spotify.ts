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

export interface SpotifyPlaylistResponse {
  id: string;
  name: string;
  description: string;
  images: { url: string; height?: number; width?: number }[];
  tracks: {
    total: number;
    items: { track: SpotifyTrack }[];
  };
}

//Tracks
export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  artists: { id: string; name: string }[];
}

//Artists
export interface SpotifyArtistGenre {
  artistId: string;
  genres: string[];
}

export interface SpotifyArtistsResponse {
  artists: {
    id: string;
    genres: string[];
  }[];
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
