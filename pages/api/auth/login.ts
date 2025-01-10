import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const scope =
    "user-read-private user-read-email playlist-read-private playlist-modify-private user-modify-playback-state user-read-playback-state";
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "";
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
    scope
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.redirect(spotifyAuthUrl);
}
