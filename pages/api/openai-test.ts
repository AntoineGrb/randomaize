import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    const prompt = "Salut";
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          // {role:"system", content:"You are xxx"},
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error response:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Something went wrong.",
    });
  }
}
