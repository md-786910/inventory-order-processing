const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class DocGenerator {
  static async generateApiDocs(routePath) {
    const routeContent = fs.readFileSync(routePath, 'utf8');
    
    const prompt = `Generate OpenAPI 3.0 documentation for this Express.js route:\n${routeContent}`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    return completion.choices[0].message.content;
  }

  static async generateFullDocs() {
    const routesDir = path.join(__dirname, '../routes');
    const routeFiles = fs.readdirSync(routesDir);
    const docs = [];

    for (const file of routeFiles) {
      if (file.endsWith('.js')) {
        const doc = await this.generateApiDocs(path.join(routesDir, file));
        docs.push(doc);
      }
    }

    return docs.join('\n');
  }
}

module.exports = DocGenerator;