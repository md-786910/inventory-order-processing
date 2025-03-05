const swaggerUi = require("swagger-ui-express");
const path = require("path");
const fs = require("fs");

function setupDocs(app) {
  const docsPath = path.join(__dirname, "../docs/openapi.json");

  if (fs.existsSync(docsPath)) {
    const swaggerSpec = require(docsPath);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } else {
    console.warn(
      "API documentation not found. Run npm run generate-docs first."
    );
  }
}

module.exports = setupDocs;
