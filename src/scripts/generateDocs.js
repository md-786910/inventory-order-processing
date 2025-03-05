require("dotenv").config({});
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeRoute(filePath) {
  const code = fs.readFileSync(filePath, "utf8");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an API documentation expert. Generate OpenAPI 3.0 specification for the given Express.js route.",
      },
      {
        role: "user",
        content: code,
      },
    ],
    temperature: 0.2,
  });

  return completion.choices[0].message.content;
}

async function generateDocs() {
  const routesDir = path.join(__dirname, "../routes");
  const outputPath = path.join(__dirname, "../docs/openapi.json");

  const routes = fs
    .readdirSync(routesDir)
    .filter((file) => file.endsWith(".js"));

  const specs = await Promise.all(
    routes.map((file) => analyzeRoute(path.join(routesDir, file)))
  );

  const combinedSpec = {
    openapi: "3.0.0",
    info: {
      title: "Order Processing System API",
      version: "1.0.0",
      description: "API documentation for the Order Processing System",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    paths: {},
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  };

  specs.forEach((spec) => {
    const parsedSpec = JSON.parse(spec);
    Object.assign(combinedSpec.paths, parsedSpec.paths);
    Object.assign(combinedSpec.components, parsedSpec.components || {});
  });

  await writeFile(outputPath, JSON.stringify(combinedSpec, null, 2));
  console.log("API documentation generated successfully!");
}

generateDocs().catch(console.error);
