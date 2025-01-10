export interface CustomPlaylist {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  trackCount: number;
}

export interface CustomTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  artists: { id: string; name: string }[];
  genres: string[];
}

export interface CustomTrackReturnedByAI {
  uri: string;
  name: string; //TODO : à  retirer
}
