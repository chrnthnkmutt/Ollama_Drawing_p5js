# p5-ollama-image-guess

## Prerequisites

- [Node.js](https://nodejs.org/en) needs to be installed on your machine.
- [Ollama](https://ollama.com/) needs to be installed in advance.
- Also, download one or more models with `ollama pull <model_name>`.
- This source code uses the `llava` multimodal model.

## How to run

1. In Terminal, `cd` into this folder.
1. Run `npm install` to install the dependencies.
1. Run `npm run dev` to run the local server and the sketch.
1. Go to the URL displayed in the Terminal. ie. `http://localhost:5173`.

## Note

If you want to use OpenAI ChatGPT, you need to create a file `.env.local` and provide your own API key as `VITE_OPENAI_API_KEY=your-secret-key`. Make sure you don't share this key online, such as when you push the project online. Also, if you build and publish the project as is, the key in the env file will be exposed and included in the bundled script, which is really bad! It's best to create a server to handle API calls instead of front-end code. This project is a learning resource and not production-ready.

---

I would like to give a credit for DesignersDecode for this inspiring ideas for bringing this creativity project, which based on the sustainability.
