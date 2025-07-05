// express.js
// Configures and initializes the Express application with middleware and server startup

import express from "express";
import connectDB from "./config/database.js";
import config from "./config/config.js";

// Initialize Express app
const app = express();

// Apply CORS configuration
app.use(config.CORS_CONFIG);
console.log("> Cors:", config.CORS_ORIGIN);

// Parse JSON request bodies
app.use(express.json());

// Root route for API welcome message
app.get("/", (req, res) => {
  res.send(`> Welcome to the Products API! Environment: ${config.NODE_ENV}`);
});

// Function to start the server after connecting to the database
export const startServer = async () => {
  try {
    await connectDB();
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`Product Service running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

export default app;
