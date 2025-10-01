import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API Key aus Umgebungsvariable
});

// Hilfsfunktion für Übersetzung
async function translateText(text, targetLanguage) {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini", // günstig + schnell, alternativ gpt-4o
    messages: [
      {
        role: "user",
        content: text,
      },
    ],
  });

  return response.choices[0].message.content;
}

(async () => {
  const original = "It's been a while since you've done any dusting in here"
  const translated = await translateText(original, "English");
  console.log(`Original: ${original}`);
  console.log(`Translated: ${translated}`);
})();
