import p5 from "p5";
import { generateOllama, generateOpenai } from "./generate";

const providers = [`ollama`, `openai`];

const prompts = [
  `Guess what this image is.`,
  `Name a painter who could be the creator of this artwork.`,
  `Guess who this cartoon character is.`,
  `Create a funny caption to the drawing.`,
  `How do I use it? (funny answer please)`,
];

/** @param {p5} p */
const sketch = (p) => {
  let colorPicker;
  let generating = false;

  let clear = false;

  let paths = [];
  let path = [];

  let pathColor = `black`;
  let brushSize = 20;

  let guess = "";

  let p5Canvas;

  p.setup = () => {
    const canvasElt = document.querySelector("#my-canvas");
    const w = 600;
    const h = 600;
    canvasElt.width = w;
    canvasElt.height = h;
    p5Canvas = p.createCanvas(w, h, p.P2D, canvasElt);
    p.pixelDensity(1);

    const guessP = p.select("#guess");

    const promptSelect = p.select("select.prompt");
    promptSelect.addClass("prompt");
    for (const prompt of prompts) {
      promptSelect.option(prompt);
    }

    const providerSelect = p.select("select.provider");
    providerSelect.addClass("provider");
    for (const provider of providers) {
      providerSelect.option(provider);
    }

    const generateButton = p.select("button.ask");
    generateButton.mouseClicked(async () => {
      try {
        generating = true;

        const prompt =
          promptSelect.selected() +
          `
Response must be short in 1 to 7 words.
Return answer only and nothing else.
`;
        console.log("Prompt received:");
        console.log(prompt);
        const provider = providerSelect.selected();
        console.log("Generating...");

        generateButton.attribute("disabled", true);
        // use Ollama API
        // const guess = await generateOllama(prompt, canvasElt);
        // use OpenAI API
        guess = await generateOpenai(provider, prompt, canvasElt);
        guessP.attribute("title", guess.trim());
        guessP.html(guess.trim());
      } catch (e) {
        console.error(e);
        guess = "";
        guessP.attribute("title", guess);
        guessP.html(`${e.name || "Error"} 😵`);
      }
      generating = false;
      generateButton.removeAttribute("disabled");
    });

    const clearButton = p.select("button.clear");
    clearButton.mouseClicked(() => {
      clear = true;
      guess = "";
      guessP.attribute("title", guess);
      guessP.html(guess);
      paths = [];
    });

    colorPicker = p.select("input[type=color].colorpicker");

    const saveButton = p.select("button.save");
    saveButton.mouseClicked(() => {
      p.saveCanvas(
        p5Canvas,
        guess
          .trim()
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .slice(0, 40),
      );
    });

    p.strokeCap(p.ROUND);
    p.strokeJoin(p.ROUND);
  };

  p.draw = () => {
    p.background(255);

    p.noFill();
    for (const { points, col, weight } of paths) {
      p.stroke(col);
      p.strokeWeight(weight);
      p.beginShape();
      for (const pt of points) {
        p.vertex(pt[0], pt[1]);
      }
      p.endShape();
    }

    // current path preview
    p.noFill();
    p.stroke(colorPicker.value());
    p.strokeWeight(brushSize);
    p.beginShape();
    for (const pt of path) {
      p.vertex(pt[0], pt[1]);
    }
    p.endShape();

    p.noFill();
    p.stroke(100);
    p.strokeWeight(1);
    p.circle(p.mouseX, p.mouseY, brushSize);
  };

  p.keyPressed = () => {
    if (p.key === "[") {
      brushSize -= 10;
    } else if (p.key === "]") {
      brushSize += 10;
    }
    brushSize = p.constrain(brushSize, 10, 200);
  };

  p.mousePressed = () => {
    pathColor = colorPicker.value();
    path.push([p.mouseX, p.mouseY]);
  };

  p.mouseDragged = () => {
    const lastPt = path[path.length - 1];
    const currPt = [p.mouseX, p.mouseY];
    if (p.dist(lastPt[0], lastPt[1], currPt[0], currPt[1]) > 5) {
      path.push(currPt);
    }
  };
  p.mouseReleased = () => {
    paths.push({ points: path, col: pathColor, weight: brushSize });
    path = [];
  };
};

new p5(sketch);
