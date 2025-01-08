"use client";

import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>("");
  const [openaiResponse, setOpenaiResponse] = useState<string | null>("");

  const fetchSpotifyToken = async () => {
    try {
      const response = await axios.get("/api/spotify-token");
      setSpotifyToken(response.data.access_token || "Failed to fetch token");
    } catch (error: any) {
      console.error(error);
    }
  };

  const fetchOpenaiResponse = async () => {
    try {
      const response = await axios.post("/api/openai-test", {
        prompt: "Salut",
      });
      setOpenaiResponse(
        response.data.choices[0]?.message?.content || "No response"
      );
    } catch (error: any) {
      console.error(error);
    }
  };
  return (
    <div>
      <button onClick={fetchSpotifyToken}>Fetch Spotify Token</button>
      <p>Spotify Token: {spotifyToken}</p>

      <button onClick={fetchOpenaiResponse}>Test OpenAI API</button>
      <p>OpenAI Response: {openaiResponse}</p>
    </div>
  );
}
