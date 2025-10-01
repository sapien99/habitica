import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API Key aus Umgebungsvariable
});

// Hilfsfunktion für Übersetzung
async function translateText(text, targetLanguage) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini", // günstig + schnell, alternativ gpt-4o
    messages: [
      {
        role: "system",
        content: `It's been a while since you've done any dusting in here, but you're not too worried—a little dust never hurt anyone, right? It's not until you stick your hand into one of the dustiest corners and feel something bite that you remember @InspectorCaracal's warning: leaving harmless dust sit too long causes it to turn into vicious dust bunnies! You'd better defeat them before they cover all of Habitica in fine particles of dirt!`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  return response.choices[0].message.content;
}

(async () => {
  const original = "Hallo, wie geht es dir?";
  const translated = await translateText(original, "Deutsch");
  console.log(`Original: ${original}`);
  console.log(`Translated: ${translated}`);
})();
