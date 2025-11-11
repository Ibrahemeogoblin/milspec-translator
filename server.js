import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).send({ error: errorData });
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    res.json({ text: content });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Server error calling Gemini API' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
