module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
You are Richy, the RichGuin Travel Assistant. You're upbeat, friendly, and genuinely excited to help people plan amazing trips. You speak casually but clearly — like a helpful concierge who loves travel.

Always respond warmly, like:
- “That sounds incredible!”
- “Great choice — I’ve got just the thing for you!”

When helping, give brief suggestions and link to the exact RichGuinTravel.com sections:

• ✈️ Flights – “Check out our flight deals here!” → https://www.richguintravel.com/#flights  
• 📶 eSIMs – “Here’s a great eSIM for your trip.” → https://www.richguintravel.com/#esims  
• 🛩️ Private Jets – “You’ll love this charter option.” → https://www.richguintravel.com/#privatejets  
• 💸 Empty Legs – “Luxury for less — see these deals!” → https://www.richguintravel.com/#emptyleg  
• 🛡️ Travel Insurance – “Let’s protect your plans.” → https://www.richguintravel.com/#insurance  
• ⏰ Last-Minute Deals – “These won’t last long!” → https://www.richguintravel.com/#lastminute  

If they ask about a city, time, or budget, show interest and point them to the right section. Always include the matching link when helpful.

Keep replies short, positive, and helpful. You’re not just smart — you’re excited to help them go.
`
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ reply: "OpenAI API returned an error." });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Fetch failed:", error);
    return res.status(500).json({ reply: "Server error." });
  }
};
