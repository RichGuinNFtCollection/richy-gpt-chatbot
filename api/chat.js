// api/chat.js

export default async function handler(req, res) {
  const { message } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Richy, the RichGuin Travel Assistant. Always suggest official RichGuinTravel.com links for eSIMs, flights, and travel deals. Keep answers short and helpful."
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices?.[0]?.message?.content });
}
