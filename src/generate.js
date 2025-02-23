import ollama from "ollama/browser";
import OpenAI from "openai";

export async function generateOpenai(provider, prompt, canvas) {
  const base64string = canvas.toDataURL();
  const client = new OpenAI({
    baseURL:
      provider === "openai"
        ? "https://api.openai.com/v1"
        : "http://localhost:11434/v1/",
    apiKey:
      provider === "openai" ? import.meta.env.VITE_OPENAI_API_KEY : "ollama",
    dangerouslyAllowBrowser: true,
  });

  const response = await client.chat.completions.create({
    model: provider === "openai" ? "gpt-4o-mini" : "llava",
    max_tokens: 30,
    // between 0 and 2. Higher values will make the output more random,
    // while lower values like 0.2 will make it more focused and deterministic.
    // Set this or `top_p` but not both.
    temperature: 0.8,
    // top_p: 0.5,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: base64string,
              detail: "low",
            },
          },
        ],
      },
    ],
  });
  const guess = response.choices[0].message.content;
  console.log(guess);
  return guess;
}

export async function generateOllama(prompt, canvas) {
  const image = canvas.toDataURL().split(",")[1];
  const response = await ollama.generate({
    model: "llava",
    prompt: prompt,
    images: [image],
    // https://github.com/ollama/ollama/blob/main/docs/modelfile.md#parameter
    options: {
      /**
       * Increasing the temperature will make the model answer more creatively.
       * (Default: 0.8)
       */
      temperature: 0.8,
      /**
       * Maximum number of tokens to predict when generating text.
       * (Default: 128, -1 = infinite generation, -2 = fill context)
       */
      num_predict: 20,
      /**
       * Reduces the probability of generating nonsense.
       * A higher value (e.g. 100) will give more diverse answers,
       * while a lower value (e.g. 10) will be more conservative.
       * (Default: 40)
       */
      // top_k: 80,
      /**
       * A higher value (e.g., 0.95) will lead to more diverse text,
       * while a lower value (e.g., 0.5) will generate more focused and conservative text.
       * (Default: 0.9)
       */
      // top_p: 0.5,
    },
  });
  const guess = response.response;
  console.log(guess);
  return guess;
}
