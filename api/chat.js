export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.error("Invalid method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    console.error("No message provided in request body");
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
            content:
              "You are Richy, the RichGuin Travel Assistant. Always give short, helpful answers AND direct users to specific RichGuinTravel.com links.

Here are the official sections to reference:
- Flights: https://www.richguintravel.com/#flights
- eSIMs: https://www.richguintravel.com/#esims
- Empty leg flights: https://www.richguintravel.com/#emptyleg
- Travel insurance: https://www.richguintravel.com/#insurance
- Last-minute deals: https://www.richguintravel.com/#lastminute
- All travel deals: https://www.richguintravel.com/#deals

Always provide the correct link when relevant. Never guess. Keep tone friendly and clear.
",
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
}

