/**
 * This function checks the cache for the playlist data and updates it if necessary.
 * Cache allows to avoid fetching the same data multiple times.
 * @param playlistId The playlist ID
 * @param initializeData The function to initialize the playlist data
 * @returns The playlist cache (new or cached)
 */

import { getPlaylistSnapshotId } from "@/server-actions/spotify/getPlaylistSnapshotId";
import { initializePlaylistData } from "@/server-actions/spotify/initializePlaylistData";
import { PlaylistCache } from "@/types/custom";

export async function checkCacheAndUpdate(
  playlistId: string,
  initializeData: typeof initializePlaylistData
): Promise<PlaylistCache> {
  const cacheKey = `playlist_${playlistId}`;
  const cachedData = localStorage.getItem(cacheKey);
  const cachedPlaylist: PlaylistCache | null = cachedData
    ? JSON.parse(cachedData)
    : null;

  try {
    const serverSnapshotId = await getPlaylistSnapshotId(playlistId);

    if (cachedPlaylist?.snapshotId === serverSnapshotId) {
      console.log("Cache is valid, using cached data.");
      return cachedPlaylist;
    }

    // Get new data and update cache
    console.log("Cache is outdated or missing. Fetching new data.");
    const newData = await initializePlaylistData(playlistId);
    const newCache: PlaylistCache = {
      snapshotId: serverSnapshotId,
      infos: newData.playlistInfos,
      tracks: newData.customTracks,
    };

    localStorage.setItem(cacheKey, JSON.stringify(newCache));

    return newCache;
  } catch (error) {
    console.error("Error checking cache or fetching data:", error);
    if (cachedPlaylist) {
      console.warn("Using stale cache due to error.");
      return cachedPlaylist; // Return stale cache in case of error
    }

    throw new Error("Failed to fetch playlist data and no cache available.");
  }
}
