const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(express.json());
 app.use(express.static("public"));

const API_KEY = "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";

app.post("/generate", async (req, res) => {
  const { niche, offer, goal, comments } = req.body;

  let prompt = `
You are an outreach expert.
Create:
1. Cold Instagram DM
2. Follow-up message 1
3. Follow-up message 2

Target niche: ${niche}
Offer: ${offer}
Goal: ${goal}

Also analyze these Instagram comments and identify possible leads:
${comments}
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    res.json({
      result: data.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.json({ result: "Error generating message" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
