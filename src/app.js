require("./config/env");
const express = require("express");
const { connectDB } = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorHandler");
const swaggerUi = require("swagger-ui-express");
const DocGenerator = require("./utils/docGenerator");
const swaggerSpec = require("./swagger");
const setupDocs = require("./middleware/docsMiddleware");

const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
// Add Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling
app.use(errorHandler);

// Generate and serve API documentation
async function setupDocs1(app) {
  try {
    const apiDocs = await DocGenerator.generateFullDocs();
    const swaggerSpec = JSON.parse(apiDocs);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  } catch (error) {
    console.error("Failed to generate API documentation:", error);
  }
}

// Setup API documentation
if (process.env.NODE_ENV === "development") {
  setupDocs1(app);
}

// Start server
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

module.exports = app;
