import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  res.setHeader(
    "Set-Cookie",
    "spotify_access_token=; Max-Age=0; Path=/; HttpOnly; Secure"
  );

  res.status(200).json({ succes: true });
}
