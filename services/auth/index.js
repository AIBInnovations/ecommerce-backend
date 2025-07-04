import express from "express";
import connectDB from "./config/database.js";
import config from "./config/config.js";

const app = express();

app.use(config.CORS_CONFIG);
console.log("> Cors:", config.CORS_ORIGIN);

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`> Welcome to the Scheduling API! Environment: ${config.NODE_ENV}`);
});

const startServer = async () => {
  await connectDB();
  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
