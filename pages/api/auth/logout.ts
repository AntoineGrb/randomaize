import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Supprime le cookie contenant le token
  res.setHeader(
    "Set-Cookie",
    "spotify_access_token=; Max-Age=0; Path=/; HttpOnly; Secure"
  );
  res.redirect("/login"); // Redirige vers la page de login
}
