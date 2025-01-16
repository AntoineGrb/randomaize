import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing" });
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // Stock tokens in cookies/session (or state management if needed)
    res.setHeader("Set-Cookie", [
      `spotify_access_token=${access_token}; Path=/; HttpOnly; Max-Age=${expires_in}`,
      `spotify_refresh_token=${refresh_token}; Path=/; HttpOnly;`,
    ]);

    res.redirect("/playlists"); // Redirect to playlists page
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
