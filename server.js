import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import FormData from "form-data";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); 

const PORT = 3000;

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("model", "stable-diffusion-xl-v1");
    formData.append("output_format", "png");

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json",
          ...formData.getHeaders(), // Important!
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log(data);

    if (data?.image) {
      // If image is base64
      res.json({ images: [`data:image/png;base64,${data.image}`] });
    } else if (data?.images) {
      res.json({ images: data.images });
    } else {
      res.status(500).json({ error: "Failed to generate image", data });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
