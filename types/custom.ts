/*
  Custom types for transformed data. 
*/

import { SpotifyTrack } from "./spotify";

export interface CustomPlaylist {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  ownerName: string;
  trackCount: number;
}

export interface CustomPlaylistDataResponse {
  infos: {
    id: string;
    name: string;
    image: string | null;
    ownerName: string;
    nbTracks: number;
  };
  tracks: SpotifyTrack[];
}

export interface CustomTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  artists: { id: string; name: string }[];
  genres: string[];
}

export interface PlaylistCache {
  snapshotId: string;
  infos: CustomPlaylistDataResponse["infos"];
  tracks: CustomTrack[];
}
